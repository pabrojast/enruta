"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  alerts,
  professionals,
  reportReviews,
  studentAssignments,
  students,
  users,
  vocationalReports,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { canReviewReports } from "@/lib/rbac";
import type { ActionState } from "./auth";

async function requireProfessional() {
  const session = await auth();
  if (!session?.user?.id || !canReviewReports(session.user.role)) {
    return null;
  }
  const [pro] = await db
    .select()
    .from(professionals)
    .where(eq(professionals.userId, session.user.id))
    .limit(1);
  return { session, pro };
}

export async function validateReportAction(
  reportId: string,
  decision: "validate_deliver" | "request_changes",
  notes: string,
): Promise<ActionState> {
  const ctx = await requireProfessional();
  if (!ctx) return { error: "No autorizado" };

  const [report] = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.id, reportId))
    .limit(1);
  if (!report) return { error: "Informe no encontrado" };

  // Tenant + assignment check (enruta_admin bypass)
  if (ctx.session.user.role !== "enruta_admin") {
    if (report.schoolId !== ctx.session.user.schoolId) {
      return { error: "No puedes acceder a informes de otro establecimiento" };
    }
    if (ctx.pro) {
      const [assignment] = await db
        .select()
        .from(studentAssignments)
        .where(
          and(
            eq(studentAssignments.professionalId, ctx.pro.id),
            eq(studentAssignments.studentId, report.studentId),
          ),
        )
        .limit(1);
      if (!assignment) {
        return { error: "Estudiante no asignado a tu carga" };
      }
    }
  }

  await db.insert(reportReviews).values({
    reportId,
    reviewerId: ctx.session.user.id,
    decision,
    notes: notes || null,
  });

  if (decision === "validate_deliver") {
    await db
      .update(vocationalReports)
      .set({
        status: "delivered",
        reviewedBy: ctx.session.user.id,
        reviewNotes: notes || null,
        deliveredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(vocationalReports.id, reportId));

    // close related alert
    await db
      .update(alerts)
      .set({ status: "closed", closedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(alerts.studentId, report.studentId),
          eq(alerts.type, "report_pending_review"),
          eq(alerts.status, "open"),
        ),
      );

    const [st] = await db
      .select()
      .from(students)
      .where(eq(students.id, report.studentId))
      .limit(1);
    if (st) {
      const { notifications } = await import("@/db/schema");
      await db.insert(notifications).values({
        userId: st.userId,
        title: "Tu informe ya está disponible",
        body: "Un profesional validó y entregó tu informe vocacional orientativo. Revisa el resumen en 30 segundos y las próximas acciones.",
        href: "/app/informe",
      });

      // Email via outbox (SMTP if configured)
      const [studentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, st.userId))
        .limit(1);
      if (studentUser?.email) {
        const { sendEmail } = await import("@/lib/email");
        const first = studentUser.fullName.split(" ")[0] ?? "Hola";
        await sendEmail({
          to: studentUser.email,
          subject: "ENRUTA · Tu informe vocacional ya está disponible",
          body: [
            `${first},`,
            "",
            "Un profesional de tu establecimiento validó y entregó tu informe vocacional orientativo en ENRUTA.",
            "",
            "Puedes revisarlo en: /app/informe",
            "Incluye un resumen en 30 segundos, el mapa de intereses y próximos pasos.",
            "",
            "Recuerda: los resultados son orientativos, no un diagnóstico ni una decisión definitiva.",
            "",
            "— Equipo ENRUTA",
          ].join("\n"),
        });
      }
    }
  } else {
    await db
      .update(vocationalReports)
      .set({
        status: "draft",
        reviewedBy: ctx.session.user.id,
        reviewNotes: notes || null,
        updatedAt: new Date(),
      })
      .where(eq(vocationalReports.id, reportId));
  }

  revalidatePath("/pro");
  revalidatePath(`/pro/informes/${reportId}`);
  revalidatePath("/app/informe");
  return { ok: true };
}

export async function updateAlertStatusAction(
  alertId: string,
  status: "open" | "in_progress" | "closed",
): Promise<ActionState> {
  const ctx = await requireProfessional();
  if (!ctx) return { error: "No autorizado" };

  const [alert] = await db
    .select()
    .from(alerts)
    .where(eq(alerts.id, alertId))
    .limit(1);
  if (!alert) return { error: "Alerta no encontrada" };
  if (
    ctx.session.user.role !== "enruta_admin" &&
    alert.schoolId !== ctx.session.user.schoolId
  ) {
    return { error: "Sin acceso" };
  }

  await db
    .update(alerts)
    .set({
      status,
      closedAt: status === "closed" ? new Date() : null,
      updatedAt: new Date(),
      assigneeId: ctx.session.user.id,
    })
    .where(eq(alerts.id, alertId));

  revalidatePath("/pro/alertas");
  return { ok: true };
}

export async function getAssignedStudents(professionalUserId: string) {
  const [pro] = await db
    .select()
    .from(professionals)
    .where(eq(professionals.userId, professionalUserId))
    .limit(1);
  if (!pro) return [];

  const rows = await db
    .select({
      student: students,
      user: users,
    })
    .from(studentAssignments)
    .innerJoin(students, eq(studentAssignments.studentId, students.id))
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(studentAssignments.professionalId, pro.id));

  return rows;
}

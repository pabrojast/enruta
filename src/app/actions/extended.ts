"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomInt } from "crypto";
import { db } from "@/db";
import {
  commercialPlans,
  eventMaterials,
  featureFlags,
  guardianAuthRequests,
  guardianStudents,
  guardians,
  institutionalDiagnostics,
  notifications,
  schoolPlans,
  students,
  users,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { syncSchoolDirectoryStub } from "@/lib/mineduc";
import { validateAndStoreUpload } from "@/lib/uploads";
import type { ActionState } from "./auth";
import bcrypt from "bcryptjs";

async function requireRoles(roles: string[]) {
  const session = await auth();
  if (!session?.user || !roles.includes(session.user.role)) return null;
  return session;
}

export async function saveInstitutionalDiagnosticAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRoles([
    "school_admin",
    "enruta_admin",
    "counselor",
  ]);
  if (!session) return { error: "No autorizado" };

  const schoolId =
    session.user.role === "enruta_admin"
      ? String(formData.get("schoolId") || session.user.schoolId || "")
      : session.user.schoolId;
  if (!schoolId) return { error: "Selecciona un establecimiento" };

  const data = {
    modality: (String(formData.get("modality") || "HC") as "HC" | "TP" | "mixed"),
    studentCount: Number(formData.get("studentCount") || 0) || null,
    coursesSummary: String(formData.get("coursesSummary") || ""),
    specialties: String(formData.get("specialties") || ""),
    needs: String(formData.get("needs") || ""),
    territorialContext: String(formData.get("territorialContext") || ""),
    connectivity: String(formData.get("connectivity") || "media"),
    teamAvailable: String(formData.get("teamAvailable") || ""),
    expectations: String(formData.get("expectations") || ""),
    objectives: String(formData.get("objectives") || ""),
    pei: String(formData.get("pei") || ""),
    pme: String(formData.get("pme") || ""),
    existingActivities: String(formData.get("existingActivities") || ""),
    alliances: String(formData.get("alliances") || ""),
    localOffer: String(formData.get("localOffer") || ""),
  };

  const reportContent = buildDiagnosticReport({
    ...data,
    schoolId,
  });

  await db.insert(institutionalDiagnostics).values({
    schoolId,
    createdBy: session.user.id,
    ...data,
    reportContent,
    status: "generated",
    updatedAt: new Date(),
  });

  revalidatePath("/colegio/diagnostico");
  revalidatePath("/admin/planes");
  return { ok: true };
}

function buildDiagnosticReport(d: Record<string, unknown>) {
  return [
    "INFORME DIAGNÓSTICO INSTITUCIONAL ENRUTA",
    "",
    `Modalidad: ${d.modality}`,
    `Estudiantes estimados: ${d.studentCount ?? "—"}`,
    `Conectividad: ${d.connectivity}`,
    "",
    "1. Contexto y territorio",
    String(d.territorialContext || "Sin detalle"),
    "",
    "2. PEI",
    String(d.pei || "Sin detalle"),
    "",
    "3. PME",
    String(d.pme || "Sin detalle"),
    "",
    "4. Necesidades detectadas",
    String(d.needs || "Sin detalle"),
    "",
    "5. Equipo disponible",
    String(d.teamAvailable || "Sin detalle"),
    "",
    "6. Actividades existentes y alianzas",
    String(d.existingActivities || "—"),
    String(d.alliances || "—"),
    "",
    "7. Oferta local de educación y empleo",
    String(d.localOffer || "—"),
    "",
    "8. Propuesta de configuración ENRUTA",
    "- Activar autoconocimiento en 1° y 2° medio",
    "- Exploración y eventos en 3° medio",
    "- Proyecto de vida y seguimiento en 4° medio",
    "- Ajustar catálogo según especialidades TP y territorio",
    d.connectivity === "baja"
      ? "- Priorizar actividades descargables / presenciales por baja conectividad"
      : "- Habilitar módulos online completos",
    "",
    "Este informe es orientativo y debe validarse con el equipo directivo.",
  ].join("\n");
}

export async function assignPlanAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRoles(["enruta_admin"]);
  if (!session) return { error: "No autorizado" };
  const schoolId = String(formData.get("schoolId") || "");
  const planId = String(formData.get("planId") || "");
  if (!schoolId || !planId) return { error: "Datos incompletos" };

  const [plan] = await db
    .select()
    .from(commercialPlans)
    .where(eq(commercialPlans.id, planId))
    .limit(1);
  if (!plan) return { error: "Plan no encontrado" };

  await db.delete(schoolPlans).where(eq(schoolPlans.schoolId, schoolId));
  await db.insert(schoolPlans).values({
    schoolId,
    planId,
    status: "active",
  });

  // sync feature flags from plan modules
  const modules = (plan.modules as string[]) || [];
  for (const key of modules) {
    const [existing] = await db
      .select()
      .from(featureFlags)
      .where(
        and(eq(featureFlags.schoolId, schoolId), eq(featureFlags.key, key)),
      )
      .limit(1);
    if (existing) {
      await db
        .update(featureFlags)
        .set({ enabled: true, planCode: plan.code })
        .where(eq(featureFlags.id, existing.id));
    } else {
      await db.insert(featureFlags).values({
        schoolId,
        key,
        enabled: true,
        planCode: plan.code,
      });
    }
  }

  revalidatePath("/admin/planes");
  return { ok: true };
}

export async function toggleFeatureFlagAction(
  flagId: string,
  enabled: boolean,
): Promise<ActionState> {
  const session = await requireRoles(["enruta_admin", "school_admin"]);
  if (!session) return { error: "No autorizado" };
  await db
    .update(featureFlags)
    .set({ enabled })
    .where(eq(featureFlags.id, flagId));
  revalidatePath("/admin/planes");
  revalidatePath("/colegio/configuracion");
  return { ok: true };
}

export async function requestGuardianAuthAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { demoOtp?: string }> {
  const session = await auth();
  const email = String(formData.get("guardianEmail") || "")
    .toLowerCase()
    .trim();
  const name = String(formData.get("guardianName") || "").trim();
  let studentId = String(formData.get("studentId") || "");
  const studentEmail = String(formData.get("studentEmail") || "")
    .toLowerCase()
    .trim();

  if (session?.user?.role === "student") {
    const [st] = await db
      .select()
      .from(students)
      .where(eq(students.userId, session.user.id))
      .limit(1);
    if (!st) return { error: "Estudiante no encontrado" };
    studentId = st.id;
  } else if (!studentId && studentEmail) {
    const [u] = await db
      .select()
      .from(users)
      .where(eq(users.email, studentEmail))
      .limit(1);
    if (u) {
      const [st] = await db
        .select()
        .from(students)
        .where(eq(students.userId, u.id))
        .limit(1);
      studentId = st?.id || "";
    }
  }

  if (!studentId || !email.includes("@")) {
    return {
      error:
        "Indica correo del apoderado y del estudiante (o inicia sesión como estudiante)",
    };
  }

  const otp = String(randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await db.insert(guardianAuthRequests).values({
    studentId,
    guardianEmail: email,
    guardianName: name || null,
    otpCode: otp,
    status: "pending",
    expiresAt,
  });

  await sendEmail({
    to: email,
    subject: "ENRUTA · Código de autorización familiar",
    body: `Hola${name ? ` ${name}` : ""},\n\nTu código de autorización ENRUTA es: ${otp}\nVálido por 30 minutos.\n\nSi no solicitaste esto, ignora este mensaje.`,
  });

  const isDemoEnv =
    process.env.NODE_ENV !== "production" && !process.env.SMTP_HOST;
  return {
    ok: true,
    demoOtp: isDemoEnv ? otp : undefined,
  };
}

export async function verifyGuardianAuthAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("guardianEmail") || "")
    .toLowerCase()
    .trim();
  const otp = String(formData.get("otp") || "").trim();
  const fullName = String(formData.get("fullName") || "Apoderado/a ENRUTA");
  const password = String(formData.get("password") || "");

  if (!email || !otp) return { error: "Correo y código OTP requeridos" };
  if (password.length < 8) return { error: "Contraseña mínimo 8 caracteres" };

  const [req] = await db
    .select()
    .from(guardianAuthRequests)
    .where(
      and(
        eq(guardianAuthRequests.guardianEmail, email),
        eq(guardianAuthRequests.otpCode, otp),
        eq(guardianAuthRequests.status, "pending"),
      ),
    )
    .limit(1);

  if (!req || req.expiresAt < new Date()) {
    return { error: "Código inválido o expirado" };
  }

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, req.studentId))
    .limit(1);
  if (!student) return { error: "Estudiante no encontrado" };

  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        fullName: req.guardianName || fullName,
        role: "guardian",
        schoolId: student.schoolId,
      })
      .returning();
  }

  let [guardian] = await db
    .select()
    .from(guardians)
    .where(eq(guardians.userId, user.id))
    .limit(1);
  if (!guardian) {
    [guardian] = await db
      .insert(guardians)
      .values({ userId: user.id })
      .returning();
  }

  const [link] = await db
    .select()
    .from(guardianStudents)
    .where(
      and(
        eq(guardianStudents.guardianId, guardian.id),
        eq(guardianStudents.studentId, student.id),
      ),
    )
    .limit(1);
  if (!link) {
    await db.insert(guardianStudents).values({
      guardianId: guardian.id,
      studentId: student.id,
      authorized: true,
      canViewSensitive: false,
    });
  } else {
    await db
      .update(guardianStudents)
      .set({ authorized: true })
      .where(eq(guardianStudents.id, link.id));
  }

  await db
    .update(guardianAuthRequests)
    .set({ status: "verified", verifiedAt: new Date() })
    .where(eq(guardianAuthRequests.id, req.id));

  await db.insert(notifications).values({
    userId: student.userId,
    title: "Apoderado/a autorizado/a",
    body: `${email} completó la autorización familiar en ENRUTA.`,
    href: "/app",
  });

  return { ok: true };
}

export async function addEventMaterialAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRoles([
    "partner",
    "school_admin",
    "counselor",
    "enruta_admin",
  ]);
  if (!session) return { error: "No autorizado" };

  const eventId = String(formData.get("eventId") || "");
  const title = String(formData.get("title") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const file = formData.get("file");

  if (!eventId || !title) return { error: "Evento y título son obligatorios" };

  let filePath: string | null = null;
  let mimeType: string | null = null;
  let sizeBytes: number | null = null;
  let scanStatus = "clean";

  if (file instanceof File && file.size > 0) {
    const stored = await validateAndStoreUpload(file, "event-materials");
    if (!stored.ok) return { error: stored.error };
    filePath = stored.filePath;
    mimeType = stored.mimeType;
    sizeBytes = stored.sizeBytes;
    scanStatus = stored.scanStatus;
  } else if (!url) {
    return { error: "Agrega un enlace o un archivo" };
  }

  await db.insert(eventMaterials).values({
    eventId,
    title,
    materialType: filePath ? "file" : "link",
    url: url || null,
    filePath,
    mimeType,
    sizeBytes,
    scanStatus,
    createdBy: session.user.id,
  });

  revalidatePath("/partner/eventos");
  revalidatePath("/colegio/eventos");
  return { ok: true };
}

export async function runMineducSyncAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { summary?: string }> {
  const session = await requireRoles(["enruta_admin", "school_admin"]);
  if (!session) return { error: "No autorizado" };
  const rbd = String(formData.get("rbd") || "12345-6");
  const schoolId = session.user.schoolId || String(formData.get("schoolId") || "") || null;
  const result = await syncSchoolDirectoryStub({ schoolId, rbd });
  revalidatePath("/admin/integraciones");
  return {
    ok: true,
    summary: `Stub MINEDUC OK · log ${result.logId} · ${result.data.name}`,
  };
}

export async function registerPushSubscriptionAction(input: {
  endpoint: string;
  keys?: { p256dh?: string; auth?: string };
}): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };
  const { pushSubscriptions } = await import("@/db/schema");
  await db.insert(pushSubscriptions).values({
    userId: session.user.id,
    endpoint: input.endpoint,
    keys: input.keys || {},
  });
  // Browser push real requiere VAPID keys; aquí persistimos la suscripción.
  return { ok: true };
}

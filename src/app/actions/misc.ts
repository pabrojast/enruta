"use server";

import bcrypt from "bcryptjs";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { z } from "zod";
import { db } from "@/db";
import {
  contactMessages,
  followUps,
  gameSessions,
  guardianStudents,
  guardians,
  notifications,
  passwordResetTokens,
  partnerProfiles,
  events,
  users,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { getStudentByUserId } from "@/lib/students";
import { sendEmail } from "@/lib/email";
import type { ActionState } from "./auth";

export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState & { demoToken?: string }> {
  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();
  if (!email.includes("@")) return { error: "Correo inválido" };

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // No revelar si existe (excepto en demo local, solo si existe devolvemos token)
  if (!user) {
    return { ok: true };
  }

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt,
  });

  const resetUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/recuperar`;
  await sendEmail({
    to: email,
    subject: "ENRUTA · Recuperación de contraseña",
    body: `Hola,\n\nUsa este token en ${resetUrl} para restablecer tu contraseña:\n\n${token}\n\nExpira en 1 hora.`,
  });

  // Sin SMTP devolvemos token para demo local
  return {
    ok: true,
    demoToken: process.env.SMTP_HOST ? undefined : token,
  };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") || "").trim();
  const password = String(formData.get("password") || "");
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres" };
  if (!token) return { error: "Token requerido" };

  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        isNull(passwordResetTokens.usedAt),
      ),
    )
    .limit(1);

  if (!row || row.expiresAt < new Date()) {
    return { error: "El enlace no es válido o expiró" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, row.userId));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, row.id));

  return { ok: true };
}

export async function submitContactAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
    schoolName: z.string().optional(),
  });
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    schoolName: formData.get("schoolName") || "",
  });
  if (!parsed.success) return { error: "Completa nombre, correo y un mensaje claro" };

  await db.insert(contactMessages).values({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    message: parsed.data.message,
    schoolName: parsed.data.schoolName || null,
  });

  return { ok: true };
}

export async function saveFollowUpAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "student") {
    return { error: "No autorizado" };
  }
  const row = await getStudentByUserId(session.user.id);
  if (!row) return { error: "Estudiante no encontrado" };

  const followUpId = String(formData.get("followUpId") || "");
  if (!followUpId) return { error: "Seguimiento inválido" };

  const [fu] = await db
    .select()
    .from(followUps)
    .where(
      and(
        eq(followUps.id, followUpId),
        eq(followUps.studentId, row.student.id),
      ),
    )
    .limit(1);
  if (!fu) return { error: "Seguimiento no encontrado" };

  await db
    .update(followUps)
    .set({
      whatDidAfter: String(formData.get("whatDidAfter") || ""),
      decisionChanged: String(formData.get("decisionChanged") || ""),
      newAlternatives: String(formData.get("newAlternatives") || ""),
      difficulties: String(formData.get("difficulties") || ""),
      supportNeeded: String(formData.get("supportNeeded") || ""),
      nextStep: String(formData.get("nextStep") || ""),
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(followUps.id, followUpId));

  revalidatePath("/app/seguimientos");
  return { ok: true };
}

export async function saveGameSessionAction(input: {
  gameCode: string;
  resultSummary: string;
  reflection: string;
  choices: Record<string, string>;
}): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "student") {
    return { error: "No autorizado" };
  }
  const row = await getStudentByUserId(session.user.id);
  if (!row) return { error: "Estudiante no encontrado" };

  await db.insert(gameSessions).values({
    studentId: row.student.id,
    gameCode: input.gameCode,
    resultSummary: input.resultSummary,
    reflection: input.reflection,
    choices: input.choices,
  });

  await db.insert(notifications).values({
    userId: session.user.id,
    title: "Guardaste una experiencia de juego",
    body: input.resultSummary,
    href: "/app/portafolio",
  });

  revalidatePath("/app/juegos");
  revalidatePath("/app/notificaciones");
  return { ok: true };
}

export async function markNotificationReadAction(
  id: string,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, session.user.id)),
    );

  revalidatePath("/app/notificaciones");
  return { ok: true };
}

export async function saveGuardianExpectationsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "guardian") {
    return { error: "No autorizado" };
  }
  const linkId = String(formData.get("linkId") || "");
  const text = String(formData.get("familyExpectations") || "");
  if (!linkId) return { error: "Vínculo inválido" };

  const [g] = await db
    .select()
    .from(guardians)
    .where(eq(guardians.userId, session.user.id))
    .limit(1);
  if (!g) return { error: "Perfil de apoderado no encontrado" };

  await db
    .update(guardianStudents)
    .set({ familyExpectations: text })
    .where(
      and(
        eq(guardianStudents.id, linkId),
        eq(guardianStudents.guardianId, g.id),
      ),
    );

  revalidatePath("/familia");
  return { ok: true };
}

export async function savePartnerProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "partner") {
    return { error: "No autorizado" };
  }

  const payload = {
    organizationName: String(formData.get("organizationName") || "").trim(),
    organizationType: String(formData.get("organizationType") || "empresa"),
    description: String(formData.get("description") || ""),
    region: String(formData.get("region") || ""),
    contactEmail: String(formData.get("contactEmail") || ""),
    updatedAt: new Date(),
  };
  if (payload.organizationName.length < 2) {
    return { error: "Nombre de organización requerido" };
  }

  const [existing] = await db
    .select()
    .from(partnerProfiles)
    .where(eq(partnerProfiles.userId, session.user.id))
    .limit(1);

  if (existing) {
    await db
      .update(partnerProfiles)
      .set(payload)
      .where(eq(partnerProfiles.id, existing.id));
  } else {
    await db.insert(partnerProfiles).values({
      userId: session.user.id,
      ...payload,
    });
  }

  revalidatePath("/partner");
  return { ok: true };
}

export async function partnerCreateEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (
    !session?.user?.id ||
    !["partner", "school_admin", "enruta_admin", "counselor"].includes(
      session.user.role,
    )
  ) {
    return { error: "No autorizado" };
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const startsAt = String(formData.get("startsAt") || "");
  const capacity = Number(formData.get("capacity") || 30);
  const modality = String(formData.get("modality") || "presencial");
  const location = String(formData.get("location") || "");
  const type = String(formData.get("type") || "charla") as
    | "charla"
    | "taller"
    | "visita"
    | "feria"
    | "webinar"
    | "mentoria"
    | "pasantia"
    | "otro";

  if (!title || !startsAt) return { error: "Título y fecha son obligatorios" };

  let organizer = "Partner ENRUTA";
  if (session.user.role === "partner") {
    const [p] = await db
      .select()
      .from(partnerProfiles)
      .where(eq(partnerProfiles.userId, session.user.id))
      .limit(1);
    organizer = p?.organizationName || session.user.name || "Partner";
  }

  await db.insert(events).values({
    schoolId: session.user.schoolId,
    title,
    description,
    type,
    startsAt: new Date(startsAt),
    capacity: Number.isFinite(capacity) ? capacity : 30,
    modality,
    location,
    organizer,
    recommendedGrades: [2, 3, 4],
  });

  revalidatePath("/partner");
  revalidatePath("/app/eventos");
  revalidatePath("/colegio/eventos");
  return { ok: true };
}

export async function ensureStudentFollowUps(studentId: string, userId: string) {
  const existing = await db
    .select()
    .from(followUps)
    .where(eq(followUps.studentId, studentId));
  if (existing.length > 0) return existing;

  const now = Date.now();
  const created = await db
    .insert(followUps)
    .values(
      [30, 90, 180].map((d) => ({
        studentId,
        dayOffset: d,
        status: "pending" as const,
        dueAt: new Date(now + d * 24 * 60 * 60 * 1000),
      })),
    )
    .returning();

  await db.insert(notifications).values({
    userId,
    title: "Seguimientos programados",
    body: "Tienes hitos de seguimiento a 30, 90 y 180 días. Puedes responderlos cuando correspondan.",
    href: "/app/seguimientos",
  });

  return created;
}

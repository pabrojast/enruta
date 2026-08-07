"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  courses,
  featureFlags,
  schools,
  users,
  professionals,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import type { ActionState } from "./auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "enruta_admin") return null;
  return session;
}

const schoolSchema = z.object({
  name: z.string().min(3),
  modality: z.enum(["HC", "TP", "mixed"]),
  region: z.string().optional(),
  commune: z.string().optional(),
  inviteCode: z.string().min(3).max(40),
  urbanRural: z.string().optional(),
});

export async function createSchoolAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };

  const parsed = schoolSchema.safeParse({
    name: formData.get("name"),
    modality: formData.get("modality"),
    region: formData.get("region") || "",
    commune: formData.get("commune") || "",
    inviteCode: String(formData.get("inviteCode") || "")
      .trim()
      .toUpperCase(),
    urbanRural: formData.get("urbanRural") || "urbano",
  });
  if (!parsed.success) return { error: "Revisa los datos del establecimiento" };

  const [existing] = await db
    .select()
    .from(schools)
    .where(eq(schools.inviteCode, parsed.data.inviteCode))
    .limit(1);
  if (existing) return { error: "El código de invitación ya existe" };

  const [school] = await db
    .insert(schools)
    .values({
      name: parsed.data.name,
      modality: parsed.data.modality,
      region: parsed.data.region || null,
      commune: parsed.data.commune || null,
      inviteCode: parsed.data.inviteCode,
      urbanRural: parsed.data.urbanRural || "urbano",
    })
    .returning();

  // 4 cursos base
  await db.insert(courses).values(
    [1, 2, 3, 4].map((g) => ({
      schoolId: school.id,
      name: `${g}° Medio A`,
      gradeLevel: g,
      year: new Date().getFullYear(),
    })),
  );

  await db.insert(featureFlags).values([
    { schoolId: school.id, key: "portfolio", enabled: true, planCode: "piloto" },
    { schoolId: school.id, key: "events", enabled: true, planCode: "piloto" },
    { schoolId: school.id, key: "games", enabled: true, planCode: "piloto" },
    {
      schoolId: school.id,
      key: "follow_ups",
      enabled: true,
      planCode: "4anos",
    },
  ]);

  revalidatePath("/admin/establecimientos");
  return { ok: true };
}

const userSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum([
    "counselor",
    "psychologist",
    "head_teacher",
    "school_admin",
    "partner",
    "guardian",
  ]),
  schoolId: z.string().uuid().optional().or(z.literal("")),
});

export async function createUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };

  const parsed = userSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    schoolId: formData.get("schoolId") || "",
  });
  if (!parsed.success) return { error: "Revisa los datos del usuario" };

  const email = parsed.data.email.toLowerCase().trim();
  const [exists] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (exists) return { error: "El correo ya está registrado" };

  const schoolId =
    parsed.data.schoolId && parsed.data.schoolId !== ""
      ? parsed.data.schoolId
      : null;

  if (parsed.data.role !== "partner" && !schoolId) {
    return { error: "Selecciona un establecimiento para este rol" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      schoolId,
    })
    .returning();

  if (
    schoolId &&
    ["counselor", "psychologist", "head_teacher"].includes(parsed.data.role)
  ) {
    await db.insert(professionals).values({
      userId: user.id,
      schoolId,
      title: parsed.data.role,
    });
  }

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

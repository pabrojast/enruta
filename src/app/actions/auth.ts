"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { courses, schools, students, users } from "@/db/schema";
import { signIn, signOut } from "@/lib/auth";
import { homeForRole, type Role } from "@/lib/rbac";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = z.object({
  fullName: z.string().min(3, "Ingresa tu nombre completo"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  inviteCode: z.string().min(3, "Código de colegio requerido"),
  gradeLevel: z.coerce.number().min(1).max(4),
});

export type ActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      error: "Revisa los datos ingresados",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email.toLowerCase().trim()))
      .limit(1);
    if (!user) return { error: "Correo o contraseña incorrectos" };

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: homeForRole(user.role as Role),
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos" };
    }
    throw e;
  }
}

export async function demoLoginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = process.env.DEMO_PASSWORD;
  if (!password || !DEMO_ACCOUNTS.some((a) => a.email === email)) {
    return { error: "Cuenta demo no disponible" };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) return { error: "Cuenta demo no disponible" };

    await signIn("credentials", {
      email,
      password,
      redirectTo: homeForRole(user.role as Role),
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Cuenta demo no disponible" };
    }
    throw e;
  }
}

export async function registerStudentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    inviteCode: formData.get("inviteCode"),
    gradeLevel: formData.get("gradeLevel"),
  });
  if (!parsed.success) {
    return {
      error: "Revisa los datos del formulario",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const code = parsed.data.inviteCode.trim().toUpperCase();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) return { error: "Ya existe una cuenta con este correo" };

  const [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.inviteCode, code))
    .limit(1);
  if (!school || !school.isActive) {
    return { error: "Código de colegio inválido. Pídelo a tu establecimiento." };
  }

  const [course] = await db
    .select()
    .from(courses)
    .where(
      and(
        eq(courses.schoolId, school.id),
        eq(courses.gradeLevel, parsed.data.gradeLevel),
      ),
    )
    .limit(1);

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      fullName: parsed.data.fullName.trim(),
      role: "student",
      schoolId: school.id,
    })
    .returning();

  await db.insert(students).values({
    userId: user.id,
    schoolId: school.id,
    courseId: course?.id,
    gradeLevel: parsed.data.gradeLevel,
    modality: school.modality === "mixed" ? "HC" : school.modality,
    specialtyTp: course?.specialtyTp,
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/app/consentimiento",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Cuenta creada, pero no se pudo iniciar sesión automáticamente. Ve a Ingresar." };
    }
    throw e;
  }
  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

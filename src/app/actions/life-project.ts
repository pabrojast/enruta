"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { lifeProjects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getStudentByUserId } from "@/lib/students";
import type { ActionState } from "./auth";

export async function saveLifeProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "student") {
    return { error: "No autorizado" };
  }
  const row = await getStudentByUserId(session.user.id);
  if (!row) return { error: "Estudiante no encontrado" };

  const payload = {
    mainGoal: String(formData.get("mainGoal") ?? ""),
    alternatives: String(formData.get("alternatives") ?? ""),
    motivations: String(formData.get("motivations") ?? ""),
    strengths: String(formData.get("strengths") ?? ""),
    obstacles: String(formData.get("obstacles") ?? ""),
    resources: String(formData.get("resources") ?? ""),
    supportPeople: String(formData.get("supportPeople") ?? ""),
    planB: String(formData.get("planB") ?? ""),
    reflection: String(formData.get("reflection") ?? ""),
    updatedAt: new Date(),
  };

  const [existing] = await db
    .select()
    .from(lifeProjects)
    .where(eq(lifeProjects.studentId, row.student.id))
    .limit(1);

  if (existing) {
    await db
      .update(lifeProjects)
      .set(payload)
      .where(eq(lifeProjects.id, existing.id));
  } else {
    await db.insert(lifeProjects).values({
      studentId: row.student.id,
      ...payload,
    });
  }

  revalidatePath("/app/proyecto-de-vida");
  return { ok: true };
}

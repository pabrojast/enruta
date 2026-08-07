"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  assessmentSections,
  assessmentVersions,
  assessments,
  questionOptions,
  questions,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import type { ActionState } from "./auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "enruta_admin") return null;
  return session;
}

export async function createAssessmentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const code = String(formData.get("code") || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!code || !title) return { error: "Código y título son obligatorios" };

  const [exists] = await db
    .select()
    .from(assessments)
    .where(eq(assessments.code, code))
    .limit(1);
  if (exists) return { error: "Ya existe un cuestionario con ese código" };

  const [a] = await db
    .insert(assessments)
    .values({
      code,
      title,
      description,
      targetGrades: [1, 2, 3, 4],
      requiresConsent: true,
    })
    .returning();
  const [v] = await db
    .insert(assessmentVersions)
    .values({
      assessmentId: a.id,
      version: 1,
      scoringRules: { method: "riasec_weighted_likert" },
      isActive: true,
    })
    .returning();
  await db.insert(assessmentSections).values({
    versionId: v.id,
    title: "Sección principal",
    orderIndex: 0,
  });

  revalidatePath("/admin/cuestionarios");
  return { ok: true };
}

export async function addQuestionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };

  const schema = z.object({
    versionId: z.string().uuid(),
    sectionId: z.string().uuid(),
    prompt: z.string().min(5),
    dimension: z.enum(["R", "I", "A", "S", "E", "C"]),
    type: z.enum(["likert", "single"]).default("likert"),
  });
  const parsed = schema.safeParse({
    versionId: formData.get("versionId"),
    sectionId: formData.get("sectionId"),
    prompt: formData.get("prompt"),
    dimension: formData.get("dimension"),
    type: formData.get("type") || "likert",
  });
  if (!parsed.success) return { error: "Revisa los datos de la pregunta" };

  const existing = await db
    .select()
    .from(questions)
    .where(eq(questions.sectionId, parsed.data.sectionId));
  const orderIndex = existing.length;

  const [q] = await db
    .insert(questions)
    .values({
      sectionId: parsed.data.sectionId,
      type: parsed.data.type,
      prompt: parsed.data.prompt,
      helpText:
        parsed.data.type === "likert"
          ? "1 = Nada de acuerdo · 5 = Muy de acuerdo"
          : null,
      required: true,
      orderIndex,
      config: {
        scaleMin: 1,
        scaleMax: 5,
        primaryDimension: parsed.data.dimension,
      },
    })
    .returning();

  if (parsed.data.type === "likert") {
    const labels = [
      "1 · Nada de acuerdo",
      "2 · Poco de acuerdo",
      "3 · Más o menos",
      "4 · De acuerdo",
      "5 · Muy de acuerdo",
    ];
    await db.insert(questionOptions).values(
      labels.map((label, i) => ({
        questionId: q.id,
        label,
        value: String(i + 1),
        scores: { [parsed.data.dimension]: 3 },
        orderIndex: i,
      })),
    );
  } else {
    await db.insert(questionOptions).values([
      {
        questionId: q.id,
        label: "Sí",
        value: "yes",
        scores: { [parsed.data.dimension]: 3 },
        orderIndex: 0,
      },
      {
        questionId: q.id,
        label: "No",
        value: "no",
        scores: { [parsed.data.dimension]: 0 },
        orderIndex: 1,
      },
    ]);
  }

  revalidatePath("/admin/cuestionarios");
  revalidatePath(`/admin/cuestionarios/${parsed.data.versionId}`);
  return { ok: true };
}

export async function deleteQuestionAction(questionId: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  await db.delete(questionOptions).where(eq(questionOptions.questionId, questionId));
  await db.delete(questions).where(eq(questions.id, questionId));
  revalidatePath("/admin/cuestionarios");
  return { ok: true };
}

export async function listAssessmentTree() {
  const all = await db.select().from(assessments).orderBy(asc(assessments.title));
  const result = [];
  for (const a of all) {
    const versions = await db
      .select()
      .from(assessmentVersions)
      .where(eq(assessmentVersions.assessmentId, a.id));
    result.push({ assessment: a, versions });
  }
  return result;
}

export async function getVersionDetail(versionId: string) {
  const [version] = await db
    .select()
    .from(assessmentVersions)
    .where(eq(assessmentVersions.id, versionId))
    .limit(1);
  if (!version) return null;
  const [assessment] = await db
    .select()
    .from(assessments)
    .where(eq(assessments.id, version.assessmentId))
    .limit(1);
  const sections = await db
    .select()
    .from(assessmentSections)
    .where(eq(assessmentSections.versionId, versionId))
    .orderBy(asc(assessmentSections.orderIndex));
  const tree = [];
  for (const s of sections) {
    const qs = await db
      .select()
      .from(questions)
      .where(eq(questions.sectionId, s.id))
      .orderBy(asc(questions.orderIndex));
    const withOpts = [];
    for (const q of qs) {
      const opts = await db
        .select()
        .from(questionOptions)
        .where(eq(questionOptions.questionId, q.id))
        .orderBy(asc(questionOptions.orderIndex));
      withOpts.push({ ...q, options: opts });
    }
    tree.push({ section: s, questions: withOpts });
  }
  return { assessment, version, sections: tree };
}

export async function addSectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const versionId = String(formData.get("versionId") || "");
  const title = String(formData.get("title") || "").trim();
  if (!versionId || !title) return { error: "Datos incompletos" };
  const existing = await db
    .select()
    .from(assessmentSections)
    .where(eq(assessmentSections.versionId, versionId));
  await db.insert(assessmentSections).values({
    versionId,
    title,
    orderIndex: existing.length,
  });
  revalidatePath(`/admin/cuestionarios/${versionId}`);
  return { ok: true };
}

export async function reorderSectionsAction(input: {
  versionId: string;
  orderedSectionIds: string[];
}): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const { versionId, orderedSectionIds } = input;
  if (!versionId || orderedSectionIds.length === 0) {
    return { error: "Orden de secciones inválido" };
  }

  for (let i = 0; i < orderedSectionIds.length; i++) {
    await db
      .update(assessmentSections)
      .set({ orderIndex: i })
      .where(eq(assessmentSections.id, orderedSectionIds[i]));
  }

  revalidatePath(`/admin/cuestionarios/${versionId}`);
  return { ok: true };
}

export async function reorderQuestionsAction(input: {
  versionId: string;
  sectionId: string;
  orderedQuestionIds: string[];
}): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const { versionId, sectionId, orderedQuestionIds } = input;
  if (!sectionId) return { error: "Sección inválida" };

  for (let i = 0; i < orderedQuestionIds.length; i++) {
    await db
      .update(questions)
      .set({ orderIndex: i, sectionId })
      .where(eq(questions.id, orderedQuestionIds[i]));
  }

  revalidatePath(`/admin/cuestionarios/${versionId}`);
  return { ok: true };
}

/**
 * Mueve una pregunta a otra sección y reordena origen + destino.
 */
export async function moveQuestionAction(input: {
  versionId: string;
  questionId: string;
  toSectionId: string;
  toIndex: number;
}): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const { versionId, questionId, toSectionId, toIndex } = input;

  const [q] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1);
  if (!q) return { error: "Pregunta no encontrada" };

  const fromSectionId = q.sectionId;

  // Remove from source list order
  const sourceQs = (
    await db
      .select()
      .from(questions)
      .where(eq(questions.sectionId, fromSectionId))
      .orderBy(asc(questions.orderIndex))
  ).filter((item) => item.id !== questionId);

  for (let i = 0; i < sourceQs.length; i++) {
    await db
      .update(questions)
      .set({ orderIndex: i })
      .where(eq(questions.id, sourceQs[i].id));
  }

  // Insert into destination
  const destQs = (
    await db
      .select()
      .from(questions)
      .where(eq(questions.sectionId, toSectionId))
      .orderBy(asc(questions.orderIndex))
  ).filter((item) => item.id !== questionId);

  const clamped = Math.max(0, Math.min(toIndex, destQs.length));
  destQs.splice(clamped, 0, q);

  for (let i = 0; i < destQs.length; i++) {
    await db
      .update(questions)
      .set({
        orderIndex: i,
        sectionId: toSectionId,
      })
      .where(eq(questions.id, destQs[i].id));
  }

  revalidatePath(`/admin/cuestionarios/${versionId}`);
  return { ok: true };
}

export async function renameSectionAction(input: {
  versionId: string;
  sectionId: string;
  title: string;
}): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const title = input.title.trim();
  if (!title) return { error: "Título requerido" };
  await db
    .update(assessmentSections)
    .set({ title })
    .where(eq(assessmentSections.id, input.sectionId));
  revalidatePath(`/admin/cuestionarios/${input.versionId}`);
  return { ok: true };
}


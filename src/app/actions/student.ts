"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  assessmentAnswers,
  assessmentResponses,
  assessmentResults,
  assessmentVersions,
  assessments,
  consents,
  portfolioItems,
  questionOptions,
  questions,
  students,
  vocationalReports,
  alerts,
  assessmentSections,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { generateReportContent } from "@/lib/reports";
import { computeDimensionScores, detectFlags } from "@/lib/scoring";
import { getStudentByUserId } from "@/lib/students";
import type { ActionState } from "./auth";

async function requireStudent() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "student") {
    return null;
  }
  return getStudentByUserId(session.user.id);
}

export async function saveConsentsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const row = await requireStudent();
  if (!row) return { error: "No autorizado" };

  const terms = formData.get("terms") === "on";
  const data = formData.get("data") === "on";
  if (!terms || !data) {
    return { error: "Debes aceptar los consentimientos para continuar." };
  }

  for (const type of ["terms", "data"] as const) {
    const existing = await db
      .select()
      .from(consents)
      .where(
        and(eq(consents.studentId, row.student.id), eq(consents.type, type)),
      )
      .limit(1);
    if (existing[0]) {
      await db
        .update(consents)
        .set({ accepted: true, signedAt: new Date() })
        .where(eq(consents.id, existing[0].id));
    } else {
      await db.insert(consents).values({
        studentId: row.student.id,
        type,
        accepted: true,
        signedAt: new Date(),
        documentVersion: "1.0",
      });
    }
  }

  revalidatePath("/app");
  return { ok: true };
}

const profileSchema = z.object({
  interestsSummary: z.string().optional(),
  strengthsSummary: z.string().optional(),
  expectations: z.string().optional(),
  familyContext: z.string().optional(),
  territorialContext: z.string().optional(),
  personalHistory: z.string().optional(),
  birthYear: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || v.trim() === "") return null;
      const n = Number(v);
      if (!Number.isFinite(n) || n < 1995 || n > 2015) return null;
      return n;
    }),
});

export async function saveProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const row = await requireStudent();
  if (!row) return { error: "No autorizado" };

  const parsed = profileSchema.safeParse({
    interestsSummary: formData.get("interestsSummary") || "",
    strengthsSummary: formData.get("strengthsSummary") || "",
    expectations: formData.get("expectations") || "",
    familyContext: formData.get("familyContext") || "",
    territorialContext: formData.get("territorialContext") || "",
    personalHistory: formData.get("personalHistory") || "",
    birthYear: formData.get("birthYear") || "",
  });
  if (!parsed.success) return { error: "Revisa los datos del perfil" };

  await db
    .update(students)
    .set({
      interestsSummary: parsed.data.interestsSummary || null,
      strengthsSummary: parsed.data.strengthsSummary || null,
      expectations: parsed.data.expectations || null,
      familyContext: parsed.data.familyContext || null,
      territorialContext: parsed.data.territorialContext || null,
      personalHistory: parsed.data.personalHistory || null,
      birthYear: parsed.data.birthYear,
      profileCompleted: true,
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(students.id, row.student.id));

  revalidatePath("/app/perfil");
  revalidatePath("/app");
  return { ok: true };
}

export async function startOrResumeAssessmentAction(): Promise<
  ActionState & { responseId?: string }
> {
  const row = await requireStudent();
  if (!row) return { error: "No autorizado" };

  const [assessment] = await db
    .select()
    .from(assessments)
    .where(eq(assessments.code, "intereses-enruta-v1"))
    .limit(1);
  if (!assessment) return { error: "Cuestionario no disponible" };

  const [version] = await db
    .select()
    .from(assessmentVersions)
    .where(eq(assessmentVersions.assessmentId, assessment.id))
    .limit(1);
  if (!version) return { error: "Versión de cuestionario no disponible" };

  const [existing] = await db
    .select()
    .from(assessmentResponses)
    .where(
      and(
        eq(assessmentResponses.studentId, row.student.id),
        eq(assessmentResponses.versionId, version.id),
      ),
    )
    .limit(1);

  if (existing) return { ok: true, responseId: existing.id };

  const [created] = await db
    .insert(assessmentResponses)
    .values({
      versionId: version.id,
      studentId: row.student.id,
      status: "in_progress",
      progressPct: 0,
    })
    .returning();

  return { ok: true, responseId: created.id };
}

export async function saveAnswerAction(input: {
  responseId: string;
  questionId: string;
  value: string;
}): Promise<ActionState> {
  const row = await requireStudent();
  if (!row) return { error: "No autorizado" };

  const [response] = await db
    .select()
    .from(assessmentResponses)
    .where(
      and(
        eq(assessmentResponses.id, input.responseId),
        eq(assessmentResponses.studentId, row.student.id),
      ),
    )
    .limit(1);
  if (!response) return { error: "Respuesta no encontrada" };
  if (response.status === "submitted") {
    return { error: "Este cuestionario ya fue enviado" };
  }

  const [existing] = await db
    .select()
    .from(assessmentAnswers)
    .where(
      and(
        eq(assessmentAnswers.responseId, input.responseId),
        eq(assessmentAnswers.questionId, input.questionId),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(assessmentAnswers)
      .set({ value: input.value, updatedAt: new Date() })
      .where(eq(assessmentAnswers.id, existing.id));
  } else {
    await db.insert(assessmentAnswers).values({
      responseId: input.responseId,
      questionId: input.questionId,
      value: input.value,
    });
  }

  // progress
  const sections = await db
    .select()
    .from(assessmentSections)
    .where(eq(assessmentSections.versionId, response.versionId));
  const sectionIds = sections.map((s) => s.id);
  let totalQ = 0;
  for (const sid of sectionIds) {
    const qs = await db
      .select()
      .from(questions)
      .where(eq(questions.sectionId, sid));
    totalQ += qs.length;
  }
  const answers = await db
    .select()
    .from(assessmentAnswers)
    .where(eq(assessmentAnswers.responseId, input.responseId));
  const progressPct =
    totalQ === 0 ? 0 : Math.round((answers.length / totalQ) * 100);

  await db
    .update(assessmentResponses)
    .set({ progressPct, updatedAt: new Date() })
    .where(eq(assessmentResponses.id, input.responseId));

  revalidatePath("/app/cuestionarios");
  return { ok: true };
}

export async function submitAssessmentAction(
  responseId: string,
): Promise<ActionState> {
  const row = await requireStudent();
  if (!row) return { error: "No autorizado" };

  const [response] = await db
    .select()
    .from(assessmentResponses)
    .where(
      and(
        eq(assessmentResponses.id, responseId),
        eq(assessmentResponses.studentId, row.student.id),
      ),
    )
    .limit(1);
  if (!response) return { error: "No encontrado" };

  const sections = await db
    .select()
    .from(assessmentSections)
    .where(eq(assessmentSections.versionId, response.versionId));

  const allQuestions = [];
  for (const s of sections) {
    const qs = await db
      .select()
      .from(questions)
      .where(eq(questions.sectionId, s.id));
    allQuestions.push(...qs);
  }

  const answers = await db
    .select()
    .from(assessmentAnswers)
    .where(eq(assessmentAnswers.responseId, responseId));

  if (answers.length < allQuestions.length) {
    return {
      error: `Aún faltan respuestas (${answers.length}/${allQuestions.length}).`,
    };
  }

  const scoreInputs = [];
  for (const ans of answers) {
    const q = allQuestions.find((x) => x.id === ans.questionId);
    if (!q) continue;
    const opts = await db
      .select()
      .from(questionOptions)
      .where(eq(questionOptions.questionId, q.id));
    const val = String(ans.value ?? "");
    const opt = opts.find((o) => o.value === val);
    const likertValue = Number(val);
    scoreInputs.push({
      questionId: q.id,
      optionScores: (opt?.scores as Record<string, number>) ?? {},
      likertValue: Number.isFinite(likertValue) ? likertValue : undefined,
    });
  }

  const scored = computeDimensionScores(scoreInputs);
  const flags = detectFlags(answers.length, allQuestions.length);

  await db
    .update(assessmentResponses)
    .set({
      status: "submitted",
      progressPct: 100,
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(assessmentResponses.id, responseId));

  const [result] = await db
    .insert(assessmentResults)
    .values({
      responseId,
      studentId: row.student.id,
      dimensions: scored.dimensions,
      topDimensions: scored.topDimensions,
      summary: `Perfil de intereses con énfasis en ${scored.topDimensions.join(", ")}. Resultados orientativos.`,
      flags,
    })
    .returning();

  const { content, generatedBy } = await generateReportContent({
    studentName: row.user.fullName,
    gradeLevel: row.student.gradeLevel,
    dimensions: scored.dimensions,
    topDimensions: scored.topDimensions,
    interestsSummary: row.student.interestsSummary,
    strengthsSummary: row.student.strengthsSummary,
  });

  const [report] = await db
    .insert(vocationalReports)
    .values({
      studentId: row.student.id,
      schoolId: row.student.schoolId,
      resultId: result.id,
      status: "pending_review",
      content,
      dimensionsSnapshot: scored.dimensions,
      generatedBy,
    })
    .returning();

  await db.insert(alerts).values({
    schoolId: row.student.schoolId,
    studentId: row.student.id,
    level: "follow_up",
    type: "report_pending_review",
    title: "Informe pendiente de revisión",
    description: `El informe de ${row.user.fullName} está listo para validación profesional.`,
    status: "open",
  });

  // Auto portfolio evidence
  await db.insert(portfolioItems).values({
    studentId: row.student.id,
    type: "cuestionario",
    title: "Completé el cuestionario de intereses",
    body: `Resultados orientativos: ${scored.topDimensions.join(", ")}. Informe en revisión profesional.`,
    yearLabel: `${row.student.gradeLevel}° medio`,
  });

  const { ensureStudentFollowUps } = await import("@/app/actions/misc");
  const { notifications } = await import("@/db/schema");
  await ensureStudentFollowUps(row.student.id, row.user.id);
  await db.insert(notifications).values({
    userId: row.user.id,
    title: "Informe en revisión",
    body: "Tu cuestionario fue procesado. Un profesional revisará el informe antes de entregártelo.",
    href: "/app/informe",
  });

  revalidatePath("/app");
  revalidatePath("/app/resultados");
  revalidatePath("/app/informe");
  revalidatePath("/app/notificaciones");
  revalidatePath("/pro");
  void report;
  return { ok: true };
}

export async function addPortfolioReflectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const row = await requireStudent();
  if (!row) return { error: "No autorizado" };
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return { error: "Título y reflexión son obligatorios" };

  await db.insert(portfolioItems).values({
    studentId: row.student.id,
    type: "reflexion",
    title,
    body,
    yearLabel: `${row.student.gradeLevel}° medio`,
  });
  revalidatePath("/app/portafolio");
  return { ok: true };
}

import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  assessmentAnswers,
  assessmentResponses,
  assessmentSections,
  assessmentVersions,
  assessments,
  questionOptions,
  questions,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId, hasRequiredConsents } from "@/lib/students";
import { startOrResumeAssessmentAction } from "@/app/actions/student";
import { QuestionnaireRunner } from "./questionnaire-runner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function QuestionnairesPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");
  if (!(await hasRequiredConsents(row.student.id))) {
    redirect("/app/consentimiento");
  }

  const [assessment] = await db
    .select()
    .from(assessments)
    .where(eq(assessments.code, "intereses-enruta-v1"))
    .limit(1);

  if (!assessment) {
    return <p>No hay cuestionarios disponibles.</p>;
  }

  const [version] = await db
    .select()
    .from(assessmentVersions)
    .where(eq(assessmentVersions.assessmentId, assessment.id))
    .limit(1);

  const started = await startOrResumeAssessmentAction();
  if (!started.responseId) {
    return <p>{started.error ?? "No se pudo iniciar el cuestionario"}</p>;
  }

  const [response] = await db
    .select()
    .from(assessmentResponses)
    .where(eq(assessmentResponses.id, started.responseId))
    .limit(1);

  if (response?.status === "submitted") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cuestionario enviado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-white/70">
            Ya enviaste el cuestionario de intereses. Revisa tus resultados y el
            estado del informe.
          </p>
          <div className="flex gap-2">
            <Link href="/app/resultados">
              <Button>Ver resultados</Button>
            </Link>
            <Link href="/app/informe">
              <Button variant="secondary">Ver informe</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sections = await db
    .select()
    .from(assessmentSections)
    .where(eq(assessmentSections.versionId, version!.id));

  const qs = [];
  for (const s of sections) {
    const list = await db
      .select()
      .from(questions)
      .where(eq(questions.sectionId, s.id))
      .orderBy(asc(questions.orderIndex));
    for (const q of list) {
      const opts = await db
        .select()
        .from(questionOptions)
        .where(eq(questionOptions.questionId, q.id))
        .orderBy(asc(questionOptions.orderIndex));
      qs.push({ ...q, options: opts, sectionTitle: s.title });
    }
  }

  const answers = await db
    .select()
    .from(assessmentAnswers)
    .where(eq(assessmentAnswers.responseId, response!.id));

  const answerMap: Record<string, string> = {};
  for (const a of answers) {
    answerMap[a.questionId] = String(a.value ?? "");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{assessment.title}</h1>
        <p className="text-white/60">{assessment.description}</p>
        <p className="mt-2 text-xs text-white/40">
          Instrumento propio ENRUTA. Resultados orientativos. Guardado
          automático al responder.
        </p>
      </div>
      <QuestionnaireRunner
        responseId={response!.id}
        questions={qs.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          helpText: q.helpText,
          options: q.options.map((o) => ({
            id: o.id,
            label: o.label,
            value: o.value,
          })),
        }))}
        initialAnswers={answerMap}
        progressPct={response!.progressPct}
      />
    </div>
  );
}

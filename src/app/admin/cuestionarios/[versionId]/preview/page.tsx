import Link from "next/link";
import { notFound } from "next/navigation";
import { getVersionDetail } from "@/app/actions/questionnaire-admin";
import { Button } from "@/components/ui/button";
import { PreviewRunner } from "./preview-runner";

export default async function QuestionnairePreviewPage({
  params,
}: {
  params: Promise<{ versionId: string }>;
}) {
  const { versionId } = await params;
  const detail = await getVersionDetail(versionId);
  if (!detail) notFound();

  const questions = detail.sections.flatMap(({ section, questions: qs }) =>
    qs.map((q) => ({
      id: q.id,
      sectionTitle: section.title,
      prompt: q.prompt,
      helpText: q.helpText,
      options: q.options.map((o) => ({
        id: o.id,
        label: o.label,
        value: o.value,
      })),
    })),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`/admin/cuestionarios/${versionId}`}
            className="text-sm text-neon-cyan hover:underline"
          >
            ← Volver al editor
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            Preview · {detail.assessment?.title}
          </h1>
          <p className="text-white/55">
            Versión {detail.version.version} · {questions.length} preguntas ·
            experiencia tipo estudiante
          </p>
        </div>
        <Link href={`/admin/cuestionarios/${versionId}`}>
          <Button variant="secondary" size="sm">
            Editar
          </Button>
        </Link>
      </div>

      <PreviewRunner questions={questions} />
    </div>
  );
}

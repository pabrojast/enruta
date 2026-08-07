import Link from "next/link";
import { notFound } from "next/navigation";
import { getVersionDetail } from "@/app/actions/questionnaire-admin";
import { Button } from "@/components/ui/button";
import { AddQuestionForm } from "./add-question-form";
import { AddSectionForm } from "./add-section-form";
import {
  QuestionnaireDnd,
  type DnDSection,
} from "./questionnaire-dnd";

export default async function EditQuestionnairePage({
  params,
}: {
  params: Promise<{ versionId: string }>;
}) {
  const { versionId } = await params;
  const detail = await getVersionDetail(versionId);
  if (!detail) notFound();

  const defaultSectionId = detail.sections[0]?.section.id;

  const initialSections: DnDSection[] = detail.sections.map(
    ({ section, questions }) => ({
      id: section.id,
      title: section.title,
      questions: questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        primaryDimension:
          (q.config as { primaryDimension?: string } | null)
            ?.primaryDimension || "—",
        optionsCount: q.options.length,
        sectionId: section.id,
      })),
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{detail.assessment?.title}</h1>
          <p className="text-white/55">
            Versión {detail.version.version} · {detail.assessment?.code}
          </p>
          <p className="mt-1 text-sm text-neon-cyan/80">
            Editor con drag and drop: reordena y mueve preguntas entre secciones.
          </p>
        </div>
        <Link href={`/admin/cuestionarios/${versionId}/preview`}>
          <Button variant="secondary" size="sm">
            Preview estudiante
          </Button>
        </Link>
      </div>

      <AddSectionForm versionId={versionId} />
      {defaultSectionId ? (
        <AddQuestionForm
          versionId={versionId}
          sections={detail.sections.map((s) => ({
            id: s.section.id,
            title: s.section.title,
          }))}
        />
      ) : null}

      <QuestionnaireDnd versionId={versionId} initialSections={initialSections} />
    </div>
  );
}

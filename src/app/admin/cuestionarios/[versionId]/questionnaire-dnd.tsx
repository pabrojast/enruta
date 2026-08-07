"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  moveQuestionAction,
  reorderQuestionsAction,
  reorderSectionsAction,
  renameSectionAction,
} from "@/app/actions/questionnaire-admin";
import { deleteQuestionAction } from "@/app/actions/questionnaire-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DnDQuestion = {
  id: string;
  prompt: string;
  type: string;
  primaryDimension: string;
  optionsCount: number;
  sectionId: string;
};

export type DnDSection = {
  id: string;
  title: string;
  questions: DnDQuestion[];
};

type ActiveDrag =
  | { type: "section"; id: string }
  | { type: "question"; id: string; sectionId: string }
  | null;

export function QuestionnaireDnd({
  versionId,
  initialSections,
}: {
  versionId: string;
  initialSections: DnDSection[];
}) {
  const [sections, setSections] = useState(initialSections);
  const [active, setActive] = useState<ActiveDrag>(null);
  const [originSectionId, setOriginSectionId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  function findSectionByQuestion(questionId: string) {
    return sections.find((s) => s.questions.some((q) => q.id === questionId));
  }

  function onDragStart(event: DragStartEvent) {
    const data = event.active.data.current as
      | { type: "section" }
      | { type: "question"; sectionId: string }
      | undefined;
    if (!data) return;
    if (data.type === "section") {
      setActive({ type: "section", id: String(event.active.id) });
      setOriginSectionId(null);
    } else {
      setActive({
        type: "question",
        id: String(event.active.id),
        sectionId: data.sectionId,
      });
      setOriginSectionId(data.sectionId);
    }
    setStatus(null);
  }

  function onDragOver(event: DragOverEvent) {
    const { active: a, over } = event;
    if (!over) return;

    const activeData = a.data.current as
      | { type: "section" }
      | { type: "question"; sectionId: string }
      | undefined;
    const overData = over.data.current as
      | { type: "section" }
      | { type: "question"; sectionId: string }
      | { type: "section-drop"; sectionId: string }
      | undefined;

    if (!activeData || activeData.type !== "question") return;

    const activeSectionId = activeData.sectionId;
    let overSectionId: string | null = null;

    if (overData?.type === "question") overSectionId = overData.sectionId;
    else if (overData?.type === "section-drop") overSectionId = overData.sectionId;
    else if (overData?.type === "section") overSectionId = String(over.id);
    else if (sectionIds.includes(String(over.id))) overSectionId = String(over.id);

    if (!overSectionId || activeSectionId === overSectionId) return;

    setSections((prev) => {
      const next = prev.map((s) => ({
        ...s,
        questions: [...s.questions],
      }));
      const from = next.find((s) => s.id === activeSectionId);
      const to = next.find((s) => s.id === overSectionId);
      if (!from || !to) return prev;

      const qIndex = from.questions.findIndex((q) => q.id === a.id);
      if (qIndex < 0) return prev;
      const [moved] = from.questions.splice(qIndex, 1);
      moved.sectionId = to.id;

      // Insert near over item if question, else append
      if (overData?.type === "question") {
        const overIndex = to.questions.findIndex((q) => q.id === over.id);
        to.questions.splice(overIndex >= 0 ? overIndex : to.questions.length, 0, moved);
      } else {
        to.questions.push(moved);
      }

      return next;
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active: a, over } = event;
    setActive(null);
    if (!over) return;

    const activeData = a.data.current as
      | { type: "section" }
      | { type: "question"; sectionId: string }
      | undefined;
    if (!activeData) return;

    if (activeData.type === "section") {
      const oldIndex = sections.findIndex((s) => s.id === a.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

      const next = arrayMove(sections, oldIndex, newIndex);
      setSections(next);
      startTransition(async () => {
        const res = await reorderSectionsAction({
          versionId,
          orderedSectionIds: next.map((s) => s.id),
        });
        setStatus(res.error || "Orden de secciones guardado");
      });
      return;
    }

    // Question reorder / final persist
    const section = findSectionByQuestion(String(a.id)) ||
      sections.find((s) => s.id === activeData.sectionId);
    if (!section) return;

    // Ensure local order within section if dropped on another question in same section
    let nextSections = sections;
    if (
      over.data.current &&
      (over.data.current as { type?: string }).type === "question"
    ) {
      const overSection = findSectionByQuestion(String(over.id));
      if (overSection && overSection.id === section.id) {
        const oldIndex = section.questions.findIndex((q) => q.id === a.id);
        const newIndex = section.questions.findIndex((q) => q.id === over.id);
        if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
          nextSections = sections.map((s) =>
            s.id === section.id
              ? {
                  ...s,
                  questions: arrayMove(s.questions, oldIndex, newIndex),
                }
              : s,
          );
          setSections(nextSections);
        }
      }
    }

    const current = nextSections.find((s) =>
      s.questions.some((q) => q.id === a.id),
    );
    if (!current) return;

    const toIndex = current.questions.findIndex((q) => q.id === a.id);
    const fromSection = originSectionId;

    startTransition(async () => {
      if (fromSection && fromSection !== current.id) {
        const res = await moveQuestionAction({
          versionId,
          questionId: String(a.id),
          toSectionId: current.id,
          toIndex,
        });
        // also persist remaining order in destination
        if (!res.error) {
          await reorderQuestionsAction({
            versionId,
            sectionId: current.id,
            orderedQuestionIds: current.questions.map((q) => q.id),
          });
        }
        setStatus(res.error || "Pregunta movida y guardada");
      } else {
        const res = await reorderQuestionsAction({
          versionId,
          sectionId: current.id,
          orderedQuestionIds: current.questions.map((q) => q.id),
        });
        setStatus(res.error || "Orden de preguntas guardado");
      }
      setOriginSectionId(null);
    });
  }

  function onRename(sectionId: string, title: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    );
    startTransition(async () => {
      await renameSectionAction({ versionId, sectionId, title });
      setStatus("Sección renombrada");
    });
  }

  function onDelete(questionId: string) {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        questions: s.questions.filter((q) => q.id !== questionId),
      })),
    );
    startTransition(async () => {
      await deleteQuestionAction(questionId);
      setStatus("Pregunta eliminada");
    });
  }

  const activeQuestion =
    active?.type === "question"
      ? sections
          .flatMap((s) => s.questions)
          .find((q) => q.id === active.id)
      : null;
  const activeSection =
    active?.type === "section"
      ? sections.find((s) => s.id === active.id)
      : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/55">
        <p>
          Arrastra el asa <GripVertical className="inline h-3.5 w-3.5" /> para
          reordenar secciones y preguntas. También puedes soltar una pregunta en
          otra sección.
        </p>
        <p className={cn(pending && "text-neon-cyan")}>
          {pending ? "Guardando…" : status || "Listo"}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onRename={onRename}
                onDeleteQuestion={onDelete}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSection ? (
            <Card className="border-neon-cyan/40 opacity-95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base">{activeSection.title}</CardTitle>
              </CardHeader>
            </Card>
          ) : null}
          {activeQuestion ? (
            <QuestionCard question={activeQuestion} overlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function SortableSection({
  section,
  onRename,
  onDeleteQuestion,
}: {
  section: DnDSection;
  onRename: (id: string, title: string) => void;
  onDeleteQuestion: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: { type: "section" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-${section.id}`,
    data: { type: "section-drop", sectionId: section.id },
  });

  const questionIds = section.questions.map((q) => q.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging && "opacity-40",
        isOver && "ring-2 ring-neon-cyan/40 rounded-2xl",
      )}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <button
            type="button"
            className="cursor-grab touch-none rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white active:cursor-grabbing"
            aria-label={`Arrastrar sección ${section.title}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <Input
              defaultValue={section.title}
              className="h-9 border-white/10 bg-transparent font-semibold"
              onBlur={(e) => {
                if (e.target.value.trim() && e.target.value !== section.title) {
                  onRename(section.id, e.target.value.trim());
                }
              }}
              aria-label="Nombre de la sección"
            />
            <p className="mt-1 text-xs text-white/40">
              {section.questions.length} pregunta
              {section.questions.length === 1 ? "" : "s"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="min-h-16 space-y-2">
          <div ref={setDropRef} className="space-y-2">
            <SortableContext
              items={questionIds}
              strategy={verticalListSortingStrategy}
            >
              {section.questions.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 px-3 py-6 text-center text-sm text-white/40">
                  Suelta preguntas aquí
                </p>
              ) : (
                section.questions.map((q) => (
                  <SortableQuestion
                    key={q.id}
                    question={q}
                    onDelete={() => onDeleteQuestion(q.id)}
                  />
                ))
              )}
            </SortableContext>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableQuestion({
  question,
  onDelete,
}: {
  question: DnDQuestion;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    data: { type: "question", sectionId: question.sectionId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "opacity-30")}>
      <QuestionCard
        question={question}
        dragHandleProps={{ ...attributes, ...listeners }}
        onDelete={onDelete}
      />
    </div>
  );
}

function QuestionCard({
  question,
  dragHandleProps,
  onDelete,
  overlay,
}: {
  question: DnDQuestion;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  onDelete?: () => void;
  overlay?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/25 p-3",
        overlay && "border-neon-pink/50 shadow-2xl shadow-neon-pink/10",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 cursor-grab touch-none rounded-lg p-1 text-white/45 hover:bg-white/10 hover:text-white active:cursor-grabbing"
          aria-label="Arrastrar pregunta"
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white">{question.prompt}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{question.type}</Badge>
            <Badge>{question.primaryDimension || "—"}</Badge>
            <Badge>{question.optionsCount} opciones</Badge>
          </div>
        </div>
        {onDelete ? (
          <Button size="sm" variant="danger" onClick={onDelete}>
            Eliminar
          </Button>
        ) : null}
      </div>
    </div>
  );
}

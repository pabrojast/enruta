"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertBanner } from "@/components/alert-banner";

export type PreviewQuestion = {
  id: string;
  sectionTitle: string;
  prompt: string;
  helpText: string | null;
  options: { id: string; label: string; value: string }[];
};

export function PreviewRunner({ questions }: { questions: PreviewQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const q = questions[index];
  const answered = useMemo(
    () => Object.keys(answers).filter((k) => answers[k]).length,
    [answers],
  );
  const pct =
    questions.length === 0
      ? 0
      : Math.round(((index + (answers[q?.id] ? 1 : 0)) / questions.length) * 100);

  if (questions.length === 0) {
    return (
      <AlertBanner tone="warn">
        Esta versión no tiene preguntas todavía. Agrega secciones y preguntas en
        el editor.
      </AlertBanner>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <AlertBanner>
        Vista previa · no se guarda ni se envía. Así se ve el flujo para el
        estudiante.
      </AlertBanner>
      <Progress
        value={Math.min(100, Math.round((answered / questions.length) * 100))}
        label={`Respondidas ${answered} de ${questions.length}`}
      />
      <p className="text-xs text-white/45">
        Pregunta {index + 1} · Sección: {q.sectionTitle}
        {pct > 0 ? ` · avance aprox. ${pct}%` : null}
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-snug">{q.prompt}</CardTitle>
          {q.helpText ? (
            <p className="text-sm text-white/55">{q.helpText}</p>
          ) : null}
        </CardHeader>
        <CardContent className="grid gap-2">
          {q.options.length === 0 ? (
            <p className="text-sm text-white/50">
              Sin opciones configuradas para esta pregunta.
            </p>
          ) : (
            q.options.map((opt) => {
              const selected = answers[q.id] === opt.value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? "border-neon-cyan/50 bg-neon-cyan/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/85 hover:border-neon-cyan/30"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })
          )}
        </CardContent>
      </Card>
      <div className="flex flex-wrap justify-between gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Anterior
        </Button>
        <Button
          type="button"
          disabled={index >= questions.length - 1}
          onClick={() =>
            setIndex((i) => Math.min(questions.length - 1, i + 1))
          }
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

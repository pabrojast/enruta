"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveAnswerAction,
  submitAssessmentAction,
} from "@/app/actions/student";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Q = {
  id: string;
  prompt: string;
  helpText: string | null;
  options: { id: string; label: string; value: string }[];
};

export function QuestionnaireRunner({
  responseId,
  questions,
  initialAnswers,
  progressPct,
}: {
  responseId: string;
  questions: Q[];
  initialAnswers: Record<string, string>;
  progressPct: number;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(() => {
    const firstEmpty = questions.findIndex((q) => !initialAnswers[q.id]);
    return firstEmpty === -1 ? 0 : firstEmpty;
  });
  const [answers, setAnswers] = useState(initialAnswers);
  const [progress, setProgress] = useState(progressPct);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  const q = questions[index];
  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => answers[k]).length,
    [answers],
  );

  async function select(value: string) {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    setSaving(true);
    setError(null);
    const res = await saveAnswerAction({
      responseId,
      questionId: q.id,
      value,
    });
    setSaving(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    const pct = Math.round(
      ((answeredCount + (answers[q.id] ? 0 : 1)) / questions.length) * 100,
    );
    setProgress(Math.min(100, pct));
  }

  function submit() {
    startTransition(async () => {
      setError(null);
      const res = await submitAssessmentAction(responseId);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/app/resultados");
      router.refresh();
    });
  }

  if (!q) return null;

  return (
    <div className="space-y-4">
      <Progress
        value={progress}
        label={`Avance · ${answeredCount}/${questions.length} respuestas`}
      />
      <Card>
        <CardHeader>
          <p className="text-xs uppercase tracking-widest text-white/40">
            Pregunta {index + 1} de {questions.length}
          </p>
          <CardTitle className="text-lg leading-snug">{q.prompt}</CardTitle>
          {q.helpText ? (
            <p className="text-sm text-white/50">{q.helpText}</p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-2">
          <div
            className="space-y-2"
            role="radiogroup"
            aria-label={q.prompt}
          >
            {q.options.map((o) => {
              const selected = answers[q.id] === o.value;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => select(o.value)}
                  className={`flex min-h-12 w-full rounded-xl border px-4 py-3 text-left text-sm transition-[border-color,background-color,color] duration-150 ${
                    selected
                      ? "border-neon-cyan bg-neon-cyan/15 text-white ring-1 ring-neon-cyan/30"
                      : "border-white/10 bg-black/20 text-white/80 hover:border-white/25"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          {saving ? (
            <p className="text-xs text-white/40">Guardando…</p>
          ) : (
            <p className="text-xs text-white/40">Guardado automático activo</p>
          )}
        </CardContent>
      </Card>

      {error ? <AlertBanner tone="warn">{error}</AlertBanner> : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Anterior
        </Button>
        <div className="flex gap-2">
          {index < questions.length - 1 ? (
            <Button
              onClick={() =>
                setIndex((i) => Math.min(questions.length - 1, i + 1))
              }
              disabled={!answers[q.id]}
            >
              Siguiente
            </Button>
          ) : (
            <Button onClick={submit} disabled={pending || answeredCount < questions.length}>
              {pending ? "Procesando…" : "Enviar y generar informe"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

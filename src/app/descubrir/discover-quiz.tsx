"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DEMO_QUESTIONS,
  applyOption,
  archetypeTitle,
  emptyScores,
  normalizeScores,
  suggestedRoutes,
  topDimensions,
  type DemoScores,
} from "@/lib/demo-quiz";
import { RIASEC } from "@/lib/dimensions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";

type Phase = "intro" | "quiz" | "result";

export function DiscoverQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<DemoScores>(emptyScores);

  const total = DEMO_QUESTIONS.length;
  const question = DEMO_QUESTIONS[index];
  const pct = phase === "quiz" ? Math.round((index / total) * 100) : phase === "result" ? 100 : 0;

  const result = useMemo(() => {
    if (phase !== "result") return null;
    const normalized = normalizeScores(scores);
    const top = topDimensions(normalized, 3);
    return {
      normalized,
      top,
      title: archetypeTitle(top),
      routes: suggestedRoutes(top),
    };
  }, [phase, scores]);

  function restart() {
    setPhase("intro");
    setIndex(0);
    setScores(emptyScores());
  }

  function pick(optionIndex: number) {
    if (!question) return;
    const option = question.options[optionIndex];
    const nextScores = applyOption(scores, option);
    setScores(nextScores);
    if (index + 1 >= total) {
      setPhase("result");
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (phase === "intro") {
    return (
      <Card className="border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Micro-descubrimiento (≈3 min)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-white/70">
            Diez preguntas cortas para un primer mapa de intereses.{" "}
            <strong className="text-white">No es un diagnóstico</strong> ni te
            dice “qué debes estudiar”. Es una puerta de entrada: el proceso
            completo de ENRUTA se hace con tu colegio y mediación profesional.
          </p>
          <ul className="space-y-1.5 text-sm text-white/55">
            <li>· Sin crear cuenta</li>
            <li>· Sin guardar datos en el servidor</li>
            <li>· Resultado orientativo + rutas de ejemplo</li>
          </ul>
          <Button
            size="lg"
            onClick={() => {
              setPhase("quiz");
              setIndex(0);
              setScores(emptyScores());
            }}
          >
            Empezar
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="space-y-6">
        <Card className="border-neon-green/30 bg-gradient-to-br from-neon-green/10 via-transparent to-neon-cyan/10">
          <CardHeader>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neon-cyan">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Tu primer mapa
            </p>
            <CardTitle className="text-2xl">{result.title}</CardTitle>
            <p className="text-sm text-white/60">
              Perfil tentativo según tus respuestas. En ENRUTA completo se
              cruza con cuestionarios del colegio e informe mediado.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/45">
                Dimensiones más altas
              </p>
              <div className="flex flex-wrap gap-2">
                {result.top.map((code) => (
                  <span
                    key={code}
                    className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-sm text-white"
                  >
                    {RIASEC[code].name}{" "}
                    <span className="tabular text-white/45">
                      {result.normalized[code]}%
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {result.top.map((code) => (
                <div
                  key={code}
                  className="rounded-xl border border-white/10 bg-black/20 p-3"
                >
                  <p className="text-sm font-medium text-white">
                    {RIASEC[code].short}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">
                    {RIASEC[code].description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rutas de ejemplo para mirar</CardTitle>
            <p className="text-sm text-white/55">
              No son un ranking definitivo: son conversaciones posibles.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.routes.map((r) => (
              <div
                key={r.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-medium text-white">{r.title}</p>
                <p className="mt-1 text-sm text-white/60">{r.why}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-neon-cyan/20">
          <CardContent className="space-y-4 p-5">
            <p className="text-sm leading-relaxed text-white/70">
              <strong className="text-white">Siguiente paso real:</strong> si tu
              colegio usa ENRUTA, regístrate con el código del establecimiento.
              Ahí el proceso es continuo (1°–4° medio) y el informe lo valida un
              profesional.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/registro">
                <Button size="lg">Continuar con mi colegio</Button>
              </Link>
              <Link href="/colegios">
                <Button size="lg" variant="secondary">
                  Soy colegio / orientador
                </Button>
              </Link>
              <Button size="lg" variant="ghost" onClick={restart}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                Rehacer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Progress
        value={pct}
        label={`Pregunta ${index + 1} de ${total}`}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-snug">{question.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {question.options.map((opt, i) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => pick(i)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left text-sm leading-relaxed text-white/85 transition hover:border-neon-cyan/40 hover:bg-neon-cyan/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
            >
              {opt.label}
            </button>
          ))}
        </CardContent>
      </Card>
      <p className="text-center text-xs text-white/40">
        Elige la opción que más se acerque. No hay respuestas correctas.
      </p>
    </div>
  );
}

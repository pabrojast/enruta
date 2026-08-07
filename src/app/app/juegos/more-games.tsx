"use client";

import { useState, useTransition } from "react";
import { saveGameSessionAction } from "@/app/actions/misc";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const decisions = [
  {
    q: "Te ofrecen un trabajo inmediato con baja proyección o estudiar 2 años con mejor campo. ¿Qué exploras primero?",
    a: "Trabajo inmediato + estudio parcial",
    b: "Formación de 2 años y luego trabajar",
    c: "Combinar ambos con un plan B escrito",
  },
  {
    q: "Un proyecto grupal se complica. ¿Qué haces?",
    a: "Reorganizo tareas y plazos",
    b: "Conversamos el conflicto y redefinimos roles",
    c: "Propongo un prototipo simple para avanzar",
  },
];

const challenges = [
  {
    skill: "Resolución práctica",
    task: "Describe en 2 pasos cómo armarías un stand para una feria vocacional con presupuesto bajo.",
  },
  {
    skill: "Comunicación",
    task: "Escribe un mensaje corto para invitar a tu familia a una charla sin presionar.",
  },
];

const environments = [
  {
    id: "lab",
    title: "Laboratorio / taller",
    feel: "Ruido de equipos, pruebas, precisión y seguridad.",
  },
  {
    id: "office",
    title: "Oficina / equipo digital",
    feel: "Pantallas, reuniones, documentación y colaboración remota.",
  },
  {
    id: "field",
    title: "Terreno / comunidad",
    feel: "Aire libre o visita a personas, imprevistos y adaptación.",
  },
];

export function DecisionGame() {
  const [i, setI] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [reflection, setReflection] = useState("");
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const step = decisions[i];

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Juego de decisiones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="list-disc pl-5 text-sm text-white/70">
            {Object.values(choices).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <Label>Reflexión</Label>
          <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)} />
          {msg ? <AlertBanner tone="success">{msg}</AlertBanner> : null}
          <Button
            disabled={pending || !reflection.trim()}
            onClick={() =>
              start(async () => {
                await saveGameSessionAction({
                  gameCode: "decisions",
                  resultSummary: `Decisiones: ${Object.values(choices).join(" | ")}`,
                  reflection,
                  choices,
                });
                setMsg("Guardado. No es un diagnóstico; es material para conversar.");
              })
            }
          >
            Guardar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Juego de decisiones · {i + 1}/{decisions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-white/80">{step.q}</p>
        {[step.a, step.b, step.c].map((opt) => (
          <button
            key={opt}
            type="button"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left text-sm hover:border-neon-cyan/40"
            onClick={() => {
              const next = { ...choices, [`d${i}`]: opt };
              setChoices(next);
              if (i < decisions.length - 1) setI(i + 1);
              else setDone(true);
            }}
          >
            {opt}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

export function ChallengeGame() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const ch = challenges[idx];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Desafío de habilidades · {ch.skill}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/75">{ch.task}</p>
        <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
        {msg ? <AlertBanner tone="success">{msg}</AlertBanner> : null}
        <div className="flex gap-2">
          <Button
            disabled={pending || answer.trim().length < 10}
            onClick={() =>
              start(async () => {
                await saveGameSessionAction({
                  gameCode: "skill_challenge",
                  resultSummary: `Desafío ${ch.skill}`,
                  reflection: answer,
                  choices: { skill: ch.skill },
                });
                setMsg("Desafío guardado.");
                setAnswer("");
                setIdx((idx + 1) % challenges.length);
              })
            }
          >
            Guardar respuesta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EnvironmentExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const env = environments.find((e) => e.id === selected);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Explorador de ambientes laborales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          {environments.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelected(e.id)}
              className={`rounded-xl border px-3 py-2 text-left text-sm ${
                selected === e.id
                  ? "border-neon-pink bg-neon-pink/10"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <strong>{e.title}</strong>
              <p className="mt-1 text-xs text-white/55">{e.feel}</p>
            </button>
          ))}
        </div>
        {env ? (
          <>
            <Label>¿Te imaginas un día ahí? ¿Qué te gusta y qué no?</Label>
            <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)} />
            {msg ? <AlertBanner tone="success">{msg}</AlertBanner> : null}
            <Button
              disabled={pending || !reflection.trim()}
              onClick={() =>
                start(async () => {
                  await saveGameSessionAction({
                    gameCode: "work_environment",
                    resultSummary: `Ambiente: ${env.title}`,
                    reflection,
                    choices: { environment: env.id },
                  });
                  setMsg("Exploración guardada.");
                })
              }
            >
              Guardar exploración
            </Button>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

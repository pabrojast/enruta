"use client";

import { useMemo, useState, useTransition } from "react";
import { saveGameSessionAction } from "@/app/actions/misc";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const roles = [
  {
    id: "dev",
    title: "Desarrollador/a de software",
    steps: [
      {
        q: "Llega un bug urgente en producción. ¿Qué haces primero?",
        options: [
          { id: "a", label: "Reproduzco el error y reviso logs" },
          { id: "b", label: "Pregunto al equipo qué cambió ayer" },
          { id: "c", label: "Propongo un parche rápido y documentar después" },
        ],
      },
      {
        q: "En la tarde hay reunión de planificación. ¿Cómo aportas?",
        options: [
          { id: "a", label: "Estimo tareas con calma y pido claridad" },
          { id: "b", label: "Facilito la conversación del equipo" },
          { id: "c", label: "Propongo una mejora creativa al producto" },
        ],
      },
      {
        q: "Queda una hora libre. ¿Qué eliges?",
        options: [
          { id: "a", label: "Aprender una herramienta nueva" },
          { id: "b", label: "Ayudar a un compañero con su código" },
          { id: "c", label: "Ordenar tickets y documentación" },
        ],
      },
    ],
  },
  {
    id: "nurse",
    title: "Enfermero/a",
    steps: [
      {
        q: "Inicio de turno: hay varias tareas. ¿Priorizas?",
        options: [
          { id: "a", label: "Pacientes con mayor urgencia clínica" },
          { id: "b", label: "Coordinar con el equipo el plan del día" },
          { id: "c", label: "Revisar registros y checklist de seguridad" },
        ],
      },
      {
        q: "Una persona está ansiosa antes de un procedimiento. ¿Qué haces?",
        options: [
          { id: "a", label: "Explico con calma y escucho sus dudas" },
          { id: "b", label: "Llamo a un familiar de apoyo si corresponde" },
          { id: "c", label: "Sigo el protocolo y documentó la situación" },
        ],
      },
      {
        q: "Cierre de turno. ¿Qué te deja más energía?",
        options: [
          { id: "a", label: "Ver que un paciente mejoró" },
          { id: "b", label: "El trabajo en equipo del turno" },
          { id: "c", label: "Dejar todo ordenado para el siguiente turno" },
        ],
      },
    ],
  },
  {
    id: "agro",
    title: "Técnico/a agropecuario/a",
    steps: [
      {
        q: "Mañana en terreno: detectas un problema en el cultivo. ¿Qué haces?",
        options: [
          { id: "a", label: "Observo, tomo muestras y registro datos" },
          { id: "b", label: "Consulto con el equipo y propongo un plan" },
          { id: "c", label: "Ajusto de inmediato una práctica de manejo" },
        ],
      },
      {
        q: "Hay que explicar el trabajo a estudiantes en visita. ¿Cómo lo haces?",
        options: [
          { id: "a", label: "Muestro el proceso paso a paso en terreno" },
          { id: "b", label: "Cuento una historia del día a día del oficio" },
          { id: "c", label: "Uso un esquema simple de costos y resultados" },
        ],
      },
      {
        q: "Fin de la jornada. ¿Qué te motiva a volver mañana?",
        options: [
          { id: "a", label: "Ver resultados tangibles en el campo" },
          { id: "b", label: "El vínculo con la comunidad rural" },
          { id: "c", label: "Mejorar procesos y eficiencia" },
        ],
      },
    ],
  },
];

export function DayInLifeGame() {
  const [roleId, setRoleId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [reflection, setReflection] = useState("");
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const role = useMemo(
    () => roles.find((r) => r.id === roleId) ?? null,
    [roleId],
  );

  function pick(optionId: string, label: string) {
    if (!role) return;
    const key = `step_${step}`;
    const next = { ...choices, [key]: label };
    setChoices(next);
    if (step < role.steps.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function save() {
    if (!role) return;
    start(async () => {
      const summary = `Simulaste un día como ${role.title}. Decisiones: ${Object.values(choices).join(" | ")}`;
      const res = await saveGameSessionAction({
        gameCode: "day_in_life",
        resultSummary: summary,
        reflection,
        choices,
      });
      if (res.error) setMsg(res.error);
      else
        setMsg(
          "Guardado. Recuerda: es una exploración, no un resultado determinista.",
        );
    });
  }

  if (!role) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Elige un rol para simular</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3">
          {roles.map((r) => (
            <Button
              key={r.id}
              variant="secondary"
              onClick={() => {
                setRoleId(r.id);
                setStep(0);
                setChoices({});
                setDone(false);
                setMsg(null);
              }}
            >
              {r.title}
            </Button>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cierre de la simulación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/70">
            Rol: <strong>{role.title}</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/65">
            {Object.values(choices).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="space-y-2">
            <Label htmlFor="reflection">
              ¿Qué te energizó o te hizo dudar?
            </Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Escribe una reflexión breve..."
            />
          </div>
          {msg ? <AlertBanner tone="success">{msg}</AlertBanner> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={pending || !reflection.trim()}>
              {pending ? "Guardando…" : "Guardar experiencia"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setRoleId(null);
                setDone(false);
                setReflection("");
                setChoices({});
                setMsg(null);
              }}
            >
              Probar otro rol
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const current = role.steps[step];
  return (
    <Card>
      <CardHeader>
        <p className="text-xs uppercase tracking-widest text-white/40">
          {role.title} · Momento {step + 1}/{role.steps.length}
        </p>
        <CardTitle className="text-lg">{current.q}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {current.options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => pick(o.id, o.label)}
            className="flex w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/80 hover:border-neon-cyan/40"
          >
            {o.label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

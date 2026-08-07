"use client";

import { useActionState } from "react";
import { saveFollowUpAction } from "@/app/actions/misc";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import {
  FormActions,
  FormField,
  FormSection,
  LongFormShell,
} from "@/components/long-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

const fields = [
  {
    name: "whatDidAfter",
    label: "¿Qué hiciste en este periodo?",
    hint: "Estudios, trabajo, trámites, charlas, cambios de idea…",
  },
  {
    name: "decisionChanged",
    label: "¿Cambió tu decisión?",
    hint: "Si no cambió, también es información útil.",
  },
  {
    name: "newAlternatives",
    label: "¿Aparecieron nuevas alternativas?",
  },
  {
    name: "difficulties",
    label: "¿Qué dificultades encontraste?",
  },
  {
    name: "supportNeeded",
    label: "¿Qué apoyo necesitas?",
  },
  {
    name: "nextStep",
    label: "¿Cuál es tu próximo paso?",
    hint: "Uno concreto y cercano en el tiempo.",
  },
];

export function FollowUpForm({ followUpId }: { followUpId: string }) {
  const [state, action, pending] = useActionState(saveFollowUpAction, initial);

  return (
    <LongFormShell
      title="Completa este seguimiento"
      description="Sirve para actualizar tu ruta y avisar a tu equipo si necesitas apoyo."
    >
      <form action={action} className="space-y-4">
        <input type="hidden" name="followUpId" value={followUpId} />
        <FormSection title="Tu situación actual">
          {fields.map((f) => (
            <FormField
              key={f.name}
              label={f.label}
              htmlFor={`${followUpId}-${f.name}`}
              hint={f.hint}
            >
              <Textarea
                id={`${followUpId}-${f.name}`}
                name={f.name}
                required
                rows={3}
                placeholder="Escribe aquí…"
              />
            </FormField>
          ))}
        </FormSection>

        {state.error ? <AlertBanner tone="warn">{state.error}</AlertBanner> : null}
        {state.ok ? (
          <AlertBanner tone="success">Seguimiento guardado.</AlertBanner>
        ) : null}

        <FormActions>
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Completar seguimiento"}
          </Button>
        </FormActions>
      </form>
    </LongFormShell>
  );
}

"use client";

import { useActionState } from "react";
import { addPortfolioReflectionAction } from "@/app/actions/student";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import {
  FormActions,
  FormField,
  FormSection,
  LongFormShell,
} from "@/components/long-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

export function PortfolioForm() {
  const [state, action, pending] = useActionState(
    addPortfolioReflectionAction,
    initial,
  );

  return (
    <LongFormShell
      stepLabel="Portafolio"
      title="Nueva reflexión"
      description="Deja una evidencia breve de lo que descubriste. Sirve para conversar después."
    >
      <form action={action} className="space-y-4">
        <FormSection title="Qué quieres registrar">
          <FormField
            label="Título"
            htmlFor="title"
            hint="Una frase corta que recuerdes después."
          >
            <Input
              id="title"
              name="title"
              required
              placeholder="Lo que aprendí en la charla de…"
              autoComplete="off"
            />
          </FormField>
          <FormField
            label="¿Qué aprendiste o descubriste?"
            htmlFor="body"
            hint="Hechos, emociones, dudas o próximos pasos."
          >
            <Textarea
              id="body"
              name="body"
              required
              rows={5}
              placeholder="Hoy me di cuenta de que…"
            />
          </FormField>
        </FormSection>

        {state.error ? <AlertBanner tone="warn">{state.error}</AlertBanner> : null}
        {state.ok ? (
          <AlertBanner tone="success">Reflexión guardada en tu portafolio.</AlertBanner>
        ) : null}

        <FormActions>
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Agregar al portafolio"}
          </Button>
        </FormActions>
      </form>
    </LongFormShell>
  );
}

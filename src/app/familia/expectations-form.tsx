"use client";

import { useActionState } from "react";
import { saveGuardianExpectationsAction } from "@/app/actions/misc";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

export function GuardianExpectationsForm({
  linkId,
  defaultValue,
}: {
  linkId: string;
  defaultValue: string;
}) {
  const [state, action, pending] = useActionState(
    saveGuardianExpectationsAction,
    initial,
  );

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="linkId" value={linkId} />
      <Label htmlFor={`exp-${linkId}`}>Expectativas familiares (opcionales)</Label>
      <Textarea
        id={`exp-${linkId}`}
        name="familyExpectations"
        defaultValue={defaultValue}
        placeholder="¿Cómo quieren acompañar a su hijo/a en este proceso?"
      />
      {state.ok ? (
        <AlertBanner tone="success">Expectativas guardadas.</AlertBanner>
      ) : null}
      {state.error ? <AlertBanner tone="warn">{state.error}</AlertBanner> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Guardando…" : "Guardar expectativas"}
      </Button>
    </form>
  );
}

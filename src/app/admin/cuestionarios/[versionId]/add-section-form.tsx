"use client";

import { useActionState } from "react";
import { addSectionAction } from "@/app/actions/questionnaire-admin";
import type { ActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function AddSectionForm({ versionId }: { versionId: string }) {
  const [state, action, pending] = useActionState(addSectionAction, initial);
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="versionId" value={versionId} />
      <div className="space-y-1">
        <Label htmlFor="title">Nueva sección</Label>
        <Input id="title" name="title" placeholder="Nombre de sección" required />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "…" : "Agregar sección"}
      </Button>
      {state.error ? (
        <span className="text-xs text-amber-200">{state.error}</span>
      ) : null}
    </form>
  );
}

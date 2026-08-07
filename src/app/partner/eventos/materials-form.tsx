"use client";

import { useActionState } from "react";
import { addEventMaterialAction } from "@/app/actions/extended";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function MaterialsForm({
  events,
}: {
  events: { id: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(addEventMaterialAction, initial);
  return (
    <form action={action} className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="eventId">Evento</Label>
        <select
          id="eventId"
          name="eventId"
          className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
          required
        >
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Título del material</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Enlace (opcional)</Label>
        <Input id="url" name="url" placeholder="https://..." />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="file">Archivo (PDF/imagen, máx 5MB)</Label>
        <Input id="file" name="file" type="file" accept=".pdf,image/*,.mp4,.txt" />
        <p className="text-xs text-white/40">
          Validación de tipo/firma mágica (control antivirus ligero).
        </p>
      </div>
      {state.error ? (
        <div className="md:col-span-2">
          <AlertBanner tone="warn">{state.error}</AlertBanner>
        </div>
      ) : null}
      {state.ok ? (
        <div className="md:col-span-2">
          <AlertBanner tone="success">Material cargado.</AlertBanner>
        </div>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Subiendo…" : "Agregar material"}
        </Button>
      </div>
    </form>
  );
}

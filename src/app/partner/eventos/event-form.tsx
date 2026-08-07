"use client";

import { useActionState } from "react";
import { partnerCreateEventAction } from "@/app/actions/misc";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

export function PartnerEventForm() {
  const [state, action, pending] = useActionState(
    partnerCreateEventAction,
    initial,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Publicar experiencia</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              name="type"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue="charla"
            >
              <option value="charla">Charla</option>
              <option value="taller">Taller</option>
              <option value="visita">Visita</option>
              <option value="feria">Feria</option>
              <option value="webinar">Webinar</option>
              <option value="mentoria">Mentoría</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startsAt">Fecha y hora</Label>
            <Input id="startsAt" name="startsAt" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Cupos</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={30}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modality">Modalidad</Label>
            <Input id="modality" name="modality" defaultValue="presencial" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Lugar o enlace</Label>
            <Input id="location" name="location" />
          </div>
          {state.error ? (
            <div className="md:col-span-2">
              <AlertBanner tone="warn">{state.error}</AlertBanner>
            </div>
          ) : null}
          {state.ok ? (
            <div className="md:col-span-2">
              <AlertBanner tone="success">Evento publicado.</AlertBanner>
            </div>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Publicando…" : "Publicar evento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

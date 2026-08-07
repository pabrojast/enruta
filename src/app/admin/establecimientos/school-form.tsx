"use client";

import { useActionState } from "react";
import { createSchoolAction } from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function SchoolForm() {
  const [state, action, pending] = useActionState(createSchoolAction, initial);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crear establecimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Código de invitación</Label>
            <Input id="inviteCode" name="inviteCode" required placeholder="NUEVO-2026" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modality">Modalidad</Label>
            <select
              id="modality"
              name="modality"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue="HC"
            >
              <option value="HC">HC</option>
              <option value="TP">TP</option>
              <option value="mixed">Mixta</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <Input id="region" name="region" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commune">Comuna</Label>
            <Input id="commune" name="commune" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="urbanRural">Contexto</Label>
            <select
              id="urbanRural"
              name="urbanRural"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue="urbano"
            >
              <option value="urbano">Urbano</option>
              <option value="rural">Rural</option>
            </select>
          </div>
          {state.error ? (
            <div className="md:col-span-2">
              <AlertBanner tone="warn">{state.error}</AlertBanner>
            </div>
          ) : null}
          {state.ok ? (
            <div className="md:col-span-2">
              <AlertBanner tone="success">
                Establecimiento creado con 4 cursos base.
              </AlertBanner>
            </div>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Creando…" : "Crear establecimiento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { createAssessmentAction } from "@/app/actions/questionnaire-admin";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

export function CreateAssessmentForm() {
  const [state, action, pending] = useActionState(createAssessmentAction, initial);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nuevo cuestionario</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input id="code" name="code" placeholder="intereses-extra-v1" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" />
          </div>
          {state.error ? (
            <div className="md:col-span-2">
              <AlertBanner tone="warn">{state.error}</AlertBanner>
            </div>
          ) : null}
          {state.ok ? (
            <div className="md:col-span-2">
              <AlertBanner tone="success">Cuestionario creado.</AlertBanner>
            </div>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Creando…" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { addQuestionAction } from "@/app/actions/questionnaire-admin";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function AddQuestionForm({
  versionId,
  sections,
}: {
  versionId: string;
  sections: { id: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(addQuestionAction, initial);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agregar pregunta</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 md:grid-cols-2">
          <input type="hidden" name="versionId" value={versionId} />
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="prompt">Enunciado</Label>
            <Input id="prompt" name="prompt" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionId">Sección</Label>
            <select
              id="sectionId"
              name="sectionId"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue={sections[0]?.id}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimension">Dimensión RIASEC</Label>
            <select
              id="dimension"
              name="dimension"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue="R"
            >
              {["R", "I", "A", "S", "E", "C"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <select
              id="type"
              name="type"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue="likert"
            >
              <option value="likert">Likert 1-5</option>
              <option value="single">Sí/No</option>
            </select>
          </div>
          {state.error ? (
            <div className="md:col-span-2">
              <AlertBanner tone="warn">{state.error}</AlertBanner>
            </div>
          ) : null}
          {state.ok ? (
            <div className="md:col-span-2">
              <AlertBanner tone="success">Pregunta agregada.</AlertBanner>
            </div>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando…" : "Agregar pregunta"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

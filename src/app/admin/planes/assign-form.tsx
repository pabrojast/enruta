"use client";

import { useActionState } from "react";
import { assignPlanAction } from "@/app/actions/extended";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function AssignPlanForm({
  schools,
  plans,
}: {
  schools: { id: string; name: string }[];
  plans: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(assignPlanAction, initial);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Asignar plan a establecimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="schoolId">Establecimiento</Label>
            <select
              id="schoolId"
              name="schoolId"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              required
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="planId">Plan</Label>
            <select
              id="planId"
              name="planId"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              required
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Asignando…" : "Asignar"}
            </Button>
          </div>
          {state.error ? (
            <div className="md:col-span-3">
              <AlertBanner tone="warn">{state.error}</AlertBanner>
            </div>
          ) : null}
          {state.ok ? (
            <div className="md:col-span-3">
              <AlertBanner tone="success">Plan asignado y flags actualizados.</AlertBanner>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { runMineducSyncAction } from "@/app/actions/extended";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState & { summary?: string } = {};

export function MineducForm() {
  const [state, action, pending] = useActionState(runMineducSyncAction, initial);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sincronización MINEDUC (stub)</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="rbd">RBD</Label>
            <Input id="rbd" name="rbd" defaultValue="12345-6" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Sincronizando…" : "Ejecutar stub"}
          </Button>
        </form>
        {state.summary ? (
          <div className="mt-3">
            <AlertBanner tone="success">{state.summary}</AlertBanner>
          </div>
        ) : null}
        {state.error ? (
          <div className="mt-3">
            <AlertBanner tone="warn">{state.error}</AlertBanner>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { savePartnerProfileAction } from "@/app/actions/misc";
import type { ActionState } from "@/app/actions/auth";
import type { partnerProfiles } from "@/db/schema";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Profile = typeof partnerProfiles.$inferSelect;
const initial: ActionState = {};

export function PartnerProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState(
    savePartnerProfileAction,
    initial,
  );

  return (
    <Card>
      <CardContent className="space-y-4 pt-5">
        <form action={action} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organización</Label>
            <Input
              id="organizationName"
              name="organizationName"
              defaultValue={profile?.organizationName ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizationType">Tipo</Label>
            <select
              id="organizationType"
              name="organizationType"
              defaultValue={profile?.organizationType ?? "empresa"}
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            >
              <option value="empresa">Empresa</option>
              <option value="universidad">Universidad</option>
              <option value="ip">IP</option>
              <option value="cft">CFT</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <Input
              id="region"
              name="region"
              defaultValue={profile?.region ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Correo de contacto</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={profile?.contactEmail ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={profile?.description ?? ""}
            />
          </div>
          {state.error ? (
            <AlertBanner tone="warn">{state.error}</AlertBanner>
          ) : null}
          {state.ok ? (
            <AlertBanner tone="success">Perfil guardado.</AlertBanner>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar perfil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

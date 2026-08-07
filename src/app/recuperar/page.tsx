"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  requestPasswordResetAction,
  resetPasswordAction,
} from "@/app/actions/misc";
import type { ActionState } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand-logo";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialReq: ActionState & { demoToken?: string } = {};
const initialReset: ActionState = {};

export default function RecoverPage() {
  const [reqState, reqAction, reqPending] = useActionState(
    requestPasswordResetAction,
    initialReq,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetPasswordAction,
    initialReset,
  );
  const [token, setToken] = useState("");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-4 py-10">
      <div className="mb-2 flex justify-center">
        <BrandLogo size={64} showText />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recuperar contraseña</CardTitle>
          <p className="text-sm text-white/55">
            En local no hay SMTP: generamos un token de un solo uso (equivalente
            al enlace del correo).
          </p>
        </CardHeader>
        <CardContent>
          <form action={reqAction} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Correo de la cuenta</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            {reqState.ok ? (
              <AlertBanner tone="success">
                Si el correo existe, se generó un token de recuperación.
                {reqState.demoToken ? (
                  <span className="mt-2 block break-all font-mono text-xs">
                    Token demo: {reqState.demoToken}
                  </span>
                ) : null}
              </AlertBanner>
            ) : null}
            {reqState.error ? (
              <AlertBanner tone="warn">{reqState.error}</AlertBanner>
            ) : null}
            <Button type="submit" className="w-full" disabled={reqPending}>
              {reqPending ? "Generando…" : "Solicitar recuperación"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Definir nueva contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={resetAction} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Input
                id="token"
                name="token"
                value={token || reqState.demoToken || ""}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </div>
            {resetState.error ? (
              <AlertBanner tone="warn">{resetState.error}</AlertBanner>
            ) : null}
            {resetState.ok ? (
              <AlertBanner tone="success">
                Contraseña actualizada. Ya puedes ingresar.
              </AlertBanner>
            ) : null}
            <Button type="submit" className="w-full" disabled={resetPending}>
              {resetPending ? "Guardando…" : "Cambiar contraseña"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-white/50">
            <Link href="/login" className="text-neon-cyan hover:underline">
              Volver a ingresar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

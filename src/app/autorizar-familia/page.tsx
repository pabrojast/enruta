"use client";

import { useActionState } from "react";
import {
  requestGuardianAuthAction,
  verifyGuardianAuthAction,
} from "@/app/actions/extended";
import type { ActionState } from "@/app/actions/auth";
import { PublicHeader } from "@/components/public-header";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialReq: ActionState & { demoOtp?: string } = {};
const initialVer: ActionState = {};

export default function GuardianAuthorizePage() {
  const [reqState, reqAction, reqPending] = useActionState(
    requestGuardianAuthAction,
    initialReq,
  );
  const [verState, verAction, verPending] = useActionState(
    verifyGuardianAuthAction,
    initialVer,
  );

  return (
    <div>
      <PublicHeader />
      <div className="mx-auto grid max-w-3xl gap-4 px-4 py-10 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Solicitar código OTP</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={reqAction} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Nombre apoderado/a</Label>
                <Input id="guardianName" name="guardianName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianEmail">Correo apoderado/a</Label>
                <Input id="guardianEmail" name="guardianEmail" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Correo del estudiante</Label>
                <Input
                  id="studentEmail"
                  name="studentEmail"
                  type="email"
                  placeholder="sofia.estudiante@demo.cl"
                  required
                />
              </div>
              <p className="text-xs text-white/45">
                Se envía un OTP al apoderado/a (o se registra en outbox si no hay
                SMTP).
              </p>
              {reqState.demoOtp ? (
                <AlertBanner tone="success">
                  OTP demo (sin SMTP): <strong>{reqState.demoOtp}</strong>
                </AlertBanner>
              ) : null}
              {reqState.ok && !reqState.demoOtp ? (
                <AlertBanner tone="success">
                  Código enviado (o registrado en outbox).
                </AlertBanner>
              ) : null}
              {reqState.error ? (
                <AlertBanner tone="warn">{reqState.error}</AlertBanner>
              ) : null}
              <Button type="submit" disabled={reqPending}>
                {reqPending ? "Enviando…" : "Enviar código"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Verificar y crear acceso</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={verAction} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianEmail2">Correo</Label>
                <Input id="guardianEmail2" name="guardianEmail" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Código OTP</Label>
                <Input id="otp" name="otp" required defaultValue={reqState.demoOtp || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña de acceso</Label>
                <Input id="password" name="password" type="password" minLength={8} required />
              </div>
              {verState.error ? (
                <AlertBanner tone="warn">{verState.error}</AlertBanner>
              ) : null}
              {verState.ok ? (
                <AlertBanner tone="success">
                  Autorización completada. Ya puedes ingresar en /login con tu
                  correo.
                </AlertBanner>
              ) : null}
              <Button type="submit" disabled={verPending}>
                {verPending ? "Verificando…" : "Verificar y activar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

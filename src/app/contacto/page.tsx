"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/app/actions/misc";
import type { ActionState } from "@/app/actions/auth";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

export default function ContactoPage() {
  const [state, action, pending] = useActionState(submitContactAction, initial);

  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <PublicHeader />
      <div className="mx-auto max-w-lg px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <p className="text-sm text-white/55">
              ¿Colegio, red o equipo de orientación? Cuéntanos tamaño,
              modalidad (HC/TP) y si buscas diagnóstico, piloto o programa de 4
              años. Revisamos cada mensaje desde el panel ENRUTA.
            </p>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo institucional</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolName">Establecimiento (opcional)</Label>
                <Input id="schoolName" name="schoolName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea id="message" name="message" required minLength={10} />
              </div>
              {state.error ? (
                <AlertBanner tone="warn">{state.error}</AlertBanner>
              ) : null}
              {state.ok ? (
                <AlertBanner tone="success">
                  Mensaje recibido. El equipo ENRUTA podrá verlo en el panel
                  admin.
                </AlertBanner>
              ) : null}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Enviando…" : "Enviar mensaje"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <PublicFooter />
    </div>
  );
}

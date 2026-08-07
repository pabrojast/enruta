"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand-logo";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <a href="#login-form" className="skip-link">
        Saltar al formulario
      </a>
      <div className="mb-6 flex flex-col items-center gap-2">
        <BrandLogo size={72} showText />
        <p className="text-center text-sm text-white/50">
          Orientación con calma, claridad y acompañamiento
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ingresar a ENRUTA</CardTitle>
          <p className="text-sm text-white/60">
            Usa el correo de tu cuenta o el código de tu colegio para registrarte.
          </p>
        </CardHeader>
        <CardContent>
          <form id="login-form" action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                required
                placeholder="sofia.estudiante@demo.cl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/recuperar"
                  className="text-xs text-neon-cyan hover:underline"
                >
                  ¿La olvidaste?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Tu contraseña…"
              />
            </div>
            {state.error ? (
              <AlertBanner tone="warn">
                {state.error} Revisa correo y contraseña, o recupera el acceso.
              </AlertBanner>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-white/50">
            ¿Primera vez?{" "}
            <Link href="/registro" className="text-neon-cyan hover:underline">
              Regístrate con código
            </Link>
          </p>
          <details className="mt-6 rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-white/55">
            <summary className="cursor-pointer font-medium text-white/75">
              Credenciales demo
            </summary>
            <div className="mt-2 space-y-1 leading-relaxed">
              <p>
                Estudiante:{" "}
                <span className="text-white/80" translate="no">
                  sofia.estudiante@demo.cl
                </span>
              </p>
              <p>
                Orientadora:{" "}
                <span className="text-white/80" translate="no">
                  orientador@losandes.cl
                </span>
              </p>
              <p>
                Contraseña:{" "}
                <span className="text-white/80" translate="no">
                  EnrutaDemo2026!
                </span>
              </p>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}

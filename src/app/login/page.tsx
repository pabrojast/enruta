"use client";

import Link from "next/link";
import { useActionState } from "react";
import { demoLoginAction, loginAction, type ActionState } from "@/app/actions/auth";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { BrandLogo } from "@/components/brand-logo";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const [demoState, demoAction, demoPending] = useActionState(
    demoLoginAction,
    initial,
  );

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
              Explorar la demo
            </summary>
            <div className="mt-2 space-y-2">
              <p className="leading-relaxed">
                Entra con un click a una cuenta de demostración para conocer
                cada rol de ENRUTA.
              </p>
              {demoState.error ? (
                <AlertBanner tone="warn">{demoState.error}</AlertBanner>
              ) : null}
              <form action={demoAction} className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <button
                    key={a.email}
                    type="submit"
                    name="email"
                    value={a.email}
                    disabled={demoPending}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-left text-white/80 transition hover:border-neon-cyan/50 hover:text-white disabled:opacity-50"
                  >
                    {demoPending ? "Ingresando…" : a.label}
                  </button>
                ))}
              </form>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}

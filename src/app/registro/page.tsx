"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerStudentAction, type ActionState } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand-logo";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerStudentAction, initial);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
      <div className="mb-6 flex justify-center">
        <BrandLogo size={64} showText />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registro de estudiante</CardTitle>
          <p className="text-sm text-white/60">
            Necesitas el código que te entregó tu colegio (demo:{" "}
            <strong className="text-neon-cyan">HC-DEMO</strong> o{" "}
            <strong className="text-neon-pink">TP-DEMO</strong>).
          </p>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input id="fullName" name="fullName" required />
            </div>
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
                placeholder="tu.correo@colegio.cl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Código de colegio</Label>
                <Input
                  id="inviteCode"
                  name="inviteCode"
                  placeholder="HC-DEMO"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Curso</Label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  required
                  className="select-field"
                  defaultValue="1"
                >
                  <option value="1">1° medio</option>
                  <option value="2">2° medio</option>
                  <option value="3">3° medio</option>
                  <option value="4">4° medio</option>
                </select>
              </div>
            </div>
            {state.error ? (
              <AlertBanner tone="warn">{state.error}</AlertBanner>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creando cuenta…" : "Crear cuenta y continuar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-white/50">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-neon-cyan hover:underline">
              Ingresar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

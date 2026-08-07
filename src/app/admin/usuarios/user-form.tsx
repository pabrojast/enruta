"use client";

import { useActionState } from "react";
import { createUserAction } from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export function UserForm({
  schools,
}: {
  schools: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createUserAction, initial);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crear usuario (staff / partner)</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña temporal</Label>
            <Input id="password" name="password" type="password" minLength={8} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              name="role"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue="counselor"
            >
              <option value="counselor">Orientador/a</option>
              <option value="psychologist">Psicólogo/a</option>
              <option value="head_teacher">Profesor/a jefe</option>
              <option value="school_admin">Admin establecimiento</option>
              <option value="partner">Partner</option>
              <option value="guardian">Apoderado/a</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="schoolId">Establecimiento</Label>
            <select
              id="schoolId"
              name="schoolId"
              className="flex h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              defaultValue=""
            >
              <option value="">— (opcional para partner) —</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {state.error ? (
            <div className="md:col-span-2">
              <AlertBanner tone="warn">{state.error}</AlertBanner>
            </div>
          ) : null}
          {state.ok ? (
            <div className="md:col-span-2">
              <AlertBanner tone="success">Usuario creado.</AlertBanner>
            </div>
          ) : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Creando…" : "Crear usuario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

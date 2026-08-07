"use client";

import { useActionState } from "react";
import { saveProfileAction } from "@/app/actions/student";
import type { ActionState } from "@/app/actions/auth";
import type { Student } from "@/db/schema";
import { AlertBanner } from "@/components/alert-banner";
import {
  FormActions,
  FormField,
  FormSection,
  LongFormShell,
} from "@/components/long-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

export function ProfileForm({
  student,
  fullName,
}: {
  student: Student;
  fullName: string;
}) {
  const [state, action, pending] = useActionState(saveProfileAction, initial);

  return (
    <LongFormShell
      stepLabel="Autoconocimiento"
      title="Tu perfil"
      description={`${fullName} · ${student.gradeLevel}° medio. Escribe con calma: puedes volver y actualizar cuando cambien tus intereses.`}
    >
      <form action={action} className="space-y-4">
        <FormSection
          title="Datos básicos"
          description="Solo lo necesario para contextualizar tu ruta."
        >
          <FormField
            label="Año de nacimiento"
            htmlFor="birthYear"
            optional
            hint="Nos ayuda a adaptar el lenguaje y las actividades."
          >
            <Input
              id="birthYear"
              name="birthYear"
              type="number"
              inputMode="numeric"
              autoComplete="bday-year"
              defaultValue={student.birthYear ?? ""}
              placeholder="2010"
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Quién soy"
          description="Tu punto de partida: historia, intereses y fortalezas."
        >
          <FormField
            label="Mi historia / punto de partida"
            htmlFor="personalHistory"
            hint="Momentos, personas o experiencias que te marcan."
          >
            <Textarea
              id="personalHistory"
              name="personalHistory"
              rows={4}
              defaultValue={student.personalHistory ?? ""}
              placeholder="Por ejemplo: me gusta armar cosas, ayudar a mi familia, jugar fútbol…"
            />
          </FormField>
          <FormField
            label="¿Qué me interesa?"
            htmlFor="interestsSummary"
            hint="Actividades, temas o ambientes que te llaman la atención hoy."
          >
            <Textarea
              id="interestsSummary"
              name="interestsSummary"
              rows={3}
              defaultValue={student.interestsSummary ?? ""}
              placeholder="Naturaleza, tecnología, arte, cuidar personas…"
            />
          </FormField>
          <FormField
            label="Mis fortalezas"
            htmlFor="strengthsSummary"
            hint="Lo que ya se te da bien o te reconocen otras personas."
          >
            <Textarea
              id="strengthsSummary"
              name="strengthsSummary"
              rows={3}
              defaultValue={student.strengthsSummary ?? ""}
              placeholder="Constancia, creatividad, trabajo en equipo…"
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Expectativas y contexto"
          description="Tu entorno también forma parte del mapa, sin definirte por completo."
        >
          <FormField
            label="Expectativas personales"
            htmlFor="expectations"
            hint="¿Qué te gustaría lograr en los próximos años?"
          >
            <Textarea
              id="expectations"
              name="expectations"
              rows={3}
              defaultValue={student.expectations ?? ""}
              placeholder="Estudiar algo que me guste, trabajar cerca de casa…"
            />
          </FormField>
          <FormField
            label="Contexto familiar"
            htmlFor="familyContext"
            optional
            hint="Apoyos, expectativas o conversaciones importantes en casa."
          >
            <Textarea
              id="familyContext"
              name="familyContext"
              rows={3}
              defaultValue={student.familyContext ?? ""}
              placeholder="Mi familia prefiere…, yo siento que…"
            />
          </FormField>
          <FormField
            label="Contexto territorial"
            htmlFor="territorialContext"
            optional
            hint="Comuna, oportunidades locales, conectividad, distancia a instituciones."
          >
            <Textarea
              id="territorialContext"
              name="territorialContext"
              rows={3}
              defaultValue={student.territorialContext ?? ""}
              placeholder="Vivo en…, cerca hay…, se me complica…"
            />
          </FormField>
        </FormSection>

        {state.error ? <AlertBanner tone="warn">{state.error}</AlertBanner> : null}
        {state.ok ? (
          <AlertBanner tone="success">Perfil guardado. Puedes seguir cuando quieras.</AlertBanner>
        ) : null}

        <FormActions>
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar perfil"}
          </Button>
          <p className="text-xs text-[#6b7280]">
            Guardado manual · tus datos no se publican solos
          </p>
        </FormActions>
      </form>
    </LongFormShell>
  );
}

"use client";

import { useActionState } from "react";
import { saveLifeProjectAction } from "@/app/actions/life-project";
import type { ActionState } from "@/app/actions/auth";
import type { lifeProjects } from "@/db/schema";
import { AlertBanner } from "@/components/alert-banner";
import {
  FormActions,
  FormField,
  FormSection,
  LongFormShell,
} from "@/components/long-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Project = typeof lifeProjects.$inferSelect;

const initial: ActionState = {};

type FieldDef = {
  name: keyof Project;
  label: string;
  hint?: string;
  section: "direction" | "resources" | "plan";
  rows?: number;
};

const fields: FieldDef[] = [
  {
    name: "mainGoal",
    label: "Meta principal",
    hint: "Una dirección clara para ahora, no una sentencia definitiva.",
    section: "direction",
    rows: 3,
  },
  {
    name: "alternatives",
    label: "Alternativas",
    hint: "Otras rutas que también podrían tener sentido.",
    section: "direction",
  },
  {
    name: "motivations",
    label: "Motivaciones",
    hint: "¿Por qué te importa esta meta?",
    section: "direction",
  },
  {
    name: "strengths",
    label: "Fortalezas",
    section: "resources",
  },
  {
    name: "resources",
    label: "Recursos disponibles",
    hint: "Tiempo, becas, transporte, redes, herramientas…",
    section: "resources",
  },
  {
    name: "supportPeople",
    label: "Personas de apoyo",
    section: "resources",
  },
  {
    name: "obstacles",
    label: "Obstáculos",
    hint: "Nombrarlos ayuda a pedir apoyo a tiempo.",
    section: "plan",
  },
  {
    name: "planB",
    label: "Plan B",
    hint: "Una opción válida si el camino principal se complica.",
    section: "plan",
  },
  {
    name: "reflection",
    label: "Reflexión personal",
    hint: "¿Qué aprendiste de este proceso hasta ahora?",
    section: "plan",
    rows: 4,
  },
];

const sections = [
  {
    id: "direction" as const,
    title: "Dirección",
    description: "Hacia dónde miras y por qué.",
  },
  {
    id: "resources" as const,
    title: "Con qué cuentas",
    description: "Fortalezas, apoyos y recursos reales.",
  },
  {
    id: "plan" as const,
    title: "Plan y contención",
    description: "Obstáculos, plan B y cierre reflexivo.",
  },
];

export function LifeProjectForm({ project }: { project: Project | null }) {
  const [state, action, pending] = useActionState(saveLifeProjectAction, initial);

  return (
    <LongFormShell
      stepLabel="Proyecto de vida"
      title="Construye tu plan con calma"
      description="No tienes que decidirlo todo hoy. Este documento puede cambiar contigo."
    >
      <form action={action} className="space-y-4">
        {sections.map((section) => (
          <FormSection
            key={section.id}
            title={section.title}
            description={section.description}
          >
            {fields
              .filter((f) => f.section === section.id)
              .map((f) => (
                <FormField
                  key={f.name}
                  label={f.label}
                  htmlFor={f.name}
                  hint={f.hint}
                >
                  <Textarea
                    id={f.name}
                    name={f.name}
                    rows={f.rows ?? 3}
                    defaultValue={
                      project
                        ? String(
                            (project as unknown as Record<string, unknown>)[
                              f.name
                            ] ?? "",
                          )
                        : ""
                    }
                    placeholder="Escribe aquí…"
                  />
                </FormField>
              ))}
          </FormSection>
        ))}

        {state.error ? <AlertBanner tone="warn">{state.error}</AlertBanner> : null}
        {state.ok ? (
          <AlertBanner tone="success">
            Proyecto de vida guardado. Puedes descargar el PDF cuando quieras.
          </AlertBanner>
        ) : null}

        <FormActions>
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar proyecto de vida"}
          </Button>
          <p className="text-xs text-[#6b7280]">
            Revisa, ajusta y vuelve cuando cambie tu norte
          </p>
        </FormActions>
      </form>
    </LongFormShell>
  );
}

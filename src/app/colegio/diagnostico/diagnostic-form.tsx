"use client";

import { useActionState } from "react";
import { saveInstitutionalDiagnosticAction } from "@/app/actions/extended";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import {
  FormActions,
  FormField,
  FormSection,
  LongFormShell,
} from "@/components/long-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

export function DiagnosticForm({ schoolId }: { schoolId: string | null }) {
  const [state, action, pending] = useActionState(
    saveInstitutionalDiagnosticAction,
    initial,
  );

  return (
    <LongFormShell
      stepLabel="Diagnóstico institucional"
      title="Configura el punto de partida del colegio"
      description="Información de PEI/PME, territorio y capacidades. El sistema genera una propuesta orientativa de implementación."
    >
      <form action={action} className="space-y-4">
        {schoolId ? (
          <input type="hidden" name="schoolId" value={schoolId} />
        ) : null}

        <FormSection
          title="Identificación del establecimiento"
          description="Modalidad, tamaño y condiciones de conectividad."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Modalidad" htmlFor="modality">
              <Select id="modality" name="modality" defaultValue="HC">
                <option value="HC">Humanista-Científico (HC)</option>
                <option value="TP">Técnico-Profesional (TP)</option>
                <option value="mixed">Mixta</option>
              </Select>
            </FormField>
            <FormField label="Conectividad" htmlFor="connectivity">
              <Select id="connectivity" name="connectivity" defaultValue="media">
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </Select>
            </FormField>
            <FormField
              label="N° estudiantes"
              htmlFor="studentCount"
              hint="Estimación total o del programa."
            >
              <Input
                id="studentCount"
                name="studentCount"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="320"
              />
            </FormField>
            <FormField label="Cursos" htmlFor="coursesSummary">
              <Input
                id="coursesSummary"
                name="coursesSummary"
                placeholder="1°A–4°B, etc."
              />
            </FormField>
            <FormField
              label="Especialidades TP"
              htmlFor="specialties"
              optional
              className="sm:col-span-2"
            >
              <Input
                id="specialties"
                name="specialties"
                placeholder="Agropecuaria, Electricidad…"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Territorio y necesidades"
          description="Lo que el equipo ya detecta y el contexto local."
        >
          <FormField
            label="Contexto territorial"
            htmlFor="territorialContext"
            hint="Urbano/rural, distancias, empleo local, transporte."
          >
            <Textarea
              id="territorialContext"
              name="territorialContext"
              rows={3}
              placeholder="Comuna, oportunidades y restricciones del entorno…"
            />
          </FormField>
          <FormField label="Necesidades detectadas" htmlFor="needs">
            <Textarea
              id="needs"
              name="needs"
              rows={3}
              placeholder="Baja participación familiar, poca información de oficios…"
            />
          </FormField>
          <FormField label="Equipo disponible" htmlFor="teamAvailable">
            <Textarea
              id="teamAvailable"
              name="teamAvailable"
              rows={2}
              placeholder="Orientador/a, UTP, psicólogo/a, horas semanales…"
            />
          </FormField>
        </FormSection>

        <FormSection
          title="PEI, PME y expectativas"
          description="Alinea ENRUTA con el proyecto del establecimiento."
        >
          <FormField label="PEI (resumen)" htmlFor="pei">
            <Textarea id="pei" name="pei" rows={3} />
          </FormField>
          <FormField label="PME (resumen)" htmlFor="pme">
            <Textarea id="pme" name="pme" rows={3} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Expectativas" htmlFor="expectations">
              <Textarea id="expectations" name="expectations" rows={3} />
            </FormField>
            <FormField label="Objetivos" htmlFor="objectives">
              <Textarea id="objectives" name="objectives" rows={3} />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Actividades, alianzas y oferta local"
          description="Lo que ya existe y se puede potenciar."
        >
          <FormField label="Actividades existentes" htmlFor="existingActivities">
            <Textarea id="existingActivities" name="existingActivities" rows={2} />
          </FormField>
          <FormField label="Alianzas" htmlFor="alliances">
            <Textarea id="alliances" name="alliances" rows={2} />
          </FormField>
          <FormField
            label="Oferta local de educación y empleo"
            htmlFor="localOffer"
          >
            <Textarea id="localOffer" name="localOffer" rows={2} />
          </FormField>
        </FormSection>

        {state.error ? (
          <AlertBanner tone="warn">{state.error}</AlertBanner>
        ) : null}
        {state.ok ? (
          <AlertBanner tone="success">
            Diagnóstico generado. Puedes descargar el PDF desde el listado.
          </AlertBanner>
        ) : null}

        <FormActions>
          <Button type="submit" disabled={pending}>
            {pending ? "Generando…" : "Generar informe diagnóstico"}
          </Button>
          <p className="text-xs text-[#6b7280]">
            El informe es orientativo y debe validarse con el equipo directivo
          </p>
        </FormActions>
      </form>
    </LongFormShell>
  );
}

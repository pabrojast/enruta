"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createCatalogItemAction,
  updateCatalogItemAction,
} from "@/app/actions/catalog-admin";
import type { ActionState } from "@/app/actions/auth";
import type { CatalogChileMetrics, CatalogItem } from "@/db/schema";
import { EDUCATION_AREAS, LABOR_SECTORS } from "@/data/public-stats";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: ActionState = {};

const uniqueSectors = [
  ...new Map(
    LABOR_SECTORS.map((s) => [s.sectorCode, s.sectorName] as const),
  ).entries(),
];

export function CatalogForm({ item }: { item?: CatalogItem }) {
  const router = useRouter();
  const action = item ? updateCatalogItemAction : createCatalogItemAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const m = (item?.chileMetrics as CatalogChileMetrics | null) ?? null;
  const dims = (item?.dimensions as Record<string, number>) ?? {};

  useEffect(() => {
    if (state.ok && !item) router.push("/admin/catalogo");
    if (state.ok && item) router.refresh();
  }, [state.ok, item, router]);

  return (
    <form action={formAction} className="space-y-6">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo" htmlFor="type">
          <select
            id="type"
            name="type"
            required
            defaultValue={item?.type ?? "career"}
            className="select-field"
          >
            <option value="career">Carrera</option>
            <option value="trade">Oficio / técnico</option>
            <option value="route">Ruta</option>
          </select>
        </Field>
        <Field label="Título" htmlFor="title">
          <Input
            id="title"
            name="title"
            required
            defaultValue={item?.title ?? ""}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Descripción" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              required
              rows={3}
              defaultValue={item?.description ?? ""}
            />
          </Field>
        </div>
        <Field label="Actividades" htmlFor="activities">
          <Textarea
            id="activities"
            name="activities"
            rows={2}
            defaultValue={item?.activities ?? ""}
          />
        </Field>
        <Field label="Rutas de acceso" htmlFor="accessRoutes">
          <Textarea
            id="accessRoutes"
            name="accessRoutes"
            rows={2}
            defaultValue={item?.accessRoutes ?? ""}
          />
        </Field>
        <Field label="Duración" htmlFor="duration">
          <Input
            id="duration"
            name="duration"
            defaultValue={item?.duration ?? ""}
          />
        </Field>
        <Field label="Modalidad" htmlFor="modality">
          <Input
            id="modality"
            name="modality"
            defaultValue={item?.modality ?? ""}
            placeholder="presencial / online"
          />
        </Field>
        <Field label="Requisitos" htmlFor="requirements">
          <Input
            id="requirements"
            name="requirements"
            defaultValue={item?.requirements ?? ""}
          />
        </Field>
        <Field label="Alcance regional" htmlFor="regionScope">
          <Input
            id="regionScope"
            name="regionScope"
            defaultValue={item?.regionScope ?? "nacional"}
          />
        </Field>
        <Field label="Sector laboral (código)" htmlFor="laborSectorCode">
          <select
            id="laborSectorCode"
            name="laborSectorCode"
            defaultValue={item?.laborSectorCode ?? ""}
            className="select-field"
          >
            <option value="">—</option>
            {uniqueSectors.map(([code, name]) => (
              <option key={code} value={code}>
                {code} · {name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Área formativa" htmlFor="educationAreaCode">
          <select
            id="educationAreaCode"
            name="educationAreaCode"
            defaultValue={item?.educationAreaCode ?? ""}
            className="select-field"
          >
            <option value="">—</option>
            {EDUCATION_AREAS.map((a) => (
              <option key={a.areaCode} value={a.areaCode}>
                {a.areaName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Skills (coma)" htmlFor="skills">
          <Input
            id="skills"
            name="skills"
            defaultValue={((item?.skills as string[]) ?? []).join(", ")}
          />
        </Field>
        <Field label="Áreas laborales (coma)" htmlFor="workAreas">
          <Input
            id="workAreas"
            name="workAreas"
            defaultValue={((item?.workAreas as string[]) ?? []).join(", ")}
          />
        </Field>
        <Field label="Tracks HC,TP,mixto (coma)" htmlFor="trackTags">
          <Input
            id="trackTags"
            name="trackTags"
            defaultValue={((item?.trackTags as string[]) ?? []).join(", ")}
            placeholder="HC, TP"
          />
        </Field>
        <Field label="Grados objetivo (coma)" htmlFor="targetGrades">
          <Input
            id="targetGrades"
            name="targetGrades"
            defaultValue={((item?.targetGrades as number[]) ?? [1, 2, 3, 4]).join(
              ",",
            )}
            placeholder="2,3,4"
          />
        </Field>
        <Field label="Activo" htmlFor="isActive">
          <select
            id="isActive"
            name="isActive"
            defaultValue={item?.isActive === false ? "false" : "true"}
            className="select-field"
          >
            <option value="true">Sí</option>
            <option value="false">No (oculto en explorador)</option>
          </select>
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white">
          Dimensiones RIASEC (0–100)
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {(["R", "I", "A", "S", "E", "C"] as const).map((d) => (
            <Field key={d} label={d} htmlFor={`dim${d}`}>
              <Input
                id={`dim${d}`}
                name={`dim${d}`}
                type="number"
                min={0}
                max={100}
                defaultValue={dims[d] ?? 40}
              />
            </Field>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-neon-cyan/20 bg-neon-cyan/5 p-4">
        <h2 className="text-sm font-semibold text-white">
          Métricas Chile (opcional, con fuente)
        </h2>
        <p className="text-xs text-white/50">
          Si no hay serie comparable, deja vacío el % y documenta la nota +
          fuente sectorial.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Empleabilidad %" htmlFor="employabilityPct">
            <Input
              id="employabilityPct"
              name="employabilityPct"
              type="number"
              step="0.1"
              min={0}
              max={100}
              defaultValue={m?.employabilityPct ?? ""}
            />
          </Field>
          <Field label="Horizonte empleabilidad" htmlFor="employabilityHorizon">
            <Input
              id="employabilityHorizon"
              name="employabilityHorizon"
              defaultValue={m?.employabilityHorizon ?? ""}
              placeholder="al 4.º año de egreso"
            />
          </Field>
          <Field label="Ingreso promedio CLP" htmlFor="incomeAvgClp">
            <Input
              id="incomeAvgClp"
              name="incomeAvgClp"
              type="number"
              min={0}
              defaultValue={m?.incomeAvgClp ?? ""}
            />
          </Field>
          <Field label="Horizonte ingreso" htmlFor="incomeHorizon">
            <Input
              id="incomeHorizon"
              name="incomeHorizon"
              defaultValue={m?.incomeHorizon ?? ""}
              placeholder="al 3.er año (ref.)"
            />
          </Field>
          <Field label="Código fuente" htmlFor="metricsSourceCode">
            <Input
              id="metricsSourceCode"
              name="metricsSourceCode"
              defaultValue={m?.sourceCode ?? "SIES_MIFUTURO"}
            />
          </Field>
          <Field label="Nombre fuente" htmlFor="metricsSourceName">
            <Input
              id="metricsSourceName"
              name="metricsSourceName"
              defaultValue={m?.sourceName ?? "Mi Futuro / SIES (MINEDUC)"}
            />
          </Field>
          <Field label="URL fuente" htmlFor="metricsSourceUrl">
            <Input
              id="metricsSourceUrl"
              name="metricsSourceUrl"
              defaultValue={
                m?.sourceUrl ??
                "https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/"
              }
            />
          </Field>
          <Field label="Año referencia" htmlFor="metricsReferenceYear">
            <Input
              id="metricsReferenceYear"
              name="metricsReferenceYear"
              type="number"
              defaultValue={m?.referenceYear ?? 2025}
            />
          </Field>
          <Field label="Programa en fuente" htmlFor="metricsProgramLabel">
            <Input
              id="metricsProgramLabel"
              name="metricsProgramLabel"
              defaultValue={m?.sourceProgramLabel ?? ""}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Nota / limitaciones" htmlFor="metricsNote">
              <Textarea
                id="metricsNote"
                name="metricsNote"
                rows={2}
                defaultValue={m?.note ?? ""}
              />
            </Field>
          </div>
          <Field label="Cita secundaria" htmlFor="metricsSecondaryCitation">
            <Input
              id="metricsSecondaryCitation"
              name="metricsSecondaryCitation"
              defaultValue={m?.secondaryCitation ?? ""}
            />
          </Field>
          <Field label="URL secundaria" htmlFor="metricsSecondaryUrl">
            <Input
              id="metricsSecondaryUrl"
              name="metricsSecondaryUrl"
              defaultValue={m?.secondaryUrl ?? ""}
            />
          </Field>
        </div>
      </section>

      {state.error ? <AlertBanner tone="warn">{state.error}</AlertBanner> : null}
      {state.ok ? (
        <AlertBanner tone="success">
          {item ? "Cambios guardados." : "Ítem creado."}
        </AlertBanner>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : item ? "Guardar cambios" : "Crear ítem"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

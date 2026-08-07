"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { catalogItems, type CatalogChileMetrics } from "@/db/schema";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ActionState } from "./auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "enruta_admin") return null;
  return session;
}

const baseSchema = z.object({
  type: z.enum(["career", "trade", "route"]),
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  activities: z.string().optional(),
  duration: z.string().optional(),
  modality: z.string().optional(),
  requirements: z.string().optional(),
  accessRoutes: z.string().optional(),
  laborSectorCode: z.string().optional(),
  educationAreaCode: z.string().optional(),
  regionScope: z.string().optional(),
  skills: z.string().optional(), // comma-separated
  workAreas: z.string().optional(),
  trackTags: z.string().optional(), // comma: HC,TP,mixto
  targetGrades: z.string().optional(), // e.g. "1,2,3,4"
  isActive: z.enum(["true", "false"]).optional(),
  // RIASEC 0-100
  dimR: z.coerce.number().min(0).max(100).optional(),
  dimI: z.coerce.number().min(0).max(100).optional(),
  dimA: z.coerce.number().min(0).max(100).optional(),
  dimS: z.coerce.number().min(0).max(100).optional(),
  dimE: z.coerce.number().min(0).max(100).optional(),
  dimC: z.coerce.number().min(0).max(100).optional(),
  // Chile metrics
  employabilityPct: z.coerce.number().min(0).max(100).optional().nullable(),
  employabilityHorizon: z.string().optional(),
  incomeAvgClp: z.coerce.number().min(0).optional().nullable(),
  incomeHorizon: z.string().optional(),
  metricsSourceCode: z.string().optional(),
  metricsSourceName: z.string().optional(),
  metricsSourceUrl: z.string().optional(),
  metricsReferenceYear: z.coerce.number().optional(),
  metricsProgramLabel: z.string().optional(),
  metricsNote: z.string().optional(),
  metricsSecondaryCitation: z.string().optional(),
  metricsSecondaryUrl: z.string().optional(),
});

function splitList(s?: string) {
  if (!s?.trim()) return [] as string[];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseGrades(s?: string): number[] {
  if (!s?.trim()) return [1, 2, 3, 4];
  return s
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((n) => n >= 1 && n <= 4);
}

function buildMetrics(
  data: z.infer<typeof baseSchema>,
): CatalogChileMetrics | null {
  const hasAny =
    data.employabilityPct != null ||
    data.incomeAvgClp != null ||
    (data.metricsNote && data.metricsNote.trim()) ||
    (data.metricsSourceCode && data.metricsSourceCode.trim());
  if (!hasAny) return null;

  return {
    employabilityPct: data.employabilityPct ?? null,
    employabilityHorizon: data.employabilityHorizon || null,
    incomeAvgClp: data.incomeAvgClp ?? null,
    incomeHorizon: data.incomeHorizon || null,
    sourceCode: data.metricsSourceCode?.trim() || "ENRUTA_SYNTH",
    sourceName: data.metricsSourceName?.trim() || "ENRUTA · referencia",
    sourceUrl:
      data.metricsSourceUrl?.trim() ||
      "https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/",
    referenceYear: data.metricsReferenceYear || new Date().getFullYear(),
    sourceProgramLabel: data.metricsProgramLabel || null,
    note:
      data.metricsNote?.trim() ||
      "Cifra de referencia. Contrastar en fuentes oficiales actualizadas.",
    secondaryCitation: data.metricsSecondaryCitation || null,
    secondaryUrl: data.metricsSecondaryUrl || null,
  };
}

function parseForm(formData: FormData) {
  return baseSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    activities: formData.get("activities") || "",
    duration: formData.get("duration") || "",
    modality: formData.get("modality") || "",
    requirements: formData.get("requirements") || "",
    accessRoutes: formData.get("accessRoutes") || "",
    laborSectorCode: formData.get("laborSectorCode") || "",
    educationAreaCode: formData.get("educationAreaCode") || "",
    regionScope: formData.get("regionScope") || "nacional",
    skills: formData.get("skills") || "",
    workAreas: formData.get("workAreas") || "",
    trackTags: formData.get("trackTags") || "",
    targetGrades: formData.get("targetGrades") || "1,2,3,4",
    isActive: formData.get("isActive") === "false" ? "false" : "true",
    dimR: formData.get("dimR") || 40,
    dimI: formData.get("dimI") || 40,
    dimA: formData.get("dimA") || 40,
    dimS: formData.get("dimS") || 40,
    dimE: formData.get("dimE") || 40,
    dimC: formData.get("dimC") || 40,
    employabilityPct: formData.get("employabilityPct") || undefined,
    employabilityHorizon: formData.get("employabilityHorizon") || "",
    incomeAvgClp: formData.get("incomeAvgClp") || undefined,
    incomeHorizon: formData.get("incomeHorizon") || "",
    metricsSourceCode: formData.get("metricsSourceCode") || "",
    metricsSourceName: formData.get("metricsSourceName") || "",
    metricsSourceUrl: formData.get("metricsSourceUrl") || "",
    metricsReferenceYear: formData.get("metricsReferenceYear") || undefined,
    metricsProgramLabel: formData.get("metricsProgramLabel") || "",
    metricsNote: formData.get("metricsNote") || "",
    metricsSecondaryCitation: formData.get("metricsSecondaryCitation") || "",
    metricsSecondaryUrl: formData.get("metricsSecondaryUrl") || "",
  });
}

export async function createCatalogItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: "Revisa los campos obligatorios" };

  const data = parsed.data;
  let slug = slugify(data.title);
  const [existing] = await db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.slug, slug))
    .limit(1);
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await db.insert(catalogItems).values({
    type: data.type,
    title: data.title,
    slug,
    description: data.description,
    activities: data.activities || null,
    duration: data.duration || null,
    modality: data.modality || null,
    requirements: data.requirements || "Revisar requisitos vigentes de cada institución.",
    accessRoutes: data.accessRoutes || null,
    laborSectorCode: data.laborSectorCode || null,
    educationAreaCode: data.educationAreaCode || null,
    regionScope: data.regionScope || "nacional",
    skills: splitList(data.skills),
    interestTags: splitList(data.skills),
    workAreas: splitList(data.workAreas),
    trackTags: splitList(data.trackTags),
    targetGrades: parseGrades(data.targetGrades),
    dimensions: {
      R: data.dimR ?? 40,
      I: data.dimI ?? 40,
      A: data.dimA ?? 40,
      S: data.dimS ?? 40,
      E: data.dimE ?? 40,
      C: data.dimC ?? 40,
    },
    chileMetrics: buildMetrics(data),
    isActive: data.isActive !== "false",
  });

  revalidatePath("/admin/catalogo");
  revalidatePath("/app/explorar");
  return { ok: true };
}

export async function updateCatalogItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Falta id" };

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: "Revisa los campos obligatorios" };
  const data = parsed.data;

  const [row] = await db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.id, id))
    .limit(1);
  if (!row) return { error: "Ítem no encontrado" };

  await db
    .update(catalogItems)
    .set({
      type: data.type,
      title: data.title,
      description: data.description,
      activities: data.activities || null,
      duration: data.duration || null,
      modality: data.modality || null,
      requirements: data.requirements || null,
      accessRoutes: data.accessRoutes || null,
      laborSectorCode: data.laborSectorCode || null,
      educationAreaCode: data.educationAreaCode || null,
      regionScope: data.regionScope || "nacional",
      skills: splitList(data.skills),
      interestTags: splitList(data.skills),
      workAreas: splitList(data.workAreas),
      trackTags: splitList(data.trackTags),
      targetGrades: parseGrades(data.targetGrades),
      dimensions: {
        R: data.dimR ?? 40,
        I: data.dimI ?? 40,
        A: data.dimA ?? 40,
        S: data.dimS ?? 40,
        E: data.dimE ?? 40,
        C: data.dimC ?? 40,
      },
      chileMetrics: buildMetrics(data),
      isActive: data.isActive !== "false",
    })
    .where(eq(catalogItems.id, id));

  revalidatePath("/admin/catalogo");
  revalidatePath(`/admin/catalogo/${id}`);
  revalidatePath("/app/explorar");
  revalidatePath(`/app/explorar/${row.slug}`);
  return { ok: true };
}

export async function toggleCatalogItemAction(
  id: string,
  isActive: boolean,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  await db
    .update(catalogItems)
    .set({ isActive })
    .where(eq(catalogItems.id, id));
  revalidatePath("/admin/catalogo");
  revalidatePath("/app/explorar");
  return { ok: true };
}

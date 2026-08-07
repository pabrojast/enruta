import type { CatalogChileMetrics } from "@/db/schema";
import { EDUCATION_AREAS } from "@/data/public-stats";

export function formatClp(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function educationAreaLabel(code: string | null | undefined): string {
  if (!code) return "Área por definir";
  const found = EDUCATION_AREAS.find((a) => a.areaCode === code);
  return found?.areaName ?? code;
}

export function typeLabel(type: string): string {
  if (type === "career") return "Carrera";
  if (type === "trade") return "Oficio / técnico";
  if (type === "route") return "Ruta";
  return type;
}

export function hasEmployability(
  m: CatalogChileMetrics | null | undefined,
): m is CatalogChileMetrics & { employabilityPct: number } {
  return typeof m?.employabilityPct === "number";
}

export function gradeFocusCopy(gradeLevel: number): {
  eyebrow: string;
  title: string;
  body: string;
  preferTypes?: ("career" | "trade" | "route")[];
} {
  if (gradeLevel <= 1) {
    return {
      eyebrow: "1° medio · Conocerme",
      title: "Explora sin apuro",
      body: "Prioriza oficios, rutas cortas y “probar un día”. Aún no necesitas decidir carrera: mira qué actividades te dan energía.",
      preferTypes: ["trade", "route"],
    };
  }
  if (gradeLevel === 2) {
    return {
      eyebrow: "2° medio · Capacidades",
      title: "Conecta talentos con campos reales",
      body: "Mira de cerca oficios y áreas formativas. Usa empleabilidad e ingresos solo como contexto, no como veredicto.",
      preferTypes: ["trade", "career", "route"],
    };
  }
  if (gradeLevel === 3) {
    return {
      eyebrow: "3° medio · Explorar",
      title: "Compara 3 alternativas con datos",
      body: "Guarda opciones diversas (universidad, TP, oficio). Revisa Mi Futuro para el programa exacto y conversa con orientación.",
      preferTypes: ["career", "trade", "route"],
    };
  }
  return {
    eyebrow: "4° medio · Proyecto de vida",
    title: "Cruza vocación, datos y plan de acción",
    body: "Afinidad + empleabilidad/ingresos de referencia + requisitos de admisión. Define un plan A y un plan B con pasos a 30 días.",
    preferTypes: ["career", "trade", "route"],
  };
}

/** Soft boost for grade-appropriate items in ranking (not a hard filter). */
export function gradeAffinityBoost(
  targetGrades: number[] | null | undefined,
  gradeLevel: number,
): number {
  if (!targetGrades || targetGrades.length === 0) return 0;
  return targetGrades.includes(gradeLevel) ? 3 : 0;
}

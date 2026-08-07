import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  assessmentResults,
  catalogItems,
  educationAreaStats,
  laborMarketStats,
  publicDataSources,
  regionalInsights,
  schools,
  students,
} from "@/db/schema";
import { DIMENSION_ORDER, RIASEC, type DimensionCode } from "@/lib/dimensions";

export async function getPublicSources() {
  return db.select().from(publicDataSources);
}

export async function getLaborStats(region?: string | null) {
  const all = await db.select().from(laborMarketStats);
  if (!region) return all.filter((r) => r.region === "Nacional");
  const regional = all.filter((r) => r.region === region);
  const national = all.filter((r) => r.region === "Nacional");
  // Prefer regional when available, else national
  const codes = new Set(regional.map((r) => r.sectorCode));
  return [
    ...regional,
    ...national.filter((n) => !codes.has(n.sectorCode)),
  ];
}

export async function getEducationStats() {
  return db.select().from(educationAreaStats);
}

export async function getRegionalInsight(region?: string | null) {
  if (region) {
    const [row] = await db
      .select()
      .from(regionalInsights)
      .where(eq(regionalInsights.region, region))
      .limit(1);
    if (row) return row;
  }
  const [national] = await db
    .select()
    .from(regionalInsights)
    .where(eq(regionalInsights.region, "Nacional"))
    .limit(1);
  return national ?? null;
}

/**
 * Cruza el perfil RIASEC del estudiante con sectores laborales y áreas formativas.
 */
export function rankByRiasecTags(
  dimensions: Record<string, number>,
  items: { riasecTags: string[] | null; [k: string]: unknown }[],
) {
  const top = [...DIMENSION_ORDER]
    .sort((a, b) => (dimensions[b] ?? 0) - (dimensions[a] ?? 0))
    .slice(0, 3);

  return items
    .map((item) => {
      const tags = (item.riasecTags as string[]) || [];
      let score = 0;
      const reasons: string[] = [];
      for (const t of tags) {
        const dim = t as DimensionCode;
        const v = dimensions[dim] ?? 0;
        score += v;
        if (v >= 50 && RIASEC[dim]) {
          reasons.push(
            `Afinidad con el perfil ${RIASEC[dim].name} (${v}%), frecuente en este campo.`,
          );
        }
      }
      if (reasons.length === 0) {
        reasons.push(
          "Aparece para diversificar tu mapa; contrástalo con experiencias reales.",
        );
      }
      const overlap = tags.filter((t) => top.includes(t as DimensionCode));
      return {
        item,
        score: Math.round(score / Math.max(tags.length, 1)),
        overlap,
        reasons: reasons.slice(0, 2),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export async function analyzeStudentPublicContext(studentId: string) {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);
  if (!student) return null;

  const [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.id, student.schoolId))
    .limit(1);

  const [result] = await db
    .select()
    .from(assessmentResults)
    .where(eq(assessmentResults.studentId, studentId))
    .orderBy(desc(assessmentResults.createdAt))
    .limit(1);

  const dimensions =
    (result?.dimensions as Record<string, number>) ?? {
      R: 40,
      I: 40,
      A: 40,
      S: 40,
      E: 40,
      C: 40,
    };

  const region = school?.region || "Nacional";
  const [labor, education, insight, sources] = await Promise.all([
    getLaborStats(region),
    getEducationStats(),
    getRegionalInsight(region),
    getPublicSources(),
  ]);

  const laborRanked = rankByRiasecTags(
    dimensions,
    labor.map((l) => ({
      ...l,
      riasecTags: (l.riasecTags as string[]) || [],
    })),
  ).slice(0, 5);

  const eduRanked = rankByRiasecTags(
    dimensions,
    education.map((e) => ({
      ...e,
      riasecTags: (e.riasecTags as string[]) || [],
    })),
  ).slice(0, 5);

  const topDims = [...DIMENSION_ORDER]
    .sort((a, b) => (dimensions[b] ?? 0) - (dimensions[a] ?? 0))
    .slice(0, 3)
    .map((c) => ({
      code: c,
      name: RIASEC[c].name,
      value: dimensions[c] ?? 0,
    }));

  return {
    student,
    school,
    region,
    dimensions,
    topDims,
    hasAssessment: !!result,
    laborRanked,
    eduRanked,
    insight,
    sources,
    disclaimer:
      "Indicadores de referencia inspirados en datos públicos (INE, SIES/Mi Futuro, MINEDUC). Son orientativos y no reemplazan las series oficiales actualizadas ni la mediación profesional.",
  };
}

export async function analyzeSchoolPublicContext(schoolId: string) {
  const [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.id, schoolId))
    .limit(1);
  if (!school) return null;

  const studentRows = await db
    .select()
    .from(students)
    .where(eq(students.schoolId, schoolId));

  const ids = studentRows.map((s) => s.id);
  const results =
    ids.length === 0
      ? []
      : await db
          .select()
          .from(assessmentResults)
          .where(inArray(assessmentResults.studentId, ids));

  // latest result per student
  const latest = new Map<string, (typeof results)[0]>();
  for (const r of results) {
    const prev = latest.get(r.studentId);
    if (!prev || prev.createdAt < r.createdAt) latest.set(r.studentId, r);
  }

  const totals: Record<string, number> = Object.fromEntries(
    DIMENSION_ORDER.map((d) => [d, 0]),
  );
  let n = 0;
  for (const r of latest.values()) {
    const dims = r.dimensions as Record<string, number>;
    n += 1;
    for (const d of DIMENSION_ORDER) totals[d] += dims[d] ?? 0;
  }
  const cohortAvg =
    n === 0
      ? Object.fromEntries(DIMENSION_ORDER.map((d) => [d, 0]))
      : Object.fromEntries(
          DIMENSION_ORDER.map((d) => [d, Math.round(totals[d] / n)]),
        );

  const labor = await getLaborStats(school.region);
  const laborRanked = rankByRiasecTags(
    cohortAvg as Record<string, number>,
    labor.map((l) => ({
      ...l,
      riasecTags: (l.riasecTags as string[]) || [],
    })),
  );

  const insight = await getRegionalInsight(school.region);
  const education = await getEducationStats();
  const sources = await getPublicSources();

  // alignment: how well top cohort dims match high-outlook sectors
  const topSectors = laborRanked.slice(0, 4);

  return {
    school,
    studentCount: studentRows.length,
    assessedCount: n,
    cohortAvg,
    topSectors,
    insight,
    education: education.slice(0, 8),
    sources,
    disclaimer:
      "Análisis agregado sin datos psicológicos individuales. Fuentes públicas de referencia (INE, SIES, MINEDUC).",
  };
}

export async function getCatalogLaborContext(slug: string) {
  const [item] = await db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.slug, slug))
    .limit(1);
  if (!item) return null;

  let labor = null;
  let education = null;
  if (item.laborSectorCode) {
    const rows = await db
      .select()
      .from(laborMarketStats)
      .where(eq(laborMarketStats.sectorCode, item.laborSectorCode));
    labor = rows.find((r) => r.region === "Nacional") || rows[0] || null;
  }
  if (item.educationAreaCode) {
    const [row] = await db
      .select()
      .from(educationAreaStats)
      .where(eq(educationAreaStats.areaCode, item.educationAreaCode))
      .limit(1);
    education = row || null;
  }

  return { item, labor, education };
}


import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  assessmentResults,
  catalogItems,
  savedAlternatives,
  type CatalogChileMetrics,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { affinityScore } from "@/lib/scoring";
import {
  educationAreaLabel,
  gradeAffinityBoost,
  gradeFocusCopy,
  typeLabel,
} from "@/lib/catalog-format";
import { EDUCATION_AREAS } from "@/data/public-stats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChileMetricsCard } from "@/components/chile-metrics-card";
import { SaveAlternativeButton } from "./save-button";
import { cn } from "@/lib/utils";

type Search = {
  tipo?: string;
  area?: string;
  track?: string;
  grado?: string;
  sort?: string;
};

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");
  const sp = await searchParams;
  const grade = row.student.gradeLevel;
  const focus = gradeFocusCopy(grade);

  const items = await db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.isActive, true));

  const [result] = await db
    .select()
    .from(assessmentResults)
    .where(eq(assessmentResults.studentId, row.student.id))
    .orderBy(desc(assessmentResults.createdAt))
    .limit(1);

  const studentDims =
    (result?.dimensions as Record<string, number>) ?? {
      R: 40,
      I: 40,
      A: 40,
      S: 40,
      E: 40,
      C: 40,
    };

  const saved = await db
    .select()
    .from(savedAlternatives)
    .where(eq(savedAlternatives.studentId, row.student.id));
  const savedIds = new Set(saved.map((s) => s.catalogItemId));

  let filtered = items;

  if (sp.tipo === "career" || sp.tipo === "trade" || sp.tipo === "route") {
    filtered = filtered.filter((i) => i.type === sp.tipo);
  }
  if (sp.area) {
    filtered = filtered.filter((i) => i.educationAreaCode === sp.area);
  }
  if (sp.track === "HC" || sp.track === "TP" || sp.track === "mixto") {
    filtered = filtered.filter((i) => {
      const tags = (i.trackTags as string[]) ?? [];
      return tags.includes(sp.track!);
    });
  }
  if (sp.grado === "mio") {
    filtered = filtered.filter((i) => {
      const grades = (i.targetGrades as number[]) ?? [];
      return grades.length === 0 || grades.includes(grade);
    });
  }

  const ranked = filtered
    .map((item) => {
      const aff = affinityScore(
        studentDims,
        (item.dimensions as Record<string, number>) ?? {},
      );
      const boost = gradeAffinityBoost(
        item.targetGrades as number[] | null,
        grade,
      );
      return {
        item,
        ...aff,
        sortScore: aff.score + boost,
      };
    })
    .sort((a, b) => {
      if (sp.sort === "empleabilidad") {
        const ea =
          (a.item.chileMetrics as CatalogChileMetrics | null)
            ?.employabilityPct ?? -1;
        const eb =
          (b.item.chileMetrics as CatalogChileMetrics | null)
            ?.employabilityPct ?? -1;
        return eb - ea;
      }
      if (sp.sort === "ingreso") {
        const ia =
          (a.item.chileMetrics as CatalogChileMetrics | null)?.incomeAvgClp ??
          -1;
        const ib =
          (b.item.chileMetrics as CatalogChileMetrics | null)?.incomeAvgClp ??
          -1;
        return ib - ia;
      }
      return b.sortScore - a.sortScore;
    });

  function hrefWith(patch: Partial<Search>) {
    const next: Search = {
      tipo: sp.tipo,
      area: sp.area,
      track: sp.track,
      grado: sp.grado,
      sort: sp.sort,
      ...patch,
    };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v) q.set(k, v);
    }
    const s = q.toString();
    return s ? `/app/explorar?${s}` : "/app/explorar";
  }

  const areasInCatalog = [
    ...new Set(
      items
        .map((i) => i.educationAreaCode)
        .filter((c): c is string => Boolean(c)),
    ),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Explorar posibilidades</h1>
        <p className="text-white/60">
          No hay una sola “carrera ideal”. Aquí ves alternativas con afinidad
          explicable y datos públicos de Chile (Mi Futuro / INE) como contexto.
        </p>
      </div>

      <Card className="border-neon-pink/20 bg-gradient-to-br from-neon-pink/10 to-transparent">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neon-pink">
            {focus.eyebrow}
          </p>
          <p className="mt-1 font-semibold text-white">{focus.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            {focus.body}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={hrefWith({ grado: sp.grado === "mio" ? undefined : "mio" })}>
              <Badge
                className={cn(
                  "cursor-pointer",
                  sp.grado === "mio" && "border-neon-cyan/40 bg-neon-cyan/15",
                )}
              >
                {sp.grado === "mio"
                  ? `Mostrando foco ${grade}° medio`
                  : `Filtrar por mi grado (${grade}°)`}
              </Badge>
            </Link>
            <a
              href="https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neon-cyan hover:underline"
            >
              Abrir buscador oficial Mi Futuro ↗
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="space-y-3">
        <FilterRow label="Tipo">
          {[
            { key: undefined, label: "Todas" },
            { key: "career", label: "Carreras" },
            { key: "trade", label: "Oficios" },
            { key: "route", label: "Rutas" },
          ].map((f) => (
            <Link key={f.label} href={hrefWith({ tipo: f.key })}>
              <Badge
                className={cn(
                  "cursor-pointer hover:bg-white/20",
                  (sp.tipo ?? undefined) === f.key &&
                    "border-neon-cyan/40 bg-neon-cyan/15 text-white",
                  !sp.tipo && f.key === undefined &&
                    "border-neon-cyan/40 bg-neon-cyan/15 text-white",
                )}
              >
                {f.label}
              </Badge>
            </Link>
          ))}
        </FilterRow>

        <FilterRow label="Trayectoria">
          {[
            { key: undefined, label: "Todas" },
            { key: "HC", label: "HC" },
            { key: "TP", label: "TP" },
            { key: "mixto", label: "Mixta" },
          ].map((f) => (
            <Link key={f.label} href={hrefWith({ track: f.key })}>
              <Badge
                className={cn(
                  "cursor-pointer hover:bg-white/20",
                  (sp.track ?? undefined) === f.key &&
                    "border-neon-cyan/40 bg-neon-cyan/15",
                  !sp.track && f.key === undefined &&
                    "border-neon-cyan/40 bg-neon-cyan/15",
                )}
              >
                {f.label}
              </Badge>
            </Link>
          ))}
        </FilterRow>

        <FilterRow label="Área formativa">
          <Link href={hrefWith({ area: undefined })}>
            <Badge
              className={cn(
                "cursor-pointer hover:bg-white/20",
                !sp.area && "border-neon-cyan/40 bg-neon-cyan/15",
              )}
            >
              Todas
            </Badge>
          </Link>
          {EDUCATION_AREAS.filter((a) =>
            areasInCatalog.includes(a.areaCode),
          ).map((a) => (
            <Link key={a.areaCode} href={hrefWith({ area: a.areaCode })}>
              <Badge
                className={cn(
                  "cursor-pointer hover:bg-white/20",
                  sp.area === a.areaCode &&
                    "border-neon-cyan/40 bg-neon-cyan/15",
                )}
              >
                {a.areaName}
              </Badge>
            </Link>
          ))}
        </FilterRow>

        <FilterRow label="Orden">
          {[
            { key: undefined, label: "Afinidad" },
            { key: "empleabilidad", label: "Empleabilidad" },
            { key: "ingreso", label: "Ingreso ref." },
          ].map((f) => (
            <Link key={f.label} href={hrefWith({ sort: f.key })}>
              <Badge
                className={cn(
                  "cursor-pointer hover:bg-white/20",
                  (sp.sort ?? undefined) === f.key &&
                    "border-neon-cyan/40 bg-neon-cyan/15",
                  !sp.sort && f.key === undefined &&
                    "border-neon-cyan/40 bg-neon-cyan/15",
                )}
              >
                {f.label}
              </Badge>
            </Link>
          ))}
        </FilterRow>
      </div>

      <p className="text-xs text-white/40">
        {ranked.length} alternativa{ranked.length === 1 ? "" : "s"}
        {sp.sort === "empleabilidad" || sp.sort === "ingreso"
          ? " · los sin dato público van al final"
          : " · orden por afinidad orientativa (+ leve priorización de tu grado)"}
      </p>

      {ranked.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-white/60">
            No hay ítems con esos filtros.{" "}
            <Link href="/app/explorar" className="text-neon-cyan hover:underline">
              Limpiar filtros
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ranked.map(({ item, score, reasons }) => {
            const metrics = item.chileMetrics as CatalogChileMetrics | null;
            return (
              <Card key={item.id} className="card-interactive">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        <Badge className="capitalize">
                          {typeLabel(item.type)}
                        </Badge>
                        {item.educationAreaCode ? (
                          <Badge className="border-white/10 bg-white/5 text-white/60">
                            {educationAreaLabel(item.educationAreaCode)}
                          </Badge>
                        ) : null}
                      </div>
                      <CardTitle className="text-base">
                        <Link
                          href={`/app/explorar/${item.slug}`}
                          className="hover:text-neon-cyan"
                        >
                          {item.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-semibold tabular text-neon-cyan">
                        {score}%
                      </p>
                      <p className="text-[10px] text-white/40">
                        afinidad orientativa
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm text-white/70">
                    {item.description}
                  </p>
                  <ChileMetricsCard metrics={metrics} compact />
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/60">
                    <p className="mb-1 font-medium text-white/80">
                      ¿Por qué aparece?
                    </p>
                    <ul className="list-disc space-y-1 pl-4">
                      {reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/app/explorar/${item.slug}`}>
                      <span className="text-sm text-neon-cyan hover:underline">
                        Ver detalle y fuentes
                      </span>
                    </Link>
                    <SaveAlternativeButton
                      catalogItemId={item.id}
                      initiallySaved={savedIds.has(item.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-[11px] font-medium uppercase tracking-wide text-white/40 sm:w-auto sm:min-w-[7rem]">
        {label}
      </span>
      {children}
    </div>
  );
}

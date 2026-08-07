import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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
import { getCatalogLaborContext } from "@/lib/public-analysis";
import {
  educationAreaLabel,
  gradeFocusCopy,
  typeLabel,
} from "@/lib/catalog-format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChileMetricsCard } from "@/components/chile-metrics-card";
import { SaveAlternativeButton } from "../save-button";

export default async function CatalogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");
  const { slug } = await params;

  const [item] = await db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.slug, slug))
    .limit(1);
  if (!item) notFound();

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
  const aff = affinityScore(
    studentDims,
    (item.dimensions as Record<string, number>) ?? {},
  );

  const allSaved = await db
    .select()
    .from(savedAlternatives)
    .where(eq(savedAlternatives.studentId, row.student.id));
  const savedFlag = allSaved.some((s) => s.catalogItemId === item.id);
  const publicCtx = await getCatalogLaborContext(slug);
  const metrics = item.chileMetrics as CatalogChileMetrics | null;
  const focus = gradeFocusCopy(row.student.gradeLevel);
  const tracks = (item.trackTags as string[]) ?? [];
  const grades = (item.targetGrades as number[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/app/explorar" className="text-sm text-neon-cyan">
        ← Volver al explorador
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge>{typeLabel(item.type)}</Badge>
            {item.educationAreaCode ? (
              <Badge className="border-white/10 bg-white/5 text-white/70">
                {educationAreaLabel(item.educationAreaCode)}
              </Badge>
            ) : null}
            {tracks.map((t) => (
              <Badge key={t} className="border-neon-pink/25 text-white/80">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="mt-2 text-white/70">{item.description}</p>
          {grades.length > 0 ? (
            <p className="mt-2 text-xs text-white/45">
              Pertinente sobre todo en:{" "}
              {grades.map((g) => `${g}° medio`).join(", ")}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-3 text-center">
          <p className="text-2xl font-bold tabular text-neon-cyan">
            {aff.score}%
          </p>
          <p className="text-xs text-white/60">afinidad orientativa</p>
        </div>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-4 text-sm text-white/65">
          <p className="text-xs font-semibold uppercase tracking-wide text-neon-pink">
            Para tu etapa · {focus.eyebrow}
          </p>
          <p className="mt-1">{focus.body}</p>
        </CardContent>
      </Card>

      <ChileMetricsCard metrics={metrics} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">¿Por qué aparece?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            {aff.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actividades habituales</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            {item.activities}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rutas de acceso</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            {item.accessRoutes}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Duración y modalidad</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            {item.duration} · {item.modality}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requisitos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            {item.requirements}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Habilidades y áreas laborales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {((item.skills as string[]) ?? []).map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {((item.workAreas as string[]) ?? []).map((s) => (
              <Badge key={s} className="border-neon-pink/30">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {publicCtx?.labor || publicCtx?.education ? (
        <Card className="border-neon-cyan/25">
          <CardHeader>
            <CardTitle className="text-base">
              Contexto sectorial y formativa (agregados)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/75">
            {publicCtx.labor ? (
              <div>
                <p className="font-medium text-white">
                  Mercado laboral · {publicCtx.labor.sectorName}
                </p>
                <p>
                  Participación ocupacional de referencia:{" "}
                  <strong className="tabular">
                    {publicCtx.labor.employmentSharePct}%
                  </strong>{" "}
                  ({publicCtx.labor.region}). Relevancia juvenil{" "}
                  {publicCtx.labor.youthRelevance}/5 · perspectiva formal{" "}
                  {publicCtx.labor.formalJobOutlook}/5.
                </p>
                <p className="text-white/60">{publicCtx.labor.skillDemandNote}</p>
                <p className="text-[11px] text-white/40">
                  Fuente {publicCtx.labor.sourceCode} ·{" "}
                  {publicCtx.labor.referenceYear} ·{" "}
                  <a
                    href="https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:underline"
                  >
                    INE ENE
                  </a>
                </p>
              </div>
            ) : null}
            {publicCtx.education ? (
              <div>
                <p className="font-medium text-white">
                  Área formativa · {publicCtx.education.areaName}
                </p>
                <p>
                  Matrícula ref. {publicCtx.education.enrollmentSharePct}% ·
                  duración típica {publicCtx.education.typicalDurationYears}{" "}
                  años ·{" "}
                  {(
                    (publicCtx.education.institutionTypes as string[]) || []
                  ).join(", ")}
                </p>
                <p className="text-white/60">
                  {publicCtx.education.continuationNote}
                </p>
                <p className="text-[11px] text-white/40">
                  Fuente {publicCtx.education.sourceCode} ·{" "}
                  {publicCtx.education.referenceYear} ·{" "}
                  <a
                    href="https://www.mifuturo.cl/sies/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:underline"
                  >
                    SIES / Mi Futuro
                  </a>
                </p>
              </div>
            ) : null}
            <p className="text-xs text-amber-100/80">
              Cifras sectoriales simplificadas a partir de series públicas. No
              sustituyen la consulta oficial actualizada.
            </p>
            <Link
              href="/app/analisis"
              className="inline-block text-sm text-neon-cyan hover:underline"
            >
              Ver tu análisis completo →
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <SaveAlternativeButton
          catalogItemId={item.id}
          initiallySaved={savedFlag}
        />
        <Link href="/app/comparar">
          <Button variant="secondary">Ir al comparador</Button>
        </Link>
        <a
          href="https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">Mi Futuro oficial</Button>
        </a>
      </div>
    </div>
  );
}

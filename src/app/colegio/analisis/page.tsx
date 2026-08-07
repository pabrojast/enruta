import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { analyzeSchoolPublicContext } from "@/lib/public-analysis";
import { PageHeader } from "@/components/page-header";
import { AlertBanner } from "@/components/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DimensionChart } from "@/components/dimension-chart";
import { EmptyState } from "@/components/empty-state";

export default async function SchoolAnalysisPage() {
  const session = await requireRole([
    "school_admin",
    "head_teacher",
    "enruta_admin",
  ]);
  if (!session.user.schoolId && session.user.role !== "enruta_admin") {
    redirect("/colegio");
  }

  // admin without school: show empty prompt
  const schoolId = session.user.schoolId;
  if (!schoolId) {
    return (
      <EmptyState
        title="Selecciona un establecimiento"
        description="El análisis territorial se calcula por colegio. Ingresa con un usuario de establecimiento."
      />
    );
  }

  const analysis = await analyzeSchoolPublicContext(schoolId);
  if (!analysis) redirect("/colegio");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Análisis agregado"
        title="Intereses del colegio × datos públicos"
        description={`${analysis.school.name} · ${analysis.school.region || "Sin región"} · sin datos psicológicos individuales.`}
      />

      <AlertBanner tone="warn">{analysis.disclaimer}</AlertBanner>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estudiantes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular">
            {analysis.studentCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Con cuestionario</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular">
            {analysis.assessedCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cobertura</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular">
            {analysis.studentCount
              ? Math.round(
                  (analysis.assessedCount / analysis.studentCount) * 100,
                )
              : 0}
            %
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Perfil promedio de la cohorte (intereses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis.assessedCount === 0 ? (
            <p className="text-sm text-white/55">
              Aún no hay cuestionarios enviados para promediar.
            </p>
          ) : (
            <DimensionChart
              dimensions={analysis.cohortAvg as Record<string, number>}
            />
          )}
        </CardContent>
      </Card>

      {analysis.insight ? (
        <Card className="border-neon-pink/25">
          <CardHeader>
            <CardTitle className="text-base">
              Lectura territorial · {analysis.insight.region}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-white/75">
            <p className="font-medium text-white">{analysis.insight.headline}</p>
            <p>{analysis.insight.educationNotes}</p>
            <p className="text-white/55">{analysis.insight.cautionNote}</p>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Sectores a explorar con la cohorte
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {analysis.topSectors.slice(0, 6).map(({ item, score, reasons }) => {
            const s = item as unknown as {
              id: string;
              sectorName: string;
              employmentSharePct: number | null;
              formalJobOutlook: number | null;
              skillDemandNote: string | null;
              sourceCode: string;
              referenceYear: number;
            };
            return (
              <Card key={s.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="text-base">{s.sectorName}</CardTitle>
                  <Badge>{score}</Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/70">
                  <p>
                    Empleo ref. {s.employmentSharePct ?? "—"}% · Outlook formal{" "}
                    {s.formalJobOutlook ?? "—"}/5
                  </p>
                  <p>{s.skillDemandNote}</p>
                  <p className="text-xs text-white/45">{reasons[0]}</p>
                  <p className="text-[11px] text-white/35">
                    {s.sourceCode} · {s.referenceYear}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Áreas formativas (SIES ref.)</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="p-3 font-medium">Área</th>
                <th className="p-3 font-medium">Matrícula ref.</th>
                <th className="p-3 font-medium">Duración</th>
                <th className="p-3 font-medium">Tipos</th>
              </tr>
            </thead>
            <tbody>
              {analysis.education.map((e) => (
                <tr key={e.id} className="border-t border-white/10">
                  <td className="p-3 text-white">{e.areaName}</td>
                  <td className="p-3 tabular text-white/70">
                    {e.enrollmentSharePct ?? "—"}%
                  </td>
                  <td className="p-3 tabular text-white/70">
                    {e.typicalDurationYears ?? "—"} a
                  </td>
                  <td className="p-3 text-white/60">
                    {((e.institutionTypes as string[]) || []).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fuentes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {analysis.sources.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm"
            >
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-white/45">{s.organization}</p>
              {s.url ? (
                <a
                  href={s.url}
                  className="text-xs text-neon-cyan hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir fuente oficial
                </a>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

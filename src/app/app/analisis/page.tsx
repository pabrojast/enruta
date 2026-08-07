import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { analyzeStudentPublicContext } from "@/lib/public-analysis";
import { PageHeader } from "@/components/page-header";
import { AlertBanner } from "@/components/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DimensionChart } from "@/components/dimension-chart";

export default async function StudentAnalysisPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const analysis = await analyzeStudentPublicContext(row.student.id);
  if (!analysis) redirect("/app");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Datos públicos + tu perfil"
        title="Análisis orientativo"
        description={`Cruce de tus intereses con mercado laboral y oferta formativa. Región de referencia: ${analysis.region}.`}
        actions={
          <Link href="/app/explorar">
            <Button variant="outline" size="sm">
              Ir a explorar
            </Button>
          </Link>
        }
      />

      <AlertBanner tone="warn">{analysis.disclaimer}</AlertBanner>

      {!analysis.hasAssessment ? (
        <AlertBanner>
          Aún no hay cuestionario enviado: el análisis usa un perfil neutro.
          Completa el cuestionario para personalizarlo.{" "}
          <Link href="/app/cuestionarios" className="underline">
            Ir al cuestionario
          </Link>
        </AlertBanner>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tu perfil de intereses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {analysis.topDims.map((d) => (
              <Badge key={d.code}>
                {d.name} · {d.value}%
              </Badge>
            ))}
          </div>
          <DimensionChart dimensions={analysis.dimensions} />
        </CardContent>
      </Card>

      {analysis.insight ? (
        <Card className="border-neon-cyan/25">
          <CardHeader>
            <CardTitle className="text-base">
              Contexto territorial · {analysis.insight.region}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-white/75">
            <p className="font-medium text-white">{analysis.insight.headline}</p>
            <p>{analysis.insight.educationNotes}</p>
            <p className="text-white/55">{analysis.insight.cautionNote}</p>
            <p className="text-xs text-white/40">
              Fuente: {analysis.insight.sourceCode} ·{" "}
              {analysis.insight.referenceYear}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">
          Sectores laborales que podrías explorar
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {analysis.laborRanked.map(({ item, score, reasons }) => {
            const s = item as unknown as {
              id: string;
              sectorName: string;
              employmentSharePct: number | null;
              youthRelevance: number | null;
              formalJobOutlook: number | null;
              skillDemandNote: string | null;
              sourceCode: string;
              referenceYear: number;
              region: string;
            };
            return (
              <Card key={s.id} className="card-interactive">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{s.sectorName}</CardTitle>
                    <div className="text-right">
                      <p className="text-lg font-semibold tabular text-neon-cyan">
                        {score}
                      </p>
                      <p className="text-[10px] text-white/40">afinidad</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/70">
                  <p>
                    Participación ocupacional ref.:{" "}
                    <strong className="tabular text-white">
                      {s.employmentSharePct ?? "—"}%
                    </strong>{" "}
                    ({s.region})
                  </p>
                  <p>
                    Relevancia juvenil: {s.youthRelevance ?? "—"}/5 · Perspectiva
                    formal: {s.formalJobOutlook ?? "—"}/5
                  </p>
                  <p>{s.skillDemandNote}</p>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-white/55">
                    {reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
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
        <h2 className="text-lg font-semibold text-white">
          Áreas formativas relacionadas
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {analysis.eduRanked.map(({ item, score, reasons }) => {
            const e = item as unknown as {
              id: string;
              areaName: string;
              enrollmentSharePct: number | null;
              typicalDurationYears: number | null;
              continuationNote: string | null;
              institutionTypes: string[] | null;
              sourceCode: string;
              referenceYear: number;
            };
            return (
              <Card key={e.id}>
                <CardHeader>
                  <div className="flex justify-between gap-2">
                    <CardTitle className="text-base">{e.areaName}</CardTitle>
                    <Badge>{score} pts</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/70">
                  <p>
                    Matrícula ref.: {e.enrollmentSharePct ?? "—"}% · Duración
                    típica: {e.typicalDurationYears ?? "—"} años
                  </p>
                  <p>
                    Instituciones:{" "}
                    {((e.institutionTypes as string[]) || []).join(", ")}
                  </p>
                  <p>{e.continuationNote}</p>
                  <ul className="list-disc pl-4 text-xs text-white/55">
                    {reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-white/35">
                    {e.sourceCode} · {e.referenceYear}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fuentes consultadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-white/65">
          {analysis.sources.map((s) => (
            <div key={s.id} className="rounded-lg border border-white/10 px-3 py-2">
              <p className="font-medium text-white/90">{s.name}</p>
              <p className="text-xs text-white/50">
                {s.organization}
                {s.url ? (
                  <>
                    {" "}
                    ·{" "}
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neon-cyan hover:underline"
                    >
                      ver fuente
                    </a>
                  </>
                ) : null}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

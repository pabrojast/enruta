import { db } from "@/db";
import {
  educationAreaStats,
  laborMarketStats,
  publicDataSources,
  regionalInsights,
} from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { AlertBanner } from "@/components/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPublicDataPage() {
  const [sources, labor, education, regions] = await Promise.all([
    db.select().from(publicDataSources),
    db.select().from(laborMarketStats),
    db.select().from(educationAreaStats),
    db.select().from(regionalInsights),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inteligencia de orientación"
        title="Datos públicos de referencia"
        description="Indicadores cargados para análisis de estudiantes y establecimientos. No son dumps oficiales crudos."
      />

      <AlertBanner tone="warn">
        Los valores están simplificados a partir de series públicas (INE ENE,
        SIES/Mi Futuro, MINEDUC Datos Abiertos). Siempre se muestra fuente y año.
        Ver <code className="text-xs">data/public/README.md</code>.
      </AlertBanner>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Fuentes", sources.length],
          ["Sectores laborales", labor.length],
          ["Áreas formativas", education.length],
          ["Insights regionales", regions.length],
        ].map(([t, n]) => (
          <Card key={t as string}>
            <CardHeader>
              <CardTitle className="text-base">{t as string}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold tabular">
              {n as number}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Fuentes</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {sources.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <Badge className="mb-2 w-fit">{s.code}</Badge>
                <CardTitle className="text-base">{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-white/70">
                <p>{s.organization}</p>
                <p>{s.description}</p>
                <p className="text-xs text-white/45">{s.licenseNote}</p>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neon-cyan hover:underline"
                  >
                    {s.url}
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mercado laboral (muestra)</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/55">
              <tr>
                <th className="p-3">Sector</th>
                <th className="p-3">Región</th>
                <th className="p-3">% ocup.</th>
                <th className="p-3">Joven</th>
                <th className="p-3">Formal</th>
                <th className="p-3">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {labor.map((r) => (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="p-3 text-white">{r.sectorName}</td>
                  <td className="p-3 text-white/60">{r.region}</td>
                  <td className="p-3 tabular">{r.employmentSharePct}</td>
                  <td className="p-3 tabular">{r.youthRelevance}/5</td>
                  <td className="p-3 tabular">{r.formalJobOutlook}/5</td>
                  <td className="p-3 text-white/45">
                    {r.sourceCode} {r.referenceYear}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Educación superior / TP (muestra)</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-white/55">
              <tr>
                <th className="p-3">Área</th>
                <th className="p-3">Matrícula %</th>
                <th className="p-3">Años</th>
                <th className="p-3">Tipos</th>
                <th className="p-3">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {education.map((e) => (
                <tr key={e.id} className="border-t border-white/10">
                  <td className="p-3 text-white">{e.areaName}</td>
                  <td className="p-3 tabular">{e.enrollmentSharePct}</td>
                  <td className="p-3 tabular">{e.typicalDurationYears}</td>
                  <td className="p-3 text-white/60">
                    {((e.institutionTypes as string[]) || []).join(", ")}
                  </td>
                  <td className="p-3 text-white/45">
                    {e.sourceCode} {e.referenceYear}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

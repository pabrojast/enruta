import type { CatalogChileMetrics } from "@/db/schema";
import { formatClp, hasEmployability } from "@/lib/catalog-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function ChileMetricsCard({
  metrics,
  compact = false,
}: {
  metrics: CatalogChileMetrics | null | undefined;
  compact?: boolean;
}) {
  if (!metrics) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 text-xs">
        {hasEmployability(metrics) ? (
          <span className="rounded-full border border-neon-green/25 bg-neon-green/10 px-2.5 py-1 tabular text-neon-green">
            Empleab. {metrics.employabilityPct}%
            {metrics.employabilityHorizon
              ? ` · ${metrics.employabilityHorizon}`
              : ""}
          </span>
        ) : null}
        {typeof metrics.incomeAvgClp === "number" ? (
          <span className="rounded-full border border-neon-cyan/25 bg-neon-cyan/10 px-2.5 py-1 tabular text-neon-cyan">
            {formatClp(metrics.incomeAvgClp)}
            {metrics.incomeHorizon ? " ref." : ""}
          </span>
        ) : null}
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/45">
          {metrics.sourceName} · {metrics.referenceYear}
        </span>
      </div>
    );
  }

  return (
    <Card className="border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/8 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Datos Chile (referencia)</CardTitle>
        <p className="text-xs text-white/50">
          Cifras orientativas para conversar — no predicen tu futuro individual.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          {hasEmployability(metrics) ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-wide text-white/45">
                Empleabilidad
              </p>
              <p className="mt-1 text-2xl font-semibold tabular text-neon-green">
                {metrics.employabilityPct}%
              </p>
              {metrics.employabilityHorizon ? (
                <p className="mt-1 text-xs text-white/55">
                  {metrics.employabilityHorizon}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-wide text-white/45">
                Empleabilidad
              </p>
              <p className="mt-1 text-sm text-white/70">
                Sin serie de “carrera” comparable. Usa sector laboral y oferta
                formativa.
              </p>
            </div>
          )}
          {typeof metrics.incomeAvgClp === "number" ||
          metrics.incomeRangeClp ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-wide text-white/45">
                Ingreso de referencia
              </p>
              <p className="mt-1 text-2xl font-semibold tabular text-neon-cyan">
                {metrics.incomeRangeClp
                  ? `${formatClp(metrics.incomeRangeClp[0])} – ${formatClp(metrics.incomeRangeClp[1])}`
                  : formatClp(metrics.incomeAvgClp!)}
              </p>
              {metrics.incomeHorizon ? (
                <p className="mt-1 text-xs text-white/55">
                  {metrics.incomeHorizon}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-wide text-white/45">
                Ingreso
              </p>
              <p className="mt-1 text-sm text-white/70">
                Sin promedio MiFuturo para este ítem. Revisa el sector en
                análisis o en fuentes oficiales.
              </p>
            </div>
          )}
        </div>

        {metrics.sourceProgramLabel ? (
          <p className="text-xs text-white/55">
            Programa en fuente:{" "}
            <span className="text-white/80">{metrics.sourceProgramLabel}</span>
          </p>
        ) : null}

        <p className="leading-relaxed text-white/65">{metrics.note}</p>

        <div className="space-y-1 border-t border-white/10 pt-3 text-xs text-white/45">
          <p>
            Fuente primaria:{" "}
            <a
              href={metrics.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-neon-cyan hover:underline"
            >
              {metrics.sourceName} ({metrics.referenceYear})
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
            <span className="text-white/30"> · {metrics.sourceCode}</span>
          </p>
          {metrics.secondaryCitation ? (
            <p>
              Citado también en:{" "}
              {metrics.secondaryUrl ? (
                <a
                  href={metrics.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:underline"
                >
                  {metrics.secondaryCitation}
                </a>
              ) : (
                metrics.secondaryCitation
              )}
            </p>
          ) : null}
          <p className="text-amber-100/70">
            Verifica siempre en{" "}
            <a
              href="https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              mifuturo.cl
            </a>{" "}
            y series INE actualizadas antes de decisiones institucionales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

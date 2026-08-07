import Link from "next/link";
import { db } from "@/db";
import { catalogItems, type CatalogChileMetrics } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { educationAreaLabel, formatClp, typeLabel } from "@/lib/catalog-format";

export default async function AdminCatalogPage() {
  const rows = await db.select().from(catalogItems);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Catálogo de carreras y oficios</h1>
          <p className="text-sm text-white/50">
            CRUD de ítems del explorador, con métricas Chile y fuentes.
          </p>
        </div>
        <Link href="/admin/catalogo/nuevo">
          <Button>Nuevo ítem</Button>
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((c) => {
          const m = c.chileMetrics as CatalogChileMetrics | null;
          return (
            <Card key={c.id} className={!c.isActive ? "opacity-60" : undefined}>
              <CardHeader>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <Badge className="w-fit">{typeLabel(c.type)}</Badge>
                  {!c.isActive ? (
                    <Badge className="border-white/20 bg-white/5 text-white/50">
                      Inactivo
                    </Badge>
                  ) : null}
                  {c.educationAreaCode ? (
                    <Badge className="w-fit border-white/10 bg-white/5 text-white/60">
                      {educationAreaLabel(c.educationAreaCode)}
                    </Badge>
                  ) : null}
                </div>
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/60">
                <p className="line-clamp-2">{c.description}</p>
                {m ? (
                  <p className="text-xs text-white/45">
                    {typeof m.employabilityPct === "number"
                      ? `Empleab. ${m.employabilityPct}% · `
                      : ""}
                    {typeof m.incomeAvgClp === "number"
                      ? `${formatClp(m.incomeAvgClp)} · `
                      : ""}
                    {m.sourceCode} {m.referenceYear}
                  </p>
                ) : (
                  <p className="text-xs text-white/35">Sin chile_metrics</p>
                )}
                <Link href={`/admin/catalogo/${c.id}`}>
                  <Button size="sm" variant="secondary">
                    Editar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

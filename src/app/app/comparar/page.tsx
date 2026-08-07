import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
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
import { formatClp, typeLabel } from "@/lib/catalog-format";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CompararPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const saved = await db
    .select()
    .from(savedAlternatives)
    .where(eq(savedAlternatives.studentId, row.student.id));

  if (saved.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Comparador</h1>
        <EmptyState
          title="Aún no tienes alternativas guardadas"
          description="Guarda hasta tres opciones en el explorador para compararlas aquí."
          action={
            <Link href="/app/explorar">
              <Button>Ir a explorar</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const ids = saved.slice(0, 3).map((s) => s.catalogItemId);
  const items = await db
    .select()
    .from(catalogItems)
    .where(inArray(catalogItems.id, ids));

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

  const rows = [
    "Tipo",
    "Duración",
    "Modalidad",
    "Afinidad",
    "Empleabilidad (ref.)",
    "Ingreso (ref.)",
    "Fuente datos",
    "Campo laboral",
    "Acceso",
  ];

  const enriched = items.map((item) => {
    const aff = affinityScore(
      studentDims,
      (item.dimensions as Record<string, number>) ?? {},
    );
    return { item, aff };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comparar alternativas</h1>
        <p className="text-white/60">
          Hasta 3 opciones. Incluye afinidad y datos públicos de referencia
          (Mi Futuro / INE). Úsalo para conversar dudas, no para elegir “la
          única”.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-white/10 bg-white/5 p-3 text-left">
                Criterio
              </th>
              {enriched.map(({ item }) => (
                <th
                  key={item.id}
                  className="border border-white/10 bg-white/5 p-3 text-left"
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((label) => (
              <tr key={label}>
                <td className="border border-white/10 p-3 font-medium text-white/80">
                  {label}
                </td>
                {enriched.map(({ item, aff }) => {
                  const m = item.chileMetrics as CatalogChileMetrics | null;
                  let value = "—";
                  if (label === "Tipo") value = typeLabel(item.type);
                  if (label === "Duración") value = item.duration ?? "—";
                  if (label === "Modalidad") value = item.modality ?? "—";
                  if (label === "Afinidad") value = `${aff.score}%`;
                  if (label === "Empleabilidad (ref.)") {
                    value =
                      typeof m?.employabilityPct === "number"
                        ? `${m.employabilityPct}%${m.employabilityHorizon ? ` (${m.employabilityHorizon})` : ""}`
                        : "Sin serie comparable";
                  }
                  if (label === "Ingreso (ref.)") {
                    value =
                      typeof m?.incomeAvgClp === "number"
                        ? formatClp(m.incomeAvgClp)
                        : m?.incomeRangeClp
                          ? `${formatClp(m.incomeRangeClp[0])} – ${formatClp(m.incomeRangeClp[1])}`
                          : "—";
                  }
                  if (label === "Fuente datos") {
                    value = m
                      ? `${m.sourceName} · ${m.referenceYear}`
                      : "—";
                  }
                  if (label === "Campo laboral")
                    value = ((item.workAreas as string[]) ?? []).join(", ");
                  if (label === "Acceso") value = item.accessRoutes ?? "—";
                  return (
                    <td
                      key={item.id + label}
                      className="border border-white/10 p-3 text-white/70"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {enriched.map(({ item, aff }) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/60">
              <p className="mb-2 font-medium text-white/80">¿Por qué aparece?</p>
              <ul className="list-disc pl-4 space-y-1">
                {aff.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

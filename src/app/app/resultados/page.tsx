import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { assessmentResults, vocationalReports } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { RIASEC } from "@/lib/dimensions";
import { DimensionChart } from "@/components/dimension-chart";
import { AlertBanner } from "@/components/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ResultadosPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const [result] = await db
    .select()
    .from(assessmentResults)
    .where(eq(assessmentResults.studentId, row.student.id))
    .orderBy(desc(assessmentResults.createdAt))
    .limit(1);

  const [report] = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.studentId, row.student.id))
    .orderBy(desc(vocationalReports.createdAt))
    .limit(1);

  if (!result) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Resultados</h1>
        <AlertBanner tone="info">
          Aún no hay resultados. Completa el cuestionario de intereses.
        </AlertBanner>
        <Link href="/app/cuestionarios">
          <Button>Ir al cuestionario</Button>
        </Link>
      </div>
    );
  }

  const dims = result.dimensions as Record<string, number>;
  const tops = (result.topDimensions as string[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tus resultados orientativos</h1>
        <p className="text-white/60">
          No son una etiqueta fija. Podrías explorar rutas relacionadas y
          conversarlas con tu orientador/a.
        </p>
      </div>

      <AlertBanner tone="info">
        {result.summary} · Estado del informe:{" "}
        <strong>{report?.status ?? "sin informe"}</strong>
      </AlertBanner>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil de intereses</CardTitle>
        </CardHeader>
        <CardContent>
          <DimensionChart dimensions={dims} />
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {tops.map((code) => {
          const d = RIASEC[code as keyof typeof RIASEC];
          return (
            <Card key={code}>
              <CardHeader>
                <Badge className="w-fit">{code}</Badge>
                <CardTitle className="text-base">
                  {d?.name ?? code} · {dims[code] ?? 0}%
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/65">
                {d?.description}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/informe">
          <Button>Ver informe</Button>
        </Link>
        <Link href="/app/explorar">
          <Button variant="secondary">Explorar alternativas</Button>
        </Link>
      </div>
    </div>
  );
}

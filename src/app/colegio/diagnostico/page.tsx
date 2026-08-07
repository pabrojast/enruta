import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { institutionalDiagnostics } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { DiagnosticForm } from "./diagnostic-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export default async function DiagnosticoPage() {
  const session = await requireRole([
    "school_admin",
    "head_teacher",
    "enruta_admin",
    "counselor",
  ]);

  const rows = session.user.schoolId
    ? await db
        .select()
        .from(institutionalDiagnostics)
        .where(eq(institutionalDiagnostics.schoolId, session.user.schoolId))
        .orderBy(desc(institutionalDiagnostics.createdAt))
    : await db
        .select()
        .from(institutionalDiagnostics)
        .orderBy(desc(institutionalDiagnostics.createdAt));

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader
        eyebrow="Configuración del programa"
        title="Diagnóstico institucional"
        description="Formulario PEI/PME y propuesta orientativa de implementación ENRUTA."
      />
      <DiagnosticForm schoolId={session.user.schoolId} />
      <div className="grid gap-3">
        {rows.map((d) => (
          <Card key={d.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Diagnóstico {new Date(d.createdAt).toLocaleDateString("es-CL")}
                </CardTitle>
                <Badge className="mt-2">{d.status}</Badge>
              </div>
              <a href={`/api/pdf/diagnostico/${d.id}`}>
                <Button size="sm" variant="outline">
                  PDF
                </Button>
              </a>
            </CardHeader>
            <CardContent className="text-sm text-white/65 whitespace-pre-line line-clamp-6">
              {d.reportContent}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { requireRole } from "@/lib/session";
import { loadCaseload } from "@/lib/caseload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ClipboardList, Users } from "lucide-react";

export default async function ProDashboard() {
  const session = await requireRole([
    "counselor",
    "psychologist",
    "enruta_admin",
  ]);

  const rows = await loadCaseload({
    userId: session.user.id,
    role: session.user.role,
    schoolId: session.user.schoolId,
  });

  const pending = rows.filter((r) => r.caseloadStatus === "pending_review");
  const attention = rows.filter((r) => r.needsAttention);
  const openAlerts = rows.reduce((n, r) => n + r.openAlerts, 0);
  const weekQueue = pending.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel profesional</h1>
        <p className="text-white/60">
          Revisa alertas, valida informes y acompaña a tus estudiantes. La
          plataforma no reemplaza tu criterio profesional.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">En tu carga</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular">{rows.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-400/25">
          <CardHeader>
            <CardTitle className="text-base">Informes por revisar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular text-amber-100">
              {pending.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requieren atención</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular">{attention.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alertas abiertas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular">{openAlerts}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-amber-400/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Cola de esta semana</CardTitle>
            <Link
              href="/pro/informes?estado=pending"
              className="text-xs text-neon-cyan hover:underline"
            >
              Ver cola completa
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {weekQueue.length === 0 ? (
              <p className="text-sm text-white/50">
                No hay informes pendientes de mediación. Buen momento para
                seguimiento o exploración.
              </p>
            ) : (
              weekQueue.map((r) => (
                <div
                  key={r.studentId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {r.fullName}
                    </p>
                    <p className="text-xs text-white/45">
                      {r.gradeLevel}° medio
                      {r.courseName ? ` · ${r.courseName}` : ""}
                    </p>
                  </div>
                  {r.reportId ? (
                    <Link href={`/pro/informes/${r.reportId}`}>
                      <Button size="sm">Revisar</Button>
                    </Link>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atajos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              href="/pro/estudiantes?atencion=1"
              className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm hover:border-neon-cyan/30"
            >
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-neon-cyan" aria-hidden />
                Caseload prioritario
              </span>
              <Badge>{attention.length}</Badge>
            </Link>
            <Link
              href="/pro/informes?estado=pending"
              className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm hover:border-neon-cyan/30"
            >
              <span className="inline-flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-neon-pink" aria-hidden />
                Solo informes pendientes
              </span>
              <ArrowRight className="h-4 w-4 text-white/35" aria-hidden />
            </Link>
            <Link
              href="/pro/alertas"
              className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-3 text-sm hover:border-neon-cyan/30"
            >
              <span>Gestionar alertas</span>
              <Badge>{openAlerts}</Badge>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

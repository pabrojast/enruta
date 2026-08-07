import Link from "next/link";
import { requireRole } from "@/lib/session";
import { loadCaseload, reportStatusLabel } from "@/lib/caseload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Search = {
  estado?: string;
  grado?: string;
};

export default async function ProReportsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await requireRole([
    "counselor",
    "psychologist",
    "enruta_admin",
  ]);
  const sp = await searchParams;

  const caseload = await loadCaseload({
    userId: session.user.id,
    role: session.user.role,
    schoolId: session.user.schoolId,
  });

  let withReport = caseload.filter((r) => r.reportId);

  if (sp.estado === "pending") {
    withReport = withReport.filter((r) => r.caseloadStatus === "pending_review");
  } else if (sp.estado === "delivered") {
    withReport = withReport.filter((r) => r.caseloadStatus === "delivered");
  }
  if (sp.grado) {
    const g = Number(sp.grado);
    withReport = withReport.filter((r) => r.gradeLevel === g);
  }

  // Queue: pending first
  withReport = [...withReport].sort((a, b) => {
    if (a.caseloadStatus === "pending_review" && b.caseloadStatus !== "pending_review")
      return -1;
    if (b.caseloadStatus === "pending_review" && a.caseloadStatus !== "pending_review")
      return 1;
    const ta = a.updatedAt?.getTime() ?? 0;
    const tb = b.updatedAt?.getTime() ?? 0;
    return tb - ta;
  });

  const pending = withReport.filter((r) => r.caseloadStatus === "pending_review");
  const grades = [...new Set(caseload.map((r) => r.gradeLevel))].sort();

  function hrefWith(patch: Partial<Search>) {
    const next = { ...sp, ...patch };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
    }
    const s = params.toString();
    return s ? `/pro/informes?${s}` : "/pro/informes";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cola de informes</h1>
        <p className="text-white/60">
          Prioriza borradores pendientes de mediación. Al entregar, el
          estudiante recibe notificación in-app y correo (outbox / SMTP).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-amber-400/25 bg-amber-400/5">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Por revisar ahora
            </p>
            <p className="text-3xl font-semibold tabular text-amber-100">
              {pending.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Con informe en carga
            </p>
            <p className="text-3xl font-semibold tabular">
              {caseload.filter((r) => r.reportId).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Entregados
            </p>
            <p className="text-3xl font-semibold tabular text-neon-green">
              {
                caseload.filter((r) => r.caseloadStatus === "delivered")
                  .length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            [undefined, "Todos"],
            ["pending", "Solo pendientes"],
            ["delivered", "Entregados"],
          ] as const
        ).map(([key, label]) => (
          <Link key={label} href={hrefWith({ estado: key })}>
            <Badge
              className={cn(
                "cursor-pointer",
                (sp.estado ?? undefined) === key &&
                  "border-neon-cyan/40 bg-neon-cyan/15",
              )}
            >
              {label}
            </Badge>
          </Link>
        ))}
        {grades.map((g) => (
          <Link key={g} href={hrefWith({ grado: String(g) })}>
            <Badge
              className={cn(
                "cursor-pointer",
                sp.grado === String(g) && "border-neon-cyan/40 bg-neon-cyan/15",
              )}
            >
              {g}° medio
            </Badge>
          </Link>
        ))}
        {sp.grado ? (
          <Link href={hrefWith({ grado: undefined })}>
            <Badge className="cursor-pointer">Quitar grado</Badge>
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3">
        {withReport.map((r) => (
          <Card
            key={r.reportId}
            className={cn(
              r.caseloadStatus === "pending_review" &&
                "border-amber-400/30 bg-amber-400/5",
            )}
          >
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">{r.fullName}</CardTitle>
                <p className="mt-1 text-sm text-white/50">
                  {r.gradeLevel}° medio
                  {r.courseName ? ` · ${r.courseName}` : ""}
                </p>
                <Badge className="mt-2 capitalize">
                  {reportStatusLabel(r.reportStatus)}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/pro/informes/${r.reportId}`}>
                  <Button size="sm">
                    {r.caseloadStatus === "pending_review"
                      ? "Revisar y entregar"
                      : "Abrir"}
                  </Button>
                </Link>
                <Link href={`/pro/estudiantes/${r.studentId}`}>
                  <Button size="sm" variant="secondary">
                    Ficha
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-white/45">
              {r.updatedAt
                ? `Actualizado ${r.updatedAt.toLocaleString("es-CL")}`
                : "Sin fecha"}
              {r.openAlerts > 0
                ? ` · ${r.openAlerts} alerta(s) abierta(s)`
                : null}
            </CardContent>
          </Card>
        ))}
        {withReport.length === 0 ? (
          <p className="text-white/50">
            No hay informes con estos filtros.{" "}
            <Link href="/pro/informes" className="text-neon-cyan hover:underline">
              Ver todos
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

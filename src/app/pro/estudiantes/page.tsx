import Link from "next/link";
import { requireRole } from "@/lib/session";
import {
  loadCaseload,
  statusLabel,
  type CaseloadStatus,
} from "@/lib/caseload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileSearch, UserRound } from "lucide-react";

type Search = {
  grado?: string;
  estado?: string;
  q?: string;
  atencion?: string;
};

export default async function ProStudentsPage({
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

  const rows = await loadCaseload({
    userId: session.user.id,
    role: session.user.role,
    schoolId: session.user.schoolId,
  });

  const grades = [...new Set(rows.map((r) => r.gradeLevel))].sort();
  const pendingCount = rows.filter((r) => r.caseloadStatus === "pending_review").length;
  const attentionCount = rows.filter((r) => r.needsAttention).length;

  let filtered = rows;
  if (sp.grado) {
    const g = Number(sp.grado);
    filtered = filtered.filter((r) => r.gradeLevel === g);
  }
  if (sp.estado) {
    filtered = filtered.filter((r) => r.caseloadStatus === sp.estado);
  }
  if (sp.atencion === "1") {
    filtered = filtered.filter((r) => r.needsAttention);
  }
  if (sp.q?.trim()) {
    const q = sp.q.trim().toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.courseName?.toLowerCase().includes(q) ?? false),
    );
  }

  function hrefWith(patch: Partial<Search>) {
    const next = { ...sp, ...patch };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
    }
    const s = params.toString();
    return s ? `/pro/estudiantes?${s}` : "/pro/estudiantes";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Caseload de estudiantes</h1>
          <p className="text-white/60">
            Quién necesita conversación o revisión esta semana. Ordenado por
            atención prioritaria.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 tabular">
            {rows.length} en carga
          </span>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 tabular text-amber-100">
            {pendingCount} por revisar
          </span>
          <span className="rounded-full border border-neon-pink/30 bg-neon-pink/10 px-3 py-1 tabular">
            {attentionCount} requieren atención
          </span>
        </div>
      </div>

      <form className="flex flex-wrap gap-2" action="/pro/estudiantes" method="get">
        {sp.grado ? <input type="hidden" name="grado" value={sp.grado} /> : null}
        {sp.estado ? <input type="hidden" name="estado" value={sp.estado} /> : null}
        {sp.atencion ? (
          <input type="hidden" name="atencion" value={sp.atencion} />
        ) : null}
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Buscar por nombre o correo…"
          className="min-h-10 min-w-[14rem] flex-1 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white placeholder:text-white/40"
        />
        <Button type="submit" size="sm" variant="secondary">
          Buscar
        </Button>
      </form>

      <div className="space-y-2">
        <FilterRow label="Atención">
          <Chip href={hrefWith({ atencion: undefined })} active={!sp.atencion}>
            Todos
          </Chip>
          <Chip href={hrefWith({ atencion: "1" })} active={sp.atencion === "1"}>
            Solo prioritarios
          </Chip>
        </FilterRow>
        <FilterRow label="Grado">
          <Chip href={hrefWith({ grado: undefined })} active={!sp.grado}>
            Todos
          </Chip>
          {grades.map((g) => (
            <Chip
              key={g}
              href={hrefWith({ grado: String(g) })}
              active={sp.grado === String(g)}
            >
              {g}° medio
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Estado">
          {(
            [
              [undefined, "Todos"],
              ["pending_review", "Por revisar"],
              ["in_progress", "Cuestionario en curso"],
              ["no_assessment", "Sin cuestionario"],
              ["delivered", "Informe entregado"],
            ] as const
          ).map(([key, label]) => (
            <Chip
              key={label}
              href={hrefWith({ estado: key })}
              active={(sp.estado ?? undefined) === key}
            >
              {label}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p className="text-xs text-white/40">
        {filtered.length} estudiante{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="grid gap-3">
        {filtered.map((r) => (
          <Card
            key={r.studentId}
            className={cn(
              "card-interactive",
              r.needsAttention && "border-amber-400/30",
            )}
          >
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">{r.fullName}</CardTitle>
                  {r.needsAttention ? (
                    <Badge className="border-amber-400/30 bg-amber-400/15 text-amber-100">
                      Atención
                    </Badge>
                  ) : null}
                  <StatusBadge status={r.caseloadStatus} />
                </div>
                <p className="text-sm text-white/50">
                  {r.gradeLevel}° medio
                  {r.courseName ? ` · ${r.courseName}` : ""} · {r.email}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.reportId && r.caseloadStatus === "pending_review" ? (
                  <Link href={`/pro/informes/${r.reportId}`}>
                    <Button size="sm">
                      <FileSearch className="h-4 w-4" aria-hidden />
                      Revisar informe
                    </Button>
                  </Link>
                ) : null}
                <Link href={`/pro/estudiantes/${r.studentId}`}>
                  <Button size="sm" variant="secondary">
                    <UserRound className="h-4 w-4" aria-hidden />
                    Ficha
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 text-xs text-white/55">
              <span>
                Perfil:{" "}
                <strong className="text-white/80">
                  {r.profileCompleted ? "completo" : "pendiente"}
                </strong>
              </span>
              <span>
                Cuestionario:{" "}
                <strong className="text-white/80">
                  {r.assessmentStatus === "submitted"
                    ? "enviado"
                    : r.assessmentStatus === "in_progress"
                      ? "en curso"
                      : "no iniciado"}
                </strong>
              </span>
              {r.openAlerts > 0 ? (
                <span className="inline-flex items-center gap-1 text-amber-100/90">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                  {r.openAlerts} alerta{r.openAlerts === 1 ? "" : "s"} abierta
                  {r.openAlerts === 1 ? "" : "s"}
                </span>
              ) : (
                <span>Sin alertas abiertas</span>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 ? (
          <p className="text-white/50">
            No hay estudiantes con estos filtros.{" "}
            <Link href="/pro/estudiantes" className="text-neon-cyan hover:underline">
              Limpiar
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CaseloadStatus }) {
  const tone =
    status === "pending_review"
      ? "border-amber-400/30 bg-amber-400/15 text-amber-100"
      : status === "delivered"
        ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
        : "border-white/15 bg-white/10";
  return <Badge className={tone}>{statusLabel(status)}</Badge>;
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-[11px] font-medium uppercase tracking-wide text-white/40 sm:w-auto sm:min-w-[5rem]">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Badge
        className={cn(
          "cursor-pointer hover:bg-white/15",
          active && "border-neon-cyan/40 bg-neon-cyan/15 text-white",
        )}
      >
        {children}
      </Badge>
    </Link>
  );
}

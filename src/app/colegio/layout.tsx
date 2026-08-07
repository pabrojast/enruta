import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/rbac";

const nav = [
  { href: "/colegio", label: "Indicadores" },
  { href: "/colegio/analisis", label: "Análisis público" },
  { href: "/colegio/cursos", label: "Cursos" },
  { href: "/colegio/estudiantes", label: "Estudiantes" },
  { href: "/colegio/eventos", label: "Eventos" },
  { href: "/colegio/diagnostico", label: "Diagnóstico" },
];

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole([
    "school_admin",
    "head_teacher",
    "enruta_admin",
  ]);
  return (
    <AppShell
      title="Establecimiento"
      nav={nav}
      userName={session.user.name}
      userRole={ROLE_LABELS[session.user.role]}
    >
      {children}
    </AppShell>
  );
}

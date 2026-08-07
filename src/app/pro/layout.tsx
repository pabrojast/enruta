import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/rbac";

const nav = [
  { href: "/pro", label: "Dashboard" },
  { href: "/pro/estudiantes", label: "Estudiantes" },
  { href: "/pro/alertas", label: "Alertas" },
  { href: "/pro/informes", label: "Informes" },
];

export default async function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole([
    "counselor",
    "psychologist",
    "enruta_admin",
  ]);
  return (
    <AppShell
      title="Espacio profesional"
      nav={nav}
      userName={session.user.name}
      userRole={ROLE_LABELS[session.user.role]}
    >
      {children}
    </AppShell>
  );
}

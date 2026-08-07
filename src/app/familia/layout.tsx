import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/rbac";

const nav = [
  { href: "/familia", label: "Resumen" },
  { href: "/familia/eventos", label: "Próximos eventos" },
  { href: "/autorizar-familia", label: "Autorizar otro vínculo" },
];

export default async function FamiliaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["guardian", "enruta_admin"]);
  return (
    <AppShell
      title="Espacio familia"
      nav={nav}
      userName={session.user.name}
      userRole={ROLE_LABELS[session.user.role]}
    >
      {children}
    </AppShell>
  );
}

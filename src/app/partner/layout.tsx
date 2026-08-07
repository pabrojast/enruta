import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/rbac";

const nav = [
  { href: "/partner", label: "Perfil" },
  { href: "/partner/eventos", label: "Publicar / ver eventos" },
];

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["partner", "enruta_admin"]);
  return (
    <AppShell
      title="Empresas e instituciones"
      nav={nav}
      userName={session.user.name}
      userRole={ROLE_LABELS[session.user.role]}
    >
      {children}
    </AppShell>
  );
}

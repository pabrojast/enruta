import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/session";

const nav = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/establecimientos", label: "Establecimientos" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/cuestionarios", label: "Cuestionarios" },
  { href: "/admin/catalogo", label: "Catálogo" },
  { href: "/admin/datos-publicos", label: "Datos públicos" },
  { href: "/admin/planes", label: "Planes" },
  { href: "/admin/integraciones", label: "Integraciones" },
  { href: "/admin/contactos", label: "Contactos" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["enruta_admin"]);
  return (
    <AppShell
      title="Admin ENRUTA"
      nav={nav}
      userName={session.user.name}
      userRole="Administrador"
    >
      {children}
    </AppShell>
  );
}

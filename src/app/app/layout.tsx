import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/rbac";

const nav = [
  { href: "/app", label: "Inicio" },
  { href: "/app/perfil", label: "Perfil" },
  { href: "/app/autoconocimiento", label: "Autoconocimiento" },
  { href: "/app/cuestionarios", label: "Cuestionarios" },
  { href: "/app/resultados", label: "Resultados" },
  { href: "/app/informe", label: "Informe" },
  { href: "/app/explorar", label: "Explorar" },
  { href: "/app/analisis", label: "Análisis" },
  { href: "/app/comparar", label: "Comparar" },
  { href: "/app/eventos", label: "Eventos" },
  { href: "/app/juegos", label: "Juegos" },
  { href: "/app/portafolio", label: "Portafolio" },
  { href: "/app/proyecto-de-vida", label: "Proyecto de vida" },
  { href: "/app/seguimientos", label: "Seguimientos" },
  { href: "/app/notificaciones", label: "Notificaciones" },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["student"]);
  return (
    <AppShell
      title="Tu ruta"
      nav={nav}
      userName={session.user.name}
      userRole={ROLE_LABELS[session.user.role]}
    >
      {children}
    </AppShell>
  );
}

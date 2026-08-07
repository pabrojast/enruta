import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { href: "/descubrir", label: "Descubrir" },
  { href: "/programa", label: "Programa" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/colegios", label: "Colegios" },
  { href: "/contacto", label: "Contacto" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/login", label: "Ingresar" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <BrandLogo size={40} showText href="/" />
          <p className="text-sm leading-relaxed text-white/50">
            Orientación vocacional para 1° a 4° medio en Chile. Tecnología con
            mediación humana: resultados orientativos, no diagnósticos.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Sitio
          </p>
          <ul className="grid gap-2 text-sm text-white/65 sm:grid-cols-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-md transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-xs space-y-2 text-xs leading-relaxed text-white/40">
          <p translate="no">ENRUTA · Descubre tu norte</p>
          <p>
            No emite diagnósticos psicológicos. Los informes se entregan con
            validación profesional. Datos separados por establecimiento y roles
            acotados.
          </p>
        </div>
      </div>
    </footer>
  );
}

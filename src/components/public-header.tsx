"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/descubrir", label: "Descubrir" },
  { href: "/programa", label: "Programa" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/colegios", label: "Colegios" },
  { href: "/contacto", label: "Contacto" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <BrandLogo size={48} showText />

      <nav
        className="hidden items-center gap-1 text-sm text-white/70 md:flex"
        aria-label="Sitio público"
      >
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 transition-colors duration-150 hover:text-white",
                active && "bg-white/10 text-white",
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Link href="/login" className="hidden sm:inline-flex">
          <Button variant="ghost" size="sm">
            Ingresar
          </Button>
        </Link>
        <Link href="/registro">
          <Button size="sm">Comenzar</Button>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="md:hidden px-2"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </Button>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-[4.5rem] z-50 border-b border-white/10 bg-[#070a14]/95 px-4 py-3 shadow-xl backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1" aria-label="Menú móvil">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/8"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="rounded-xl px-3 py-3 text-sm text-neon-cyan hover:bg-neon-cyan/10"
              onClick={() => setOpen(false)}
            >
              Ingresar
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

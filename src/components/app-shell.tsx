"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  nav,
  title,
  userName,
  userRole,
}: {
  children: React.ReactNode;
  nav: { href: string; label: string }[];
  title: string;
  userName?: string | null;
  userRole?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/app" || href === "/pro" || href === "/colegio" || href === "/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen min-h-dvh">
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="lg:hidden shrink-0 px-2"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="app-mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </Button>
            <BrandLogo size={40} showText />
            <div className="hidden min-w-0 sm:block">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                {title}
              </p>
              {userName ? (
                <p className="truncate text-sm text-white/80">
                  <span className="text-white">{userName}</span>
                  {userRole ? (
                    <span className="text-white/40"> · {userRole}</span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Salir
            </Button>
          </form>
        </div>

        {/* Desktop / tablet horizontal nav */}
        <nav
          className="nav-scroll mx-auto hidden max-w-7xl gap-1 px-4 pb-3 lg:flex"
          aria-label="Navegación principal"
        >
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-[background-color,color,box-shadow] duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan",
                  active
                    ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(45,226,197,0.35)]"
                    : "text-white/65 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Compact scroll chips under lg when drawer closed */}
        <nav
          className="nav-scroll mx-auto flex max-w-7xl gap-1 px-4 pb-3 lg:hidden"
          aria-label="Accesos rápidos"
        >
          {nav.slice(0, 6).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors duration-150",
                  active
                    ? "bg-neon-cyan/15 text-neon-cyan"
                    : "bg-white/5 text-white/65 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {nav.length > 6 ? (
            <button
              type="button"
              className="whitespace-nowrap rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/65 hover:bg-white/10"
              onClick={() => setOpen(true)}
            >
              +{nav.length - 6} más
            </button>
          ) : null}
        </nav>
      </header>

      {/* Mobile full menu drawer */}
      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div
            id="app-mobile-nav"
            className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col border-r border-white/10 bg-[#070a14] p-4 pt-[max(1rem,env(safe-area-inset-top))] shadow-2xl overscroll-contain"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Menú · {title}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden />
              </Button>
            </div>
            {userName ? (
              <p className="mb-4 truncate rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                {userName}
                {userRole ? (
                  <span className="block text-xs text-white/40">{userRole}</span>
                ) : null}
              </p>
            ) : null}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Menú completo">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm transition-colors duration-150",
                      active
                        ? "bg-neon-cyan/15 text-neon-cyan"
                        : "text-white/75 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <form action={logoutAction} className="mt-4 border-t border-white/10 pt-4">
              <Button type="submit" variant="secondary" className="w-full">
                Salir de la cuenta
              </Button>
            </form>
          </div>
        </div>
      ) : null}

      <main
        id="contenido-principal"
        className="mx-auto max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}

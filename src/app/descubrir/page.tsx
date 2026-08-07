import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { DiscoverQuiz } from "./discover-quiz";
import { Compass } from "lucide-react";

export const metadata = {
  title: "Descubrir · ENRUTA",
  description:
    "Micro-quiz orientativo de intereses. No es un diagnóstico: es una puerta de entrada al proceso ENRUTA.",
};

export default function DescubrirPage() {
  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neon-cyan">
          <Compass className="h-3.5 w-3.5" aria-hidden />
          Prueba sin cuenta
        </p>
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Descubre un primer norte
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
          Una mini experiencia pública. Si te hace sentido, el camino completo
          es con tu colegio: cuestionarios, informe mediado y exploración
          explicable.{" "}
          <Link href="/metodologia" className="text-neon-cyan hover:underline">
            Cómo trabajamos
          </Link>
        </p>

        <div className="mt-8">
          <DiscoverQuiz />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

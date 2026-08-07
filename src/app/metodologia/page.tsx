import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Shield } from "lucide-react";

const principles = [
  {
    title: "La orientación es un proceso continuo",
    body: "1° a 4° medio no se resuelve en una sesión. Cada etapa tiene preguntas y entregables distintos.",
  },
  {
    title: "Los tests son orientativos",
    body: "No diagnosticamos ni “asignamos” una carrera. Los instrumentos abren conversación; no cierran destino.",
  },
  {
    title: "Siempre hay múltiples alternativas",
    body: "Carreras, oficios y rutas mixtas. Evitamos el mito de la “única carrera ideal”.",
  },
  {
    title: "Toda recomendación es explicable",
    body: "Si aparece una opción, el estudiante ve por qué: dimensiones, intereses y contraste con otras rutas.",
  },
  {
    title: "Resultados sensibles con mediación humana",
    body: "El informe profesional se revisa y valida antes de la entrega. La tecnología acelera; no reemplaza el juicio ético.",
  },
  {
    title: "Datos separados por establecimiento y rol",
    body: "Familias con permisos limitados. Alertas restringidas solo a roles autorizados. Sin “tablero abierto” de respuestas.",
  },
];

const flow = [
  {
    title: "Consentimiento y perfil",
    body: "Base ética y contextual: qué se recogerá, quién lo ve y para qué sirve el proceso.",
  },
  {
    title: "Autoconocimiento y cuestionarios",
    body: "Instrumentos configurables por el colegio. Auto-guardado para no perder avances.",
  },
  {
    title: "Procesamiento + borrador de informe",
    body: "Motor de puntajes y texto base. Estado: pendiente de revisión profesional.",
  },
  {
    title: "Validación profesional y entrega",
    body: "Orientación o psicología edita, contextualiza y libera el informe al estudiante.",
  },
  {
    title: "Exploración, eventos y portafolio",
    body: "Afinidad explicable, guardado de alternativas, evidencias y experiencias reales.",
  },
  {
    title: "Proyecto de vida y seguimiento",
    body: "Plan de acción y revisiones a 30, 90 y 180 días para sostener lo decidido.",
  },
];

export default function MetodologiaPage() {
  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <PublicHeader />
      <main className="mx-auto max-w-3xl space-y-12 px-4 py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink">
            Metodología
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Cómo trabajamos la orientación
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            ENRUTA se diseña para potenciar al equipo de orientación del
            colegio, no para reemplazarlo. Estos principios guían producto,
            copy y permisos.
          </p>
        </header>

        <section aria-labelledby="principios-heading">
          <h2
            id="principios-heading"
            className="text-xl font-semibold text-white"
          >
            Principios
          </h2>
          <div className="mt-4 grid gap-3">
            {principles.map((p) => (
              <Card key={p.title}>
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-start gap-2 text-base">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-neon-green"
                      aria-hidden
                    />
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-white/60">
                  {p.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="flujo-heading">
          <h2 id="flujo-heading" className="text-xl font-semibold text-white">
            Flujo del proceso
          </h2>
          <ol className="mt-4 space-y-3">
            {flow.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-sm font-semibold tabular text-neon-cyan">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="privacidad-heading"
          className="rounded-2xl border border-neon-cyan/25 bg-neon-cyan/5 p-5"
        >
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-neon-cyan" aria-hidden />
            <div>
              <h2
                id="privacidad-heading"
                className="text-lg font-semibold text-white"
              >
                Privacidad y roles
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
                <li>
                  Separación de datos por establecimiento: un colegio no ve a
                  otro.
                </li>
                <li>
                  Roles acotados (estudiante, profesional, UTP, familia,
                  partner, admin).
                </li>
                <li>
                  Apoderados no ven respuestas sensibles por defecto.
                </li>
                <li>
                  Alertas restringidas solo para psicología / admin cuando
                  corresponde.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/programa">
            <Button variant="secondary">Ver el programa</Button>
          </Link>
          <Link href="/contacto">
            <Button>Contactar al equipo</Button>
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

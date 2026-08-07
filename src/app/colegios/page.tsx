import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";

const plans = [
  {
    name: "ENRUTA Diagnóstico",
    tag: "Entrada",
    body: "Radiografía vocacional del establecimiento: participación, avance y señales para el PEI/PME. Ideal para saber por dónde empezar.",
    points: [
      "Cuestionarios y avance por curso",
      "Indicadores agregados exportables",
      "Informe de diagnóstico institucional",
    ],
  },
  {
    name: "ENRUTA Piloto",
    tag: "Prueba controlada",
    body: "Un nivel o cohorte con el flujo completo: cuestionario → revisión profesional → exploración → seguimiento corto.",
    points: [
      "Roles de orientación y psicología",
      "Mediación de informes",
      "Explorador y eventos con partners",
    ],
  },
  {
    name: "ENRUTA 4 Años",
    tag: "Programa continuo",
    body: "Instalación de la ruta 1°–4° medio con portafolio, proyecto de vida, familia y seguimiento longitudinal.",
    points: [
      "Etapas por grado con entregables",
      "Portal familia con permisos limitados",
      "Seguimientos 30/90/180 y alertas",
    ],
  },
];

const benefits = [
  {
    icon: Users,
    title: "Caseload operable",
    body: "Quién tiene informe pendiente, quién avanzó y quién necesita conversación esta semana — sin perseguir planillas sueltas.",
  },
  {
    icon: GraduationCap,
    title: "HC y TP en la misma plataforma",
    body: "Carreras, oficios y rutas mixtas. El mensaje no es “solo universidad”: es proyecto de vida con caminos reales.",
  },
  {
    icon: BarChart3,
    title: "Indicadores para UTP y PEI/PME",
    body: "Export CSV e insumos para el trabajo institucional, no solo “actividad de orientación”.",
  },
  {
    icon: Shield,
    title: "Privacidad por diseño",
    body: "Datos por establecimiento, roles acotados y familia sin acceso por defecto a respuestas sensibles.",
  },
];

const checklist = [
  "Definir plan (Diagnóstico / Piloto / 4 Años) y cursos piloto",
  "Crear establecimiento y códigos de registro",
  "Cargar o activar equipo (orientación, psicología, UTP)",
  "Configurar cuestionarios y consentimientos",
  "Capacitación corta al equipo (flujo de revisión de informes)",
  "Lanzamiento a estudiantes y comunicación a familias",
];

export default function ColegiosPage() {
  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <PublicHeader />
      <main className="mx-auto max-w-5xl space-y-14 px-4 py-10">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
            Colegios
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Soluciones para establecimientos
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            ENRUTA potencia al equipo de orientación con un proceso de 1° a 4°
            medio: instrumentos configurables, informes mediadas por
            profesionales, exploración explicable e indicadores para la
            gestión. La tecnología no reemplaza al orientador: le devuelve
            tiempo y claridad.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contacto">
              <Button size="lg">Agendar conversación</Button>
            </Link>
            <Link href="/metodologia">
              <Button size="lg" variant="secondary">
                Ver metodología
              </Button>
            </Link>
          </div>
        </header>

        <section aria-labelledby="planes-heading">
          <h2
            id="planes-heading"
            className="text-xl font-semibold text-white md:text-2xl"
          >
            Planes configurables
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/55">
            Los planes se adaptan a modalidad HC/TP, conectividad y foco del
            PEI/PME. Los precios comerciales se conversan según tamaño y alcance
            del piloto.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.name} className="card-interactive flex h-full flex-col">
                <CardHeader>
                  <p className="text-xs font-medium uppercase tracking-wide text-neon-cyan">
                    {p.tag}
                  </p>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-4">
                  <p className="text-sm leading-relaxed text-white/60">{p.body}</p>
                  <ul className="mt-auto space-y-2 text-sm text-white/70">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-neon-green"
                          aria-hidden
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="beneficios-heading">
          <h2
            id="beneficios-heading"
            className="text-xl font-semibold text-white md:text-2xl"
          >
            Qué gana el equipo
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card key={b.title}>
                  <CardContent className="flex gap-3 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/25">
                      <Icon className="h-5 w-5 text-neon-cyan" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{b.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {b.body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="implementacion-heading">
          <Card className="border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-neon-pink" aria-hidden />
                <CardTitle id="implementacion-heading" className="text-lg">
                  Checklist de implementación
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-2 sm:grid-cols-2">
                {checklist.map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/70"
                  >
                    <span className="font-medium tabular text-neon-cyan">
                      {i + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/10 to-transparent p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">
            ¿Conversamos un piloto?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
            Cuéntanos tamaño del establecimiento, modalidad (HC/TP) y si
            buscas diagnóstico, piloto de un curso o programa de 4 años.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contacto">
              <Button size="lg">Contactar al equipo ENRUTA</Button>
            </Link>
            <Link href="/programa">
              <Button size="lg" variant="secondary">
                Revisar el programa
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

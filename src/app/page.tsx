import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Compass,
  HeartHandshake,
  LineChart,
  Map,
  MessageCircle,
  Route,
  School,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

const stages = [
  {
    grade: "1° medio",
    title: "Conocerme",
    q: "¿Quién soy?",
    deliverable: "Perfil de intereses y autoconocimiento",
    tone: "from-neon-green/20 to-transparent",
  },
  {
    grade: "2° medio",
    title: "Descubrir mis capacidades",
    q: "¿En qué soy bueno/a?",
    deliverable: "Mapa de habilidades y valores",
    tone: "from-neon-cyan/20 to-transparent",
  },
  {
    grade: "3° medio",
    title: "Explorar posibilidades reales",
    q: "¿Qué opciones tienen sentido?",
    deliverable: "Alternativas guardadas con explicación",
    tone: "from-neon-pink/20 to-transparent",
  },
  {
    grade: "4° medio",
    title: "Construir mi proyecto de vida",
    q: "¿Qué quiero hacer ahora?",
    deliverable: "Proyecto de vida y plan de acción",
    tone: "from-white/10 to-transparent",
  },
];

const steps = [
  {
    icon: School,
    title: "Registro con código de colegio",
    body: "Entras con el código de tu establecimiento. Tus datos quedan en ese contexto.",
  },
  {
    icon: Shield,
    title: "Consentimiento y perfil",
    body: "Privacidad clara: qué se usa, quién ve qué y cómo participa la familia.",
  },
  {
    icon: ClipboardList,
    title: "Cuestionarios con pausa",
    body: "Autoconocimiento por etapas. Puedes guardar y continuar cuando quieras.",
  },
  {
    icon: MessageCircle,
    title: "Informe con mediación humana",
    body: "Un profesional revisa y valida el borrador antes de que lo veas completo.",
  },
  {
    icon: Map,
    title: "Exploración explicable",
    body: "Carreras, oficios y rutas con afinidad y razones, no un listado opaco.",
  },
  {
    icon: Route,
    title: "Proyecto de vida y seguimiento",
    body: "Portafolio, eventos reales y revisiones a 30, 90 y 180 días.",
  },
];

const problems = [
  {
    title: "Un test de 20 minutos y olvídate",
    body: "Un resultado de un día no alcanza para decidir tu futuro con calma.",
  },
  {
    title: "Cien carreras sin explicación",
    body: "Listas largas y scores opacos no ayudan a saber por qué te salió algo.",
  },
  {
    title: "Decidir solo bajo presión",
    body: "PAES, familia y el reloj de 4° medio no reemplazan un proceso con compañía.",
  },
];

const faqs = [
  {
    q: "¿ENRUTA reemplaza al orientador o psicólogo del colegio?",
    a: "No. La plataforma potencia al equipo de orientación: genera borradores, organiza la exploración y deja la validación humana al centro.",
  },
  {
    q: "¿Es un diagnóstico psicológico?",
    a: "No. Los resultados son orientativos. No emiten diagnósticos clínicos ni deciden por ti.",
  },
  {
    q: "¿Qué ven las familias?",
    a: "Participación con permisos limitados: apoyo sin acceder por defecto a respuestas sensibles del estudiante.",
  },
  {
    q: "¿Sirve para HC y TP / oficios?",
    a: "Sí. El catálogo y las rutas incluyen carreras universitarias, formación técnica, oficios y caminos mixtos.",
  },
  {
    q: "¿Cuánto dura el cuestionario?",
    a: "Depende de la versión del colegio. Siempre puedes guardar y continuar; no es un maratón de un solo intento.",
  },
  {
    q: "¿Cómo empieza un establecimiento?",
    a: "Con un plan (Diagnóstico, Piloto o 4 Años), códigos de registro y acompañamiento al equipo de orientación. Escríbenos en Contacto.",
  },
];

export default function HomePage() {
  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <a href="#inicio" className="skip-link">
        Saltar al contenido
      </a>
      <PublicHeader />

      <main id="inicio">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-6 md:grid-cols-2 md:items-center md:pb-20 md:pt-10">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon-cyan">
              <Compass className="h-3.5 w-3.5" aria-hidden />
              Orientación vocacional Chile
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-[3.25rem]">
              Descubre tu norte,{" "}
              <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                sin prisa y con compañía
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              ENRUTA acompaña a estudiantes de 1° a 4° medio en un proceso
              continuo: autoconocimiento, exploración de carreras y oficios,
              experiencias reales y proyecto de vida. La tecnología no reemplaza
              al orientador: lo potencia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/registro">
                <Button size="lg">Comencemos tu ruta</Button>
              </Link>
              <Link href="/descubrir">
                <Button size="lg" variant="secondary">
                  Probar sin cuenta (3 min)
                </Button>
              </Link>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link
                href="/login"
                className="font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                Ya tengo cuenta
              </Link>
              <Link
                href="/colegios"
                className="inline-flex items-center gap-1.5 font-medium text-neon-cyan/90 underline-offset-4 hover:text-neon-cyan hover:underline"
              >
                Soy colegio u orientador/a
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/50">
              <li>Resultados orientativos</li>
              <li aria-hidden>·</li>
              <li>Mediación humana</li>
              <li aria-hidden>·</li>
              <li>
                <Link href="/privacidad" className="hover:text-white/70 hover:underline">
                  Datos protegidos por establecimiento
                </Link>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div
              className="absolute inset-4 rounded-[2rem] bg-gradient-to-br from-neon-green/20 via-neon-cyan/12 to-neon-pink/20 blur-3xl"
              aria-hidden
            />
            <ProductPreviewCard />
          </div>
        </section>

        {/* Social proof */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="confianza-heading"
        >
          <h2 id="confianza-heading" className="sr-only">
            Por qué confiar en ENRUTA
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={<Users className="h-4 w-4 text-neon-green" aria-hidden />}
              label="Para 1° a 4° medio"
              value="HC y TP"
              hint="Un mismo proceso adaptable al contexto del colegio"
            />
            <Stat
              icon={<BadgeCheck className="h-4 w-4 text-neon-cyan" aria-hidden />}
              label="Informe con sello humano"
              value="Validado"
              hint="Solo se entrega completo tras revisión profesional"
            />
            <Stat
              icon={<Briefcase className="h-4 w-4 text-neon-pink" aria-hidden />}
              label="Más que universidad"
              value="Rutas mixtas"
              hint="Carreras, oficios, TP y caminos reales"
            />
            <Stat
              icon={<LineChart className="h-4 w-4 text-neon-cyan" aria-hidden />}
              label="Contexto país"
              value="Claridad"
              hint="Muchos llegan a 4° sin saber qué estudiar: el proceso da tiempo"
            />
          </div>
        </section>

        {/* Problem */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="problema-heading"
        >
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink">
              El problema
            </p>
            <h2
              id="problema-heading"
              className="mt-1 text-2xl font-semibold text-white md:text-3xl"
            >
              Un test suelto no es orientación
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
              Lo que frustra a estudiantes y colegios no es “usar tecnología”:
              es quedarse con un gráfico de colores, una lista interminable o la
              presión de decidir solo. ENRUTA es un proceso con compañía.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((p) => (
              <Card key={p.title} className="card-interactive h-full">
                <CardHeader>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-white/60">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="como-heading"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
                Cómo funciona
              </p>
              <h2
                id="como-heading"
                className="mt-1 text-2xl font-semibold text-white md:text-3xl"
              >
                Seis pasos, con humanos en el medio
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/50">
              El paso 4 es el diferencial: nadie ve un informe “cerrado” sin
              mediación profesional.
            </p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title}>
                  <Card
                    className={`h-full card-interactive ${
                      i === 3 ? "border-neon-cyan/35 bg-neon-cyan/5" : ""
                    }`}
                  >
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/25">
                          <Icon className="h-4 w-4 text-neon-cyan" aria-hidden />
                        </span>
                        <span className="text-xs font-medium tabular text-white/40">
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <p className="text-sm leading-relaxed text-white/60">
                        {s.body}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 4-year route */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="etapas-heading"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink">
                Ruta de 4 años
              </p>
              <h2
                id="etapas-heading"
                className="mt-1 text-2xl font-semibold text-white md:text-3xl"
              >
                Un camino en cuatro etapas
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/50">
              No es un test de un día. Es un proceso que crece contigo —con
              entregables concretos en cada curso.
            </p>
          </div>
          <ol className="stage-rail">
            {stages.map((s, i) => (
              <li key={s.grade}>
                <Card
                  className={`h-full card-interactive bg-gradient-to-b ${s.tone}`}
                >
                  <CardHeader>
                    <p className="text-xs font-medium tabular text-white/45">
                      0{i + 1}
                    </p>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-white/50">{s.grade}</p>
                    <p className="text-sm font-medium text-white/90">{s.q}</p>
                    <p className="border-t border-white/10 pt-2 text-xs leading-relaxed text-white/50">
                      Entregable: {s.deliverable}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {/* Product preview strip */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="producto-heading"
        >
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-green">
              Dentro de la plataforma
            </p>
            <h2
              id="producto-heading"
              className="mt-1 text-2xl font-semibold text-white md:text-3xl"
            >
              Claridad para el estudiante, control para el colegio
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <PreviewPane
              eyebrow="Tu ruta"
              title="Siguiente paso, no un laberinto"
              body="El dashboard muestra qué hacer hoy: perfil, cuestionario, exploración o proyecto de vida."
              chips={["Progreso visible", "Alertas suaves", "Guardar y seguir"]}
            />
            <PreviewPane
              eyebrow="Explorar"
              title="Afinidad con el porqué"
              body="Cada alternativa muestra un % y una explicación: por qué aparece y qué dimensiones empujan."
              chips={["Carreras", "Oficios", "Rutas mixtas"]}
            />
            <PreviewPane
              eyebrow="Informe"
              title="Validado por un profesional"
              body="El borrador no se entrega solo. El equipo de orientación revisa, ajusta y libera el informe."
              chips={["Sello humano", "Lenguaje cercano", "Próximos pasos"]}
            />
          </div>
        </section>

        {/* Audiences */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="para-quien-heading"
        >
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Para quién
            </p>
            <h2
              id="para-quien-heading"
              className="mt-1 text-2xl font-semibold text-white md:text-3xl"
            >
              Tres miradas, un mismo proceso
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <AudienceCard
              icon={<Sparkles className="h-5 w-5 text-neon-green" aria-hidden />}
              title="Estudiantes"
              body="Portafolio, cuestionarios, explorador con razones e informe mediado. Sin prisa: puedes avanzar por etapas."
              cta={{ href: "/registro", label: "Crear mi cuenta" }}
            />
            <AudienceCard
              icon={<School className="h-5 w-5 text-neon-cyan" aria-hidden />}
              title="Colegios"
              body="HC y TP, indicadores agregados, alertas y flujo de revisión para orientación, psicología y UTP."
              cta={{ href: "/colegios", label: "Ver soluciones" }}
            />
            <AudienceCard
              icon={
                <HeartHandshake className="h-5 w-5 text-neon-pink" aria-hidden />
              }
              title="Familias"
              body="Participación con permisos limitados: apoyar el proceso sin invadir la privacidad del estudiante."
              cta={{ href: "/metodologia", label: "Cómo protegemos datos" }}
            />
          </div>
        </section>

        {/* Comparison */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="diferencia-heading"
        >
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
              Diferencia
            </p>
            <h2
              id="diferencia-heading"
              className="mt-1 text-2xl font-semibold text-white md:text-3xl"
            >
              No es un test online ni un buscador de carreras
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparación entre ENRUTA, un test online típico y un portal solo
                de datos
              </caption>
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th scope="col" className="px-4 py-3 font-medium text-white/50">
                    Dimensión
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-neon-cyan">
                    ENRUTA
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium text-white/50">
                    Test online típico
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium text-white/50">
                    Portal solo de datos
                  </th>
                </tr>
              </thead>
              <tbody className="text-white/75">
                {[
                  ["Horizonte", "Proceso de 4 años", "Una sesión", "Sin proceso"],
                  [
                    "Quién acompaña",
                    "Mediación profesional",
                    "Automático",
                    "Sin acompañamiento",
                  ],
                  [
                    "Qué recomienda",
                    "Carreras, oficios y rutas",
                    "A menudo solo “carrera”",
                    "Info sin match personal",
                  ],
                  [
                    "Transparencia",
                    "Afinidad explicable",
                    "Score opaco o “horóscopo”",
                    "Sin match",
                  ],
                  [
                    "Colegio",
                    "Roles, alertas, indicadores",
                    "Casi nunca",
                    "No aplica",
                  ],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-white/5">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-white/55"
                    >
                      {row[0]}
                    </th>
                    <td className="px-4 py-3 text-white">{row[1]}</td>
                    <td className="px-4 py-3 text-white/55">{row[2]}</td>
                    <td className="px-4 py-3 text-white/55">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Schools teaser */}
        <section
          id="colegios"
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="colegios-heading"
        >
          <Card className="overflow-hidden border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/10 via-white/[0.03] to-transparent">
            <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
                  Para establecimientos
                </p>
                <h2
                  id="colegios-heading"
                  className="mt-2 text-2xl font-semibold text-white md:text-3xl"
                >
                  Planes para diagnosticar, pilotear o instalar 4 años
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                  Configura ENRUTA según tu PEI/PME, modalidad HC o TP y
                  capacidad del equipo de orientación. Indicadores agregados,
                  revisión de informes y export para el trabajo institucional.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-white/70">
                  {[
                    "Diagnóstico institucional con foco vocacional",
                    "Piloto con un curso o nivel",
                    "Programa continuo 1°–4° medio",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-neon-green"
                        aria-hidden
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/colegios">
                    <Button>Ver planes para colegios</Button>
                  </Link>
                  <Link href="/contacto">
                    <Button variant="secondary">Hablar con el equipo</Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-3">
                {["ENRUTA Diagnóstico", "ENRUTA Piloto", "ENRUTA 4 Años"].map(
                  (plan, i) => (
                    <div
                      key={plan}
                      className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"
                    >
                      <p className="text-xs text-white/40">Plan 0{i + 1}</p>
                      <p className="font-medium text-white">{plan}</p>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="faq-heading"
        >
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Preguntas frecuentes
            </p>
            <h2
              id="faq-heading"
              className="mt-1 text-2xl font-semibold text-white md:text-3xl"
            >
              Antes de empezar
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-2">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-1 open:bg-white/[0.05]"
              >
                <summary className="cursor-pointer list-none py-3 font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span
                      className="shrink-0 text-white/40 transition group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-white/10 pb-4 pt-3 text-sm leading-relaxed text-white/60">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="mx-auto max-w-6xl px-4 pb-20"
          aria-labelledby="cta-final-heading"
        >
          <Card className="border-white/10 bg-gradient-to-r from-neon-green/10 via-neon-cyan/10 to-neon-pink/10">
            <CardContent className="flex flex-col items-start gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2
                  id="cta-final-heading"
                  className="text-2xl font-semibold text-white"
                >
                  Empieza tu ruta hoy
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/65">
                  Si tu colegio ya trabaja con ENRUTA, regístrate con tu código.
                  Si eres establecimiento, conversemos sobre un piloto.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/registro">
                  <Button size="lg">Comencemos tu ruta</Button>
                </Link>
                <Link href="/descubrir">
                  <Button size="lg" variant="secondary">
                    Probar sin cuenta
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button size="lg" variant="ghost">
                    Contactar ENRUTA
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-2 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/45">
          {icon}
          {label}
        </div>
        <p className="text-xl font-semibold text-white">{value}</p>
        <p className="text-xs leading-relaxed text-white/50">{hint}</p>
      </CardContent>
    </Card>
  );
}

function AudienceCard({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <Card className="card-interactive flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25">
          {icon}
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{body}</p>
        <Link
          href={cta.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-neon-cyan hover:underline"
        >
          {cta.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </CardContent>
    </Card>
  );
}

function PreviewPane({
  eyebrow,
  title,
  body,
  chips,
}: {
  eyebrow: string;
  title: string;
  body: string;
  chips: string[];
}) {
  return (
    <Card className="card-interactive h-full overflow-hidden">
      <div className="border-b border-white/10 bg-black/30 px-4 py-3">
        <div className="mb-3 flex items-center gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="ml-2 text-[11px] text-white/35">{eyebrow}</span>
        </div>
        <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="h-2 w-1/3 rounded bg-neon-cyan/40" />
          <div className="h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-4/5 rounded bg-white/10" />
          <div className="mt-2 flex gap-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-white/55"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <CardContent className="space-y-2 p-5">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/60">{body}</p>
      </CardContent>
    </Card>
  );
}

function ProductPreviewCard() {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl shadow-neon-cyan/10 backdrop-blur sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-cyan/15 text-neon-cyan">
            <BookOpen className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-xs text-white/45">Tu ruta · 3° medio</p>
            <p className="text-sm font-medium text-white">Hola, Sofía</p>
          </div>
        </div>
        <span className="rounded-full border border-neon-green/30 bg-neon-green/10 px-2.5 py-1 text-[11px] font-medium text-neon-green">
          68% avance
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full w-[68%] rounded-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink"
          aria-hidden
        />
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-neon-cyan/25 bg-neon-cyan/10 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neon-cyan">
            Siguiente paso
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            Explorar 3 rutas con afinidad alta
          </p>
          <p className="mt-1 text-xs text-white/55">
            Tu informe está en revisión. Mientras tanto, guarda alternativas y
            anota por qué te interesan.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[11px] text-white/40">Afinidad</p>
            <p className="text-lg font-semibold text-white">84%</p>
            <p className="text-xs text-white/55">Diseño UX · I + A</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[11px] text-white/40">Estado informe</p>
            <p className="text-sm font-semibold text-amber-200">En revisión</p>
            <p className="text-xs text-white/55">Mediación humana</p>
          </div>
        </div>
      </div>
    </div>
  );
}

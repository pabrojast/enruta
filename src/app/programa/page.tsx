import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  CalendarRange,
  Compass,
  FileCheck2,
  FolderKanban,
  HeartHandshake,
  Map,
  Users,
} from "lucide-react";

const pillars = [
  {
    icon: Compass,
    title: "Autoconocimiento progresivo",
    body: "Cuestionarios y actividades por etapa (1° a 4° medio), con guardado parcial. No es un test de un solo intento: el perfil se construye en el tiempo.",
  },
  {
    icon: FileCheck2,
    title: "Informes mediadas por profesionales",
    body: "El sistema genera un borrador; orientación o psicología lo revisa, ajusta y entrega. El estudiante no recibe un PDF “automático” como veredicto.",
  },
  {
    icon: Map,
    title: "Exploración de carreras, oficios y rutas",
    body: "Catálogo con afinidad explicable: por qué aparece cada alternativa y qué dimensiones la empujan. Incluye caminos HC, TP y mixtos.",
  },
  {
    icon: CalendarRange,
    title: "Eventos y experiencias reales",
    body: "Ferias, talleres y actividades con partners e instituciones, conectadas al portafolio del estudiante.",
  },
  {
    icon: FolderKanban,
    title: "Portafolio digital y proyecto de vida",
    body: "Evidencias, reflexiones y un proyecto de vida exportable en PDF hacia 4° medio.",
  },
  {
    icon: HeartHandshake,
    title: "Familia con permisos limitados",
    body: "Apoderados participan sin ver por defecto respuestas sensibles. El apoyo no implica vigilancia.",
  },
  {
    icon: Users,
    title: "Equipo del colegio en el mismo hilo",
    body: "Orientación, psicología, UTP y profesor jefe con vistas y roles acotados. Alertas y avance por curso.",
  },
  {
    icon: BookOpen,
    title: "Seguimiento a 30, 90 y 180 días",
    body: "Después de hitos clave, el proceso no “cierra”: hay revisiones programadas para sostener el plan.",
  },
];

export default function ProgramaPage() {
  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
          Programa
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          El programa ENRUTA
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
          ENRUTA no es solo un test vocacional. Combina tecnología, instrumentos
          de orientación, acompañamiento humano, talleres, experiencias reales,
          participación familiar y seguimiento longitudinal desde 1° a 4° medio —
          adaptable a HC, TP y contextos urbanos o rurales.
        </p>

        <div className="mt-6 rounded-2xl border border-neon-pink/25 bg-neon-pink/5 p-4 text-sm leading-relaxed text-white/75">
          <strong className="text-white">Qué no es:</strong> un horóscopo de
          personalidad, un listado de 200 carreras sin explicación, ni un
          reemplazo del orientador. Es un proceso con compañía y resultados
          orientativos.
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.title} className="card-interactive h-full">
                <CardHeader>
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/25">
                    <Icon className="h-4 w-4 text-neon-cyan" aria-hidden />
                  </div>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-white/60">
                  {p.body}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <section className="mt-12" aria-labelledby="etapas-programa">
          <h2
            id="etapas-programa"
            className="text-xl font-semibold text-white"
          >
            Entregables por etapa
          </h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["1° medio · Conocerme", "Perfil de intereses y autoconocimiento"],
              ["2° medio · Capacidades", "Mapa de habilidades y valores"],
              [
                "3° medio · Explorar",
                "Alternativas guardadas con explicación y eventos",
              ],
              [
                "4° medio · Proyecto de vida",
                "Informe validado, plan de acción y seguimiento",
              ],
            ].map(([title, body], i) => (
              <li
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xs tabular text-white/40">0{i + 1}</p>
                <p className="mt-1 font-medium text-white">{title}</p>
                <p className="mt-1 text-sm text-white/55">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/registro">
            <Button>Comenzar como estudiante</Button>
          </Link>
          <Link href="/colegios">
            <Button variant="secondary">Soy un colegio</Button>
          </Link>
          <Link href="/metodologia">
            <Button variant="ghost">Ver metodología</Button>
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

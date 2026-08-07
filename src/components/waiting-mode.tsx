import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Compass,
  Gamepad2,
  Map,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type WaitingChecklist = {
  savedCount: number;
  savedTarget?: number;
  hasExplored?: boolean;
  hasPlayedGame?: boolean;
  hasPortfolioNote?: boolean;
};

const DEFAULT_TARGET = 3;

/**
 * Rich “waiting mode” while a professional reviews the vocational report.
 * Keeps students active instead of a dead-end banner.
 */
export function WaitingMode({
  variant = "full",
  checklist,
}: {
  variant?: "full" | "compact";
  checklist: WaitingChecklist;
}) {
  const target = checklist.savedTarget ?? DEFAULT_TARGET;
  const savedDone = checklist.savedCount >= target;
  const exploreDone = checklist.hasExplored ?? checklist.savedCount > 0;

  const items = [
    {
      id: "explore",
      done: exploreDone,
      title: "Explorar el catálogo",
      body: "Mira carreras, oficios y rutas. Lee el “por qué” de cada afinidad.",
      href: "/app/explorar",
      cta: "Ir a explorar",
      icon: Map,
    },
    {
      id: "save",
      done: savedDone,
      title: `Guardar ${target} alternativas`,
      body:
        checklist.savedCount === 0
          ? "Elige opciones que te hagan sentido (aunque no estés seguro/a)."
          : `Llevas ${checklist.savedCount} de ${target}. Puedes compararlas después.`,
      href: "/app/explorar",
      cta: savedDone ? "Seguir explorando" : "Guardar alternativas",
      icon: Compass,
    },
    {
      id: "game",
      done: checklist.hasPlayedGame ?? false,
      title: "Probar un juego de exploración",
      body: "Un día en la vida, decisiones o ambientes laborales — sin presión.",
      href: "/app/juegos",
      cta: "Abrir juegos",
      icon: Gamepad2,
    },
    {
      id: "compare",
      done: checklist.savedCount >= 2,
      title: "Comparar lo que guardaste",
      body: "Si ya tienes dos o más, mira en qué se parecen y en qué se diferencian.",
      href: "/app/comparar",
      cta: "Comparar",
      icon: Sparkles,
    },
  ];

  const doneCount = items.filter((i) => i.done).length;

  if (variant === "compact") {
    return (
      <Card className="border-amber-400/25 bg-gradient-to-br from-amber-400/10 to-transparent">
        <CardContent className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-amber-400/30 bg-amber-400/15 text-amber-100">
              Informe en revisión
            </Badge>
            <span className="text-xs text-white/50">
              Mientras esperas: {doneCount}/{items.length} micro-pasos
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            Un profesional de tu colegio revisará el borrador antes de entregártelo.
            No es tiempo muerto: puedes explorar y guardar rutas con explicación.
          </p>
          <ul className="space-y-2">
            {items.slice(0, 3).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-white/80">
                  {item.done ? (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-neon-green"
                      aria-hidden
                    />
                  ) : (
                    <Circle
                      className="h-4 w-4 shrink-0 text-white/35"
                      aria-hidden
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                </span>
                {!item.done ? (
                  <Link href={item.href} className="shrink-0">
                    <Button size="sm" variant="secondary">
                      Ir
                    </Button>
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href="/app/explorar">
            <Button className="w-full" variant="secondary">
              Explorar mientras esperas
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tu informe en revisión</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
          Un profesional de orientación o psicología de tu establecimiento
          revisará el borrador antes de entregártelo completo. Así evitamos un
          “resultado automático” y cuidamos el sentido del proceso.
        </p>
      </div>

      <Card className="border-amber-400/25 bg-gradient-to-br from-amber-400/10 via-transparent to-neon-cyan/5">
        <CardContent className="flex flex-wrap items-center gap-3 p-5">
          <Badge className="border-amber-400/30 bg-amber-400/15 text-amber-100">
            Pendiente de revisión
          </Badge>
          <p className="text-sm text-white/65">
            Tiempo típico: cuando tu colegio revise la bandeja de informes (días
            hábiles del establecimiento, no un reloj de la app).
          </p>
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neon-cyan">
              Mientras esperas
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              Checklist de exploración
            </h2>
          </div>
          <p className="text-sm tabular text-white/45">
            {doneCount} de {items.length} listos
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Card
                  className={`h-full card-interactive ${
                    item.done
                      ? "border-neon-green/25 bg-neon-green/5"
                      : "border-white/10"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/25">
                        <Icon
                          className="h-4 w-4 text-neon-cyan"
                          aria-hidden
                        />
                      </span>
                      {item.done ? (
                        <CheckCircle2
                          className="h-5 w-5 text-neon-green"
                          aria-label="Completado"
                        />
                      ) : (
                        <Circle
                          className="h-5 w-5 text-white/30"
                          aria-label="Pendiente"
                        />
                      )}
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-relaxed text-white/60">
                      {item.body}
                    </p>
                    <Link href={item.href}>
                      <Button
                        size="sm"
                        variant={item.done ? "ghost" : "secondary"}
                        className="w-full sm:w-auto"
                      >
                        {item.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>

      <Card>
        <CardContent className="space-y-2 p-5 text-sm leading-relaxed text-white/60">
          <p className="font-medium text-white">¿Qué verás cuando se entregue?</p>
          <p>
            Un resumen en 30 segundos (fortalezas, rutas y acciones), el mapa de
            intereses y las secciones completas validadas por un profesional. Los
            resultados siguen siendo orientativos: no deciden por ti.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

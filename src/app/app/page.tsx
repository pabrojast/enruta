import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  assessmentResponses,
  events,
  savedAlternatives,
  vocationalReports,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId, hasRequiredConsents } from "@/lib/students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/alert-banner";
import { PageHeader } from "@/components/page-header";
import { WaitingMode } from "@/components/waiting-mode";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Compass,
  FileText,
  Gamepad2,
  Map,
} from "lucide-react";

export default async function StudentDashboard() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const consented = await hasRequiredConsents(row.student.id);
  if (!consented) redirect("/app/consentimiento");

  const [response] = await db
    .select()
    .from(assessmentResponses)
    .where(eq(assessmentResponses.studentId, row.student.id))
    .orderBy(desc(assessmentResponses.startedAt))
    .limit(1);

  const [report] = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.studentId, row.student.id))
    .orderBy(desc(vocationalReports.createdAt))
    .limit(1);

  const saved = await db
    .select()
    .from(savedAlternatives)
    .where(eq(savedAlternatives.studentId, row.student.id));

  const upcoming = await db.select().from(events).limit(3);

  const stage =
    row.student.gradeLevel <= 1
      ? "Etapa 1 · Conocerme"
      : row.student.gradeLevel === 2
        ? "Etapa 2 · Capacidades"
        : row.student.gradeLevel === 3
          ? "Etapa 3 · Explorar"
          : "Etapa 4 · Proyecto de vida";

  const pendingReview =
    report?.status === "pending_review" ||
    report?.status === "generated" ||
    report?.status === "draft" ||
    report?.status === "validated";

  const reportDelivered =
    report?.status === "delivered" || report?.status === "updated";

  let progress = 10;
  if (row.student.profileCompleted) progress += 20;
  if (response?.status === "in_progress") progress += response.progressPct * 0.3;
  if (response?.status === "submitted") progress += 30;
  if (reportDelivered) progress += 25;
  if (saved.length > 0) progress += 15;
  progress = Math.min(100, Math.round(progress));

  const milestones = [
    { t: "Consentimiento", ok: consented },
    { t: "Perfil", ok: row.student.profileCompleted },
    { t: "Cuestionario", ok: response?.status === "submitted" },
    {
      t: "Exploración",
      ok: saved.length >= 1,
      hint: saved.length > 0 ? `${saved.length} guardada(s)` : undefined,
    },
    {
      t: "Informe",
      ok: reportDelivered,
      hint: pendingReview ? "En revisión" : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tu ruta"
        title={`Hola, ${row.user.fullName.split(" ")[0]}`}
        description={`${stage} · ${row.student.gradeLevel}° medio · No tienes que decidir todo hoy.`}
      />

      <Progress value={progress} label="Avance de tu ruta" />

      {!row.student.profileCompleted ? (
        <AlertBanner tone="warn">
          Completa tu perfil para personalizar mejor tu experiencia.{" "}
          <Link
            href="/app/perfil"
            className="font-medium underline underline-offset-2 hover:text-amber-50"
          >
            Ir al perfil
          </Link>
        </AlertBanner>
      ) : null}

      {pendingReview && response?.status === "submitted" ? (
        <WaitingMode
          variant="compact"
          checklist={{
            savedCount: saved.length,
            savedTarget: 3,
            hasExplored: saved.length > 0,
          }}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/10 to-transparent md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Siguiente paso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!row.student.profileCompleted ? (
              <>
                <p className="text-sm text-white/70">
                  Empieza por tu perfil: intereses, fortalezas y contexto. Toma
                  pocos minutos y mejora todo lo que viene después.
                </p>
                <Link href="/app/perfil">
                  <Button className="w-full">Completar perfil</Button>
                </Link>
              </>
            ) : !response || response.status === "in_progress" ? (
              <>
                <p className="text-sm text-white/70">
                  Completa el cuestionario de intereses. Puedes guardar y
                  continuar después — no es un maratón de un solo intento.
                </p>
                {response?.status === "in_progress" ? (
                  <p className="text-xs text-white/45">
                    Avance del cuestionario: {response.progressPct}%
                  </p>
                ) : null}
                <Link href="/app/cuestionarios">
                  <Button className="w-full">Ir al cuestionario</Button>
                </Link>
              </>
            ) : pendingReview ? (
              <>
                <p className="text-sm text-white/70">
                  Tu borrador de informe espera revisión profesional. Hoy
                  conviene explorar y guardar rutas con explicación.
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/app/explorar">
                    <Button className="w-full">Explorar rutas</Button>
                  </Link>
                  <Link href="/app/informe">
                    <Button className="w-full" variant="secondary">
                      Ver checklist de espera
                    </Button>
                  </Link>
                </div>
              </>
            ) : reportDelivered ? (
              <>
                <p className="text-sm text-white/70">
                  Tu informe ya está disponible con un resumen en 30 segundos.
                  Revísalo y cruza con exploración o datos públicos.
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/app/informe">
                    <Button className="w-full">Ver informe</Button>
                  </Link>
                  <Link href="/app/analisis">
                    <Button className="w-full" variant="secondary">
                      Análisis con datos públicos
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-white/70">
                  Sigue explorando y mira cómo se cruzan tus intereses con el
                  mercado laboral y la oferta formativa.
                </p>
                <Link href="/app/analisis">
                  <Button className="w-full" variant="secondary">
                    Ver análisis
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardHeader>
            <CardTitle className="text-base">Estado del informe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-semibold capitalize text-white">
              {reportDelivered
                ? "Entregado"
                : pendingReview
                  ? "En revisión"
                  : report?.status?.replaceAll("_", " ") ?? "Sin informe"}
            </p>
            <p className="text-sm text-white/55">
              Solo ves el informe completo cuando un profesional lo valida y
              entrega.
            </p>
            {report ? (
              <Link
                href="/app/informe"
                className="inline-flex items-center gap-1 text-sm text-neon-cyan hover:underline"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden />
                Ir al informe
              </Link>
            ) : null}
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardHeader>
            <CardTitle className="text-base">Mis alternativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular text-white">
              {saved.length}
            </p>
            <p className="mt-2 text-sm text-white/55">
              Guardadas para comparar y conversar
              {pendingReview && saved.length < 3
                ? ` · meta mientras esperas: 3`
                : "."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/app/explorar">
                <Button size="sm" variant="secondary">
                  Explorar
                </Button>
              </Link>
              <Link href="/app/comparar">
                <Button size="sm" variant="outline">
                  Comparar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions feed */}
      <section aria-labelledby="hoy-heading">
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 id="hoy-heading" className="text-lg font-semibold text-white">
            Ideas para hoy
          </h2>
          <p className="text-xs text-white/40">Sin prisa · elige una</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <QuickLink
            href="/app/explorar"
            icon={<Map className="h-4 w-4 text-neon-cyan" aria-hidden />}
            title="Explorar con el porqué"
            body="Afinidad explicable: carreras, oficios y rutas."
          />
          <QuickLink
            href="/app/juegos"
            icon={<Gamepad2 className="h-4 w-4 text-neon-pink" aria-hidden />}
            title="Jugar un escenario"
            body="Un día en la vida u otras micro-experiencias."
          />
          <QuickLink
            href="/app/autoconocimiento"
            icon={<Compass className="h-4 w-4 text-neon-green" aria-hidden />}
            title="Autoconocimiento"
            body="Reflexiona sin que cuente como “la gran decisión”."
          />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mapa de tu viaje</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {milestones.map((s) => (
            <div
              key={s.t}
              className={`rounded-xl border p-3 ${
                s.ok
                  ? "border-neon-green/30 bg-neon-green/5"
                  : s.hint
                    ? "border-amber-400/25 bg-amber-400/5"
                    : "border-white/10 bg-black/20"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                {s.ok ? (
                  <CheckCircle2
                    className="h-4 w-4 text-neon-green"
                    aria-hidden
                  />
                ) : (
                  <Circle className="h-4 w-4 text-white/35" aria-hidden />
                )}
                <p className="text-sm font-medium text-white">{s.t}</p>
              </div>
              <p className="text-xs text-white/50">
                {s.ok ? "Listo" : s.hint ? s.hint : "Pendiente"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Próximos eventos</CardTitle>
          <Link
            href="/app/eventos"
            className="text-xs text-neon-cyan hover:underline"
          >
            Ver todos
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcoming.length === 0 ? (
            <p className="text-sm text-white/50">
              Aún no hay eventos. Cuando tu colegio publique uno, aparecerá aquí.
            </p>
          ) : (
            upcoming.map((e) => (
              <div
                key={e.id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {e.title}
                  </p>
                  <p className="text-xs text-white/50">
                    {new Intl.DateTimeFormat("es-CL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(e.startsAt))}
                  </p>
                </div>
                <Link href="/app/eventos" className="shrink-0">
                  <Button size="sm" variant="secondary">
                    Ver
                  </Button>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  body,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="card-interactive h-full transition-colors group-hover:border-neon-cyan/30">
        <CardContent className="flex h-full flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/25">
              {icon}
            </span>
            <ArrowRight
              className="h-4 w-4 text-white/30 transition group-hover:text-neon-cyan"
              aria-hidden
            />
          </div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-xs leading-relaxed text-white/55">{body}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

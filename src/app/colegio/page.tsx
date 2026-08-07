import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  alerts,
  assessmentResponses,
  courses,
  eventRegistrations,
  students,
  vocationalReports,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { loadSchoolCourseStats } from "@/lib/caseload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default async function SchoolDashboard() {
  const session = await requireRole([
    "school_admin",
    "head_teacher",
    "enruta_admin",
  ]);

  const schoolId = session.user.schoolId;
  const studentRows = schoolId
    ? await db.select().from(students).where(eq(students.schoolId, schoolId))
    : await db.select().from(students);

  const courseRows = schoolId
    ? await db.select().from(courses).where(eq(courses.schoolId, schoolId))
    : await db.select().from(courses);

  const ids = studentRows.map((s) => s.id);
  let submitted = 0;
  let delivered = 0;
  let pendingReview = 0;
  let openAlerts = 0;
  let registrations = 0;
  let profileDone = 0;

  for (const s of studentRows) {
    if (s.profileCompleted) profileDone += 1;
  }

  if (ids.length > 0) {
    const responses = await db.select().from(assessmentResponses);
    const byStudentSubmitted = new Set(
      responses
        .filter((r) => ids.includes(r.studentId) && r.status === "submitted")
        .map((r) => r.studentId),
    );
    submitted = byStudentSubmitted.size;

    const reports = await db.select().from(vocationalReports);
    const deliveredSet = new Set<string>();
    const pendingSet = new Set<string>();
    for (const r of reports) {
      if (!ids.includes(r.studentId)) continue;
      if (r.status === "delivered" || r.status === "updated") {
        deliveredSet.add(r.studentId);
      } else if (
        r.status === "pending_review" ||
        r.status === "generated" ||
        r.status === "validated"
      ) {
        pendingSet.add(r.studentId);
      }
    }
    delivered = deliveredSet.size;
    pendingReview = pendingSet.size;

    const regs = await db.select().from(eventRegistrations);
    registrations = regs.filter((r) => ids.includes(r.studentId)).length;
  }

  if (schoolId) {
    const al = await db
      .select()
      .from(alerts)
      .where(eq(alerts.schoolId, schoolId));
    openAlerts = al.filter(
      (a) => a.status === "open" && a.level !== "restricted",
    ).length;
  }

  const total = studentRows.length || 1;
  const courseStats = await loadSchoolCourseStats(schoolId ?? null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Indicadores del establecimiento</h1>
          <p className="text-white/60">
            Solo información agregada o de participación. Sin respuestas de
            cuestionarios ni notas psicológicas.
          </p>
        </div>
        <a href="/api/colegio/export">
          <Button variant="outline">Descargar CSV</Button>
        </a>
      </div>

      <AlertBanner>
        Usa estos indicadores para PEI/PME y seguimiento de la ruta 1°–4° medio.
        El detalle individual lo trabaja orientación en el espacio profesional.
      </AlertBanner>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Estudiantes"
          value={String(studentRows.length)}
          hint={`${courseRows.length} cursos activos`}
        />
        <StatCard
          title="Perfil completo"
          value={`${Math.round((profileDone / total) * 100)}%`}
          hint={`${profileDone} de ${studentRows.length}`}
        />
        <StatCard
          title="Cuestionarios enviados"
          value={`${Math.round((submitted / total) * 100)}%`}
          hint={`${submitted} de ${studentRows.length}`}
        />
        <StatCard
          title="Informes en revisión"
          value={String(pendingReview)}
          hint="Esperan mediación profesional"
        />
        <StatCard
          title="Informes entregados"
          value={`${Math.round((delivered / total) * 100)}%`}
          hint={`${delivered} de ${studentRows.length}`}
        />
        <StatCard
          title="Alertas abiertas"
          value={String(openAlerts)}
          hint={`Inscripciones a eventos: ${registrations}`}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">
          Avance por curso / etapa
        </h2>
        <p className="text-sm text-white/50">
          Embudo agregado: perfil → cuestionario → informe entregado. Sirve para
          conversar con UTP y orientación sin exponer datos sensibles.
        </p>
        <div className="grid gap-3">
          {courseStats.map((c) => {
            const t = c.total || 1;
            return (
              <Card key={c.courseId ?? c.courseName}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base">
                      {c.courseName}{" "}
                      <span className="font-normal text-white/45">
                        · {c.gradeLevel}° medio
                      </span>
                    </CardTitle>
                    <span className="text-xs tabular text-white/45">
                      {c.total} estudiante{c.total === 1 ? "" : "s"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MiniBar
                    label="Perfil"
                    value={c.profileDone}
                    total={c.total}
                    pct={Math.round((c.profileDone / t) * 100)}
                  />
                  <MiniBar
                    label="Cuestionario"
                    value={c.assessmentSubmitted}
                    total={c.total}
                    pct={Math.round((c.assessmentSubmitted / t) * 100)}
                  />
                  <MiniBar
                    label="Informe entregado"
                    value={c.reportDelivered}
                    total={c.total}
                    pct={Math.round((c.reportDelivered / t) * 100)}
                  />
                  {c.reportPending > 0 ? (
                    <p className="text-xs text-amber-100/80">
                      {c.reportPending} informe
                      {c.reportPending === 1 ? "" : "s"} pendiente
                      {c.reportPending === 1 ? "" : "s"} de revisión
                      profesional
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
          {courseStats.length === 0 ? (
            <p className="text-sm text-white/50">
              Aún no hay estudiantes para mostrar avance por curso.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular">{value}</p>
        <p className="mt-1 text-xs text-white/50">{hint}</p>
      </CardContent>
    </Card>
  );
}

function MiniBar({
  label,
  value,
  total,
  pct,
}: {
  label: string;
  value: number;
  total: number;
  pct: number;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/55">
        <span>{label}</span>
        <span className="tabular">
          {value}/{total} · {pct}%
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { ensureStudentFollowUps } from "@/app/actions/misc";
import { FollowUpForm } from "./follow-up-form";
import { AlertBanner } from "@/components/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default async function SeguimientosPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const items = await ensureStudentFollowUps(row.student.id, session.user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        eyebrow="Seguimiento longitudinal"
        title="Seguimientos"
        description="Hitos a 30, 90 y 180 días para actualizar decisiones, dificultades y próximos pasos."
      />
      <AlertBanner>
        Puedes responder un seguimiento antes de la fecha si ya viviste cambios
        importantes. Tu camino puede cambiar.
      </AlertBanner>
      <div className="space-y-5">
        {items
          .sort((a, b) => a.dayOffset - b.dayOffset)
          .map((fu) =>
            fu.status === "completed" ? (
              <Card key={fu.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Seguimiento a {fu.dayOffset} días
                    </CardTitle>
                    <p className="text-xs text-white/45">
                      Completado:{" "}
                      {fu.completedAt
                        ? new Intl.DateTimeFormat("es-CL").format(
                            new Date(fu.completedAt),
                          )
                        : "—"}
                    </p>
                  </div>
                  <Badge className="border-neon-green/40 text-neon-green">
                    completado
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/70">
                  <p>
                    <strong className="text-white/90">Periodo:</strong>{" "}
                    {fu.whatDidAfter}
                  </p>
                  <p>
                    <strong className="text-white/90">Decisión:</strong>{" "}
                    {fu.decisionChanged}
                  </p>
                  <p>
                    <strong className="text-white/90">Nuevas alternativas:</strong>{" "}
                    {fu.newAlternatives}
                  </p>
                  <p>
                    <strong className="text-white/90">Dificultades:</strong>{" "}
                    {fu.difficulties}
                  </p>
                  <p>
                    <strong className="text-white/90">Apoyo:</strong>{" "}
                    {fu.supportNeeded}
                  </p>
                  <p>
                    <strong className="text-white/90">Próximo paso:</strong>{" "}
                    {fu.nextStep}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div key={fu.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2 px-1">
                  <p className="text-sm text-white/70">
                    Seguimiento a{" "}
                    <strong className="text-white">{fu.dayOffset} días</strong>
                    {fu.dueAt
                      ? ` · programado ${new Intl.DateTimeFormat("es-CL").format(new Date(fu.dueAt))}`
                      : ""}
                  </p>
                  <Badge>pendiente</Badge>
                </div>
                <FollowUpForm followUpId={fu.id} />
              </div>
            ),
          )}
      </div>
    </div>
  );
}

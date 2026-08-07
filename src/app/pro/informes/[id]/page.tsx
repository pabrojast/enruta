import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  students,
  users,
  vocationalReports,
  type ReportContent,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { DimensionChart } from "@/components/dimension-chart";
import { AlertBanner } from "@/components/alert-banner";
import { MeetingGuide } from "@/components/meeting-guide";
import { buildMeetingTemplate } from "@/lib/meeting-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "./review-form";

export default async function ReviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["counselor", "psychologist", "enruta_admin"]);
  const { id } = await params;

  const [report] = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.id, id))
    .limit(1);
  if (!report) notFound();

  const [row] = await db
    .select({ student: students, user: users })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(students.id, report.studentId))
    .limit(1);

  const content = report.content as ReportContent | null;
  const dims = (report.dimensionsSnapshot as Record<string, number>) ?? {};
  const firstName = row?.user.fullName.split(" ")[0] ?? "";
  const isPending =
    report.status === "pending_review" || report.status === "generated";

  const guide = buildMeetingTemplate({
    studentFirstName: firstName,
    gradeLevel: row?.student.gradeLevel ?? 3,
    caseloadStatus: isPending
      ? "pending_review"
      : report.status === "delivered" || report.status === "updated"
        ? "delivered"
        : "other",
    reportContent: content,
    interestsSummary: row?.student.interestsSummary,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge className="mb-2 capitalize">
            {report.status.replaceAll("_", " ")}
          </Badge>
          <h1 className="text-2xl font-bold">
            Revisión de informe · {row?.user.fullName}
          </h1>
          <p className="text-white/60">
            Valida el lenguaje orientativo y completa notas profesionales antes
            de entregar al estudiante.
          </p>
        </div>
        {row ? (
          <Link href={`/pro/estudiantes/${row.student.id}`}>
            <Button variant="secondary" size="sm">
              Ver ficha
            </Button>
          </Link>
        ) : null}
      </div>

      <AlertBanner tone="warn">
        Evita frases deterministas (“debes estudiar…”, “no eres apto…”).
        Prefiere “podrías explorar…” y invita a conversar. Al entregar se envía
        notificación in-app y correo al estudiante (outbox; SMTP si está
        configurado).
      </AlertBanner>

      <MeetingGuide
        title={guide.title}
        durationLabel={guide.durationLabel}
        blocks={guide.blocks}
        closing={guide.closing}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dimensiones</CardTitle>
        </CardHeader>
        <CardContent>
          <DimensionChart dimensions={dims} />
        </CardContent>
      </Card>

      {content ? (
        <div className="grid gap-3">
          {[
            ["Introducción", content.introduction],
            ["Perfil general", content.generalProfile],
            ["Intereses", content.interests],
            ["Próximos pasos", content.nextSteps.join(" · ")],
            ["Disclaimer", content.disclaimer],
          ].map(([t, b]) => (
            <Card key={t as string}>
              <CardHeader>
                <CardTitle className="text-base">{t as string}</CardTitle>
              </CardHeader>
              <CardContent className="whitespace-pre-line text-sm text-white/70">
                {b as string}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {isPending ? (
        <ReviewForm reportId={report.id} />
      ) : (
        <AlertBanner tone="success">
          Este informe ya fue procesado ({report.status}).
          {report.reviewNotes ? ` Notas: ${report.reviewNotes}` : null}
        </AlertBanner>
      )}
    </div>
  );
}

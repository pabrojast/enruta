import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  alerts,
  assessmentResults,
  students,
  users,
  vocationalReports,
  type ReportContent,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { DimensionChart } from "@/components/dimension-chart";
import { MeetingGuide } from "@/components/meeting-guide";
import { buildMeetingTemplate } from "@/lib/meeting-template";
import type { CaseloadStatus } from "@/lib/caseload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentFilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["counselor", "psychologist", "enruta_admin"]);
  const { id } = await params;

  const [row] = await db
    .select({ student: students, user: users })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(students.id, id))
    .limit(1);
  if (!row) notFound();

  const [result] = await db
    .select()
    .from(assessmentResults)
    .where(eq(assessmentResults.studentId, id))
    .orderBy(desc(assessmentResults.createdAt))
    .limit(1);

  const [report] = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.studentId, id))
    .orderBy(desc(vocationalReports.createdAt))
    .limit(1);

  const studentAlerts = await db
    .select()
    .from(alerts)
    .where(eq(alerts.studentId, id));

  let caseloadStatus: CaseloadStatus = "no_assessment";
  if (report?.status === "delivered" || report?.status === "updated") {
    caseloadStatus = "delivered";
  } else if (
    report?.status === "pending_review" ||
    report?.status === "generated" ||
    report?.status === "validated"
  ) {
    caseloadStatus = "pending_review";
  } else if (result) {
    caseloadStatus = "other";
  }

  const firstName = row.user.fullName.split(" ")[0] ?? "";
  const guide = buildMeetingTemplate({
    studentFirstName: firstName,
    gradeLevel: row.student.gradeLevel,
    caseloadStatus,
    reportContent: (report?.content as ReportContent | null) ?? null,
    interestsSummary: row.student.interestsSummary,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{row.user.fullName}</h1>
          <p className="text-white/60">
            {row.student.gradeLevel}° medio · {row.user.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {report ? (
            <Link href={`/pro/informes/${report.id}`}>
              <Button>Revisar informe</Button>
            </Link>
          ) : null}
          <Link href="/pro/estudiantes">
            <Button variant="secondary">Volver al caseload</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-white/70">
            <p>
              <strong>Intereses:</strong>{" "}
              {row.student.interestsSummary || "—"}
            </p>
            <p>
              <strong>Fortalezas:</strong>{" "}
              {row.student.strengthsSummary || "—"}
            </p>
            <p>
              <strong>Expectativas:</strong>{" "}
              {row.student.expectations || "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informe</CardTitle>
          </CardHeader>
          <CardContent>
            {report ? (
              <Badge className="capitalize">
                {report.status.replaceAll("_", " ")}
              </Badge>
            ) : (
              <p className="text-sm text-white/50">Sin informe</p>
            )}
          </CardContent>
        </Card>
      </div>

      <MeetingGuide
        title={guide.title}
        durationLabel={guide.durationLabel}
        blocks={guide.blocks}
        closing={guide.closing}
      />

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dimensiones</CardTitle>
          </CardHeader>
          <CardContent>
            <DimensionChart
              dimensions={result.dimensions as Record<string, number>}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {studentAlerts.length === 0 ? (
            <p className="text-sm text-white/50">Sin alertas</p>
          ) : (
            studentAlerts.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm"
              >
                <p className="font-medium">{a.title}</p>
                <p className="text-white/50">
                  {a.level} · {a.status}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Idempotent: ensures Sofía has a pending_review report and Benjamín a delivered one.
 * Faster than full reseed when demo data already exists.
 *
 * Usage: pnpm exec tsx scripts/ensure-demo-reports.ts
 */
import "dotenv/config";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, client } from "../src/db";
import {
  alerts,
  assessmentAnswers,
  assessmentResponses,
  assessmentResults,
  assessmentVersions,
  questions,
  students,
  users,
  vocationalReports,
} from "../src/db/schema";
import { buildReportContent } from "../src/lib/reports";

async function ensureStudentReport(opts: {
  email: string;
  dimensions: Record<string, number>;
  topDimensions: string[];
  reportStatus: "pending_review" | "delivered";
  reviewerEmail?: string;
}) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, opts.email))
    .limit(1);
  if (!user) {
    console.warn(`skip: user ${opts.email} not found`);
    return;
  }
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, user.id))
    .limit(1);
  if (!student) {
    console.warn(`skip: student for ${opts.email} not found`);
    return;
  }

  const existing = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.studentId, student.id))
    .orderBy(desc(vocationalReports.createdAt))
    .limit(1);

  if (existing[0]) {
    if (
      existing[0].status === opts.reportStatus &&
      existing[0].content
    ) {
      console.log(`ok: ${opts.email} already has ${opts.reportStatus} report`);
      return;
    }
    // Update existing to desired demo state
    const content =
      (existing[0].content as ReturnType<typeof buildReportContent> | null) ??
      buildReportContent({
        studentName: user.fullName,
        gradeLevel: student.gradeLevel,
        dimensions: opts.dimensions,
        topDimensions: opts.topDimensions,
        interestsSummary: student.interestsSummary,
        strengthsSummary: student.strengthsSummary,
      });

    let reviewedBy: string | null = existing[0].reviewedBy;
    if (opts.reportStatus === "delivered" && opts.reviewerEmail) {
      const [rev] = await db
        .select()
        .from(users)
        .where(eq(users.email, opts.reviewerEmail))
        .limit(1);
      reviewedBy = rev?.id ?? reviewedBy;
    }

    await db
      .update(vocationalReports)
      .set({
        status: opts.reportStatus,
        content,
        dimensionsSnapshot: opts.dimensions,
        reviewedBy,
        reviewNotes:
          opts.reportStatus === "delivered"
            ? "Validado (ensure-demo-reports)."
            : null,
        deliveredAt: opts.reportStatus === "delivered" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(vocationalReports.id, existing[0].id));

    if (opts.reportStatus === "pending_review") {
      const open = await db
        .select()
        .from(alerts)
        .where(
          and(
            eq(alerts.studentId, student.id),
            eq(alerts.type, "report_pending_review"),
            eq(alerts.status, "open"),
          ),
        )
        .limit(1);
      if (!open[0]) {
        await db.insert(alerts).values({
          schoolId: student.schoolId,
          studentId: student.id,
          level: "follow_up",
          type: "report_pending_review",
          title: "Informe pendiente de revisión",
          description: `El informe de ${user.fullName} está listo para validación profesional.`,
          status: "open",
        });
      }
    }
    console.log(`updated: ${opts.email} → ${opts.reportStatus}`);
    return;
  }

  // Create full chain: response + result + report
  const [version] = await db
    .select()
    .from(assessmentVersions)
    .where(eq(assessmentVersions.isActive, true))
    .limit(1);
  if (!version) {
    console.warn("skip: no active assessment version — run full seed");
    return;
  }

  const qs = await db.select().from(questions).orderBy(asc(questions.orderIndex));
  const [response] = await db
    .insert(assessmentResponses)
    .values({
      versionId: version.id,
      studentId: student.id,
      status: "submitted",
      progressPct: 100,
      submittedAt: new Date(),
    })
    .returning();

  for (const q of qs.slice(0, 18)) {
    const dim =
      (q.config as { primaryDimension?: string } | null)?.primaryDimension ??
      "S";
    const value = opts.topDimensions.includes(dim) ? "5" : "3";
    await db.insert(assessmentAnswers).values({
      responseId: response.id,
      questionId: q.id,
      value,
    });
  }

  const [result] = await db
    .insert(assessmentResults)
    .values({
      responseId: response.id,
      studentId: student.id,
      dimensions: opts.dimensions,
      topDimensions: opts.topDimensions,
      summary: `Perfil demo ${opts.topDimensions.join(", ")}`,
      flags: [],
    })
    .returning();

  const content = buildReportContent({
    studentName: user.fullName,
    gradeLevel: student.gradeLevel,
    dimensions: opts.dimensions,
    topDimensions: opts.topDimensions,
    interestsSummary: student.interestsSummary,
    strengthsSummary: student.strengthsSummary,
  });

  let reviewedBy: string | null = null;
  if (opts.reportStatus === "delivered" && opts.reviewerEmail) {
    const [rev] = await db
      .select()
      .from(users)
      .where(eq(users.email, opts.reviewerEmail))
      .limit(1);
    reviewedBy = rev?.id ?? null;
  }

  await db.insert(vocationalReports).values({
    studentId: student.id,
    schoolId: student.schoolId,
    resultId: result.id,
    status: opts.reportStatus,
    content,
    dimensionsSnapshot: opts.dimensions,
    generatedBy: "system",
    reviewedBy,
    reviewNotes:
      opts.reportStatus === "delivered" ? "Validado (ensure-demo-reports)." : null,
    deliveredAt: opts.reportStatus === "delivered" ? new Date() : null,
  });

  if (opts.reportStatus === "pending_review") {
    await db.insert(alerts).values({
      schoolId: student.schoolId,
      studentId: student.id,
      level: "follow_up",
      type: "report_pending_review",
      title: "Informe pendiente de revisión",
      description: `El informe de ${user.fullName} está listo para validación profesional.`,
      status: "open",
    });
  }

  console.log(`created: ${opts.email} → ${opts.reportStatus}`);
}

async function main() {
  console.log("ensure-demo-reports…");
  await ensureStudentReport({
    email: "sofia.estudiante@demo.cl",
    dimensions: { R: 32, I: 78, A: 55, S: 96, E: 42, C: 40 },
    topDimensions: ["S", "I", "A"],
    reportStatus: "pending_review",
  });
  await ensureStudentReport({
    email: "benjamin.estudiante@demo.cl",
    dimensions: { R: 45, I: 62, A: 28, S: 40, E: 88, C: 70 },
    topDimensions: ["E", "C", "I"],
    reportStatus: "delivered",
    reviewerEmail: "orientador@losandes.cl",
  });
  console.log("done");
  await client.end({ timeout: 2 });
}

main().catch(async (e) => {
  console.error(e);
  await client.end({ timeout: 1 }).catch(() => {});
  process.exit(1);
});

import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  alerts,
  assessmentResponses,
  courses,
  students,
  users,
  vocationalReports,
} from "@/db/schema";
import { getAssignedStudents } from "@/app/actions/professional";

export type CaseloadStatus =
  | "no_assessment"
  | "in_progress"
  | "pending_review"
  | "delivered"
  | "other";

export type CaseloadRow = {
  studentId: string;
  fullName: string;
  email: string;
  gradeLevel: number;
  courseId: string | null;
  courseName: string | null;
  profileCompleted: boolean;
  assessmentStatus: "none" | "in_progress" | "submitted";
  reportId: string | null;
  reportStatus: string | null;
  openAlerts: number;
  priorityAlerts: number;
  caseloadStatus: CaseloadStatus;
  needsAttention: boolean;
  updatedAt: Date | null;
};

function deriveStatus(
  assessmentStatus: CaseloadRow["assessmentStatus"],
  reportStatus: string | null,
): CaseloadStatus {
  if (reportStatus === "delivered" || reportStatus === "updated") {
    return "delivered";
  }
  if (
    reportStatus === "pending_review" ||
    reportStatus === "generated" ||
    reportStatus === "validated"
  ) {
    return "pending_review";
  }
  if (assessmentStatus === "in_progress") return "in_progress";
  if (assessmentStatus === "none") return "no_assessment";
  return "other";
}

/**
 * Builds a caseload list for counselors: assigned students (or all if admin)
 * with latest assessment/report and open alert counts.
 */
export async function loadCaseload(opts: {
  userId: string;
  role: string;
  schoolId?: string | null;
}): Promise<CaseloadRow[]> {
  let base: { student: typeof students.$inferSelect; user: typeof users.$inferSelect }[];

  if (opts.role === "enruta_admin") {
    base = await db
      .select({ student: students, user: users })
      .from(students)
      .innerJoin(users, eq(students.userId, users.id));
  } else {
    base = await getAssignedStudents(opts.userId);
    if (base.length === 0 && opts.schoolId) {
      // Fallback: all school students if no assignments yet (demo-friendly)
      base = await db
        .select({ student: students, user: users })
        .from(students)
        .innerJoin(users, eq(students.userId, users.id))
        .where(eq(students.schoolId, opts.schoolId));
    }
  }

  if (base.length === 0) return [];

  const studentIds = base.map((b) => b.student.id);
  const courseIds = [
    ...new Set(
      base.map((b) => b.student.courseId).filter((id): id is string => Boolean(id)),
    ),
  ];

  const courseRows =
    courseIds.length > 0
      ? await db.select().from(courses).where(inArray(courses.id, courseIds))
      : [];
  const courseMap = new Map(courseRows.map((c) => [c.id, c.name]));

  const allResponses = await db
    .select()
    .from(assessmentResponses)
    .where(inArray(assessmentResponses.studentId, studentIds))
    .orderBy(desc(assessmentResponses.startedAt));

  const latestResponse = new Map<string, (typeof allResponses)[0]>();
  for (const r of allResponses) {
    if (!latestResponse.has(r.studentId)) latestResponse.set(r.studentId, r);
  }

  const allReports = await db
    .select()
    .from(vocationalReports)
    .where(inArray(vocationalReports.studentId, studentIds))
    .orderBy(desc(vocationalReports.createdAt));

  const latestReport = new Map<string, (typeof allReports)[0]>();
  for (const r of allReports) {
    if (!latestReport.has(r.studentId)) latestReport.set(r.studentId, r);
  }

  const openAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        inArray(alerts.studentId, studentIds),
        eq(alerts.status, "open"),
      ),
    );

  const alertCount = new Map<string, { open: number; priority: number }>();
  for (const a of openAlerts) {
    if (!a.studentId) continue;
    // psychologists/admin see restricted; counselors still count non-restricted for badge
    const cur = alertCount.get(a.studentId) ?? { open: 0, priority: 0 };
    cur.open += 1;
    if (a.level === "priority" || a.level === "follow_up") cur.priority += 1;
    alertCount.set(a.studentId, cur);
  }

  return base
    .map(({ student, user }) => {
      const resp = latestResponse.get(student.id);
      const report = latestReport.get(student.id);
      const assessmentStatus: CaseloadRow["assessmentStatus"] = !resp
        ? "none"
        : resp.status === "submitted"
          ? "submitted"
          : "in_progress";
      const reportStatus = report?.status ?? null;
      const caseloadStatus = deriveStatus(assessmentStatus, reportStatus);
      const counts = alertCount.get(student.id) ?? { open: 0, priority: 0 };
      const needsAttention =
        caseloadStatus === "pending_review" ||
        counts.priority > 0 ||
        (!student.profileCompleted && assessmentStatus === "none");

      return {
        studentId: student.id,
        fullName: user.fullName,
        email: user.email,
        gradeLevel: student.gradeLevel,
        courseId: student.courseId,
        courseName: student.courseId
          ? courseMap.get(student.courseId) ?? null
          : null,
        profileCompleted: student.profileCompleted,
        assessmentStatus,
        reportId: report?.id ?? null,
        reportStatus,
        openAlerts: counts.open,
        priorityAlerts: counts.priority,
        caseloadStatus,
        needsAttention,
        updatedAt: report?.updatedAt ?? resp?.updatedAt ?? student.updatedAt,
      } satisfies CaseloadRow;
    })
    .sort((a, b) => {
      // Needs attention first, then pending review, then name
      if (a.needsAttention !== b.needsAttention) {
        return a.needsAttention ? -1 : 1;
      }
      if (a.caseloadStatus === "pending_review" && b.caseloadStatus !== "pending_review") {
        return -1;
      }
      if (b.caseloadStatus === "pending_review" && a.caseloadStatus !== "pending_review") {
        return 1;
      }
      return a.fullName.localeCompare(b.fullName, "es");
    });
}

export function statusLabel(status: CaseloadStatus): string {
  switch (status) {
    case "no_assessment":
      return "Sin cuestionario";
    case "in_progress":
      return "Cuestionario en curso";
    case "pending_review":
      return "Informe por revisar";
    case "delivered":
      return "Informe entregado";
    default:
      return "En proceso";
  }
}

export function reportStatusLabel(status: string | null): string {
  if (!status) return "Sin informe";
  return status.replaceAll("_", " ");
}

export type SchoolCourseStats = {
  courseId: string | null;
  courseName: string;
  gradeLevel: number;
  total: number;
  profileDone: number;
  assessmentSubmitted: number;
  reportPending: number;
  reportDelivered: number;
  exploring: number; // has saved alternatives — optional, may skip
};

export async function loadSchoolCourseStats(schoolId: string | null) {
  const studentRows = schoolId
    ? await db.select().from(students).where(eq(students.schoolId, schoolId))
    : await db.select().from(students);

  const courseRows = schoolId
    ? await db.select().from(courses).where(eq(courses.schoolId, schoolId))
    : await db.select().from(courses);

  const courseMap = new Map(courseRows.map((c) => [c.id, c]));
  const studentIds = studentRows.map((s) => s.id);

  const submittedSet = new Set<string>();
  const pendingSet = new Set<string>();
  const deliveredSet = new Set<string>();

  if (studentIds.length > 0) {
    const responses = await db
      .select()
      .from(assessmentResponses)
      .where(inArray(assessmentResponses.studentId, studentIds));
    for (const r of responses) {
      if (r.status === "submitted") submittedSet.add(r.studentId);
    }

    const reports = await db
      .select()
      .from(vocationalReports)
      .where(inArray(vocationalReports.studentId, studentIds));
    for (const r of reports) {
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
  }

  type Acc = SchoolCourseStats;
  const byKey = new Map<string, Acc>();

  for (const s of studentRows) {
    const key = s.courseId ?? `grade-${s.gradeLevel}`;
    const course = s.courseId ? courseMap.get(s.courseId) : null;
    let row = byKey.get(key);
    if (!row) {
      row = {
        courseId: s.courseId,
        courseName: course?.name ?? `${s.gradeLevel}° medio (sin curso)`,
        gradeLevel: course?.gradeLevel ?? s.gradeLevel,
        total: 0,
        profileDone: 0,
        assessmentSubmitted: 0,
        reportPending: 0,
        reportDelivered: 0,
        exploring: 0,
      };
      byKey.set(key, row);
    }
    row.total += 1;
    if (s.profileCompleted) row.profileDone += 1;
    if (submittedSet.has(s.id)) row.assessmentSubmitted += 1;
    if (pendingSet.has(s.id)) row.reportPending += 1;
    if (deliveredSet.has(s.id)) row.reportDelivered += 1;
  }

  return [...byKey.values()].sort(
    (a, b) => a.gradeLevel - b.gradeLevel || a.courseName.localeCompare(b.courseName, "es"),
  );
}

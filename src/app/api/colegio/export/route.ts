import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  alerts,
  assessmentResponses,
  courses,
  eventRegistrations,
  students,
  users,
  vocationalReports,
} from "@/db/schema";

export async function GET() {
  const session = await auth();
  if (
    !session?.user ||
    !["school_admin", "head_teacher", "enruta_admin"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schoolId = session.user.schoolId;
  const studentRows = schoolId
    ? await db
        .select({ student: students, user: users })
        .from(students)
        .innerJoin(users, eq(students.userId, users.id))
        .where(eq(students.schoolId, schoolId))
    : await db
        .select({ student: students, user: users })
        .from(students)
        .innerJoin(users, eq(students.userId, users.id));

  const courseRows = schoolId
    ? await db.select().from(courses).where(eq(courses.schoolId, schoolId))
    : await db.select().from(courses);
  const courseMap = new Map(courseRows.map((c) => [c.id, c.name]));

  const lines = [
    [
      "nombre",
      "email",
      "curso",
      "nivel",
      "perfil_completo",
      "cuestionario",
      "informe",
      "inscripciones_eventos",
    ].join(","),
  ];

  for (const { student, user } of studentRows) {
    const res = await db
      .select()
      .from(assessmentResponses)
      .where(eq(assessmentResponses.studentId, student.id));
    const submitted = res.some((r) => r.status === "submitted")
      ? "completado"
      : res.length
        ? "en_progreso"
        : "sin_iniciar";
    const reps = await db
      .select()
      .from(vocationalReports)
      .where(eq(vocationalReports.studentId, student.id));
    const informe = reps[0]?.status ?? "sin_informe";
    const regs = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.studentId, student.id));

    lines.push(
      [
        csv(user.fullName),
        csv(user.email),
        csv(student.courseId ? courseMap.get(student.courseId) ?? "" : ""),
        student.gradeLevel,
        student.profileCompleted ? "si" : "no",
        submitted,
        informe,
        regs.length,
      ].join(","),
    );
  }

  // Resumen agregado al final
  const openAlerts = schoolId
    ? (
        await db.select().from(alerts).where(eq(alerts.schoolId, schoolId))
      ).filter((a) => a.status === "open" && a.level !== "restricted").length
    : 0;
  lines.push("");
  lines.push(`# resumen_estudiantes,${studentRows.length}`);
  lines.push(`# resumen_alertas_abiertas_no_restringidas,${openAlerts}`);
  lines.push(
    "# nota,Export agregado sin respuestas de cuestionarios ni notas psicologicas",
  );

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enruta-indicadores-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function csv(v: string) {
  const s = String(v ?? "").replaceAll('"', '""');
  return `"${s}"`;
}

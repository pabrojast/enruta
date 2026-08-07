import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { vocationalReports, type ReportContent } from "@/db/schema";
import { buildTextPdf } from "@/lib/pdf";
import { getStudentByUserId } from "@/lib/students";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let studentId: string | null = null;
  let studentName = session.user.name || "Estudiante";

  if (session.user.role === "student") {
    const row = await getStudentByUserId(session.user.id);
    if (!row) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    studentId = row.student.id;
    studentName = row.user.fullName;
  } else {
    return NextResponse.json(
      { error: "Usa el PDF desde la ficha del estudiante o cuenta estudiante" },
      { status: 400 },
    );
  }

  const [report] = await db
    .select()
    .from(vocationalReports)
    .where(eq(vocationalReports.studentId, studentId))
    .orderBy(desc(vocationalReports.createdAt))
    .limit(1);

  if (!report || !["delivered", "updated"].includes(report.status)) {
    return NextResponse.json(
      { error: "Informe no disponible para descarga" },
      { status: 404 },
    );
  }

  const c = report.content as ReportContent;
  const bytes = await buildTextPdf({
    title: "Informe vocacional ENRUTA",
    subtitle: `${studentName} · Estado: ${report.status}`,
    sections: [
      { heading: "Introducción", body: c.introduction },
      { heading: "Resumen del proceso", body: c.processSummary },
      { heading: "Perfil general", body: c.generalProfile },
      { heading: "Intereses", body: c.interests },
      { heading: "Habilidades", body: c.skills },
      { heading: "Valores", body: c.values },
      { heading: "Fortalezas", body: c.strengths },
      { heading: "Aspectos a explorar", body: c.toExplore },
      { heading: "Rutas formativas", body: c.routes },
      { heading: "Oficios y áreas", body: c.trades },
      { heading: "Actividades recomendadas", body: c.activities },
      {
        heading: "Preguntas para reflexionar",
        body: c.reflectionQuestions.join("\n"),
      },
      { heading: "Próximos pasos", body: c.nextSteps.join("\n") },
      { heading: "Plan de acción preliminar", body: c.actionPlan },
      { heading: "Advertencia", body: c.disclaimer },
    ],
    footer:
      "Documento orientativo. No constituye diagnóstico psicológico ni decisión definitiva.",
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="enruta-informe.pdf"`,
    },
  });
}


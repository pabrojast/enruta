import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { lifeProjects } from "@/db/schema";
import { buildTextPdf } from "@/lib/pdf";
import { getStudentByUserId } from "@/lib/students";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "student") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const row = await getStudentByUserId(session.user.id);
  if (!row) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const [project] = await db
    .select()
    .from(lifeProjects)
    .where(eq(lifeProjects.studentId, row.student.id))
    .limit(1);

  if (!project) {
    return NextResponse.json(
      { error: "Aún no hay proyecto de vida guardado" },
      { status: 404 },
    );
  }

  const bytes = await buildTextPdf({
    title: "Proyecto de vida ENRUTA",
    subtitle: row.user.fullName,
    sections: [
      { heading: "Meta principal", body: project.mainGoal || "—" },
      { heading: "Alternativas", body: project.alternatives || "—" },
      { heading: "Motivaciones", body: project.motivations || "—" },
      { heading: "Fortalezas", body: project.strengths || "—" },
      { heading: "Obstáculos", body: project.obstacles || "—" },
      { heading: "Recursos", body: project.resources || "—" },
      { heading: "Personas de apoyo", body: project.supportPeople || "—" },
      { heading: "Plan B", body: project.planB || "—" },
      { heading: "Reflexión personal", body: project.reflection || "—" },
    ],
    footer:
      "Plan vivo: puede actualizarse. ENRUTA acompaña, no decide por ti.",
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="enruta-proyecto-de-vida.pdf"`,
    },
  });
}

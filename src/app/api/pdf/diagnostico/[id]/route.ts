import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { institutionalDiagnostics, schools } from "@/db/schema";
import { buildTextPdf } from "@/lib/pdf";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (
    !session?.user ||
    !["school_admin", "enruta_admin", "counselor"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const [diag] = await db
    .select()
    .from(institutionalDiagnostics)
    .where(eq(institutionalDiagnostics.id, id))
    .limit(1);
  if (!diag) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (
    session.user.role !== "enruta_admin" &&
    diag.schoolId !== session.user.schoolId
  ) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.id, diag.schoolId))
    .limit(1);

  const bytes = await buildTextPdf({
    title: "Diagnóstico institucional ENRUTA",
    subtitle: school?.name || "Establecimiento",
    sections: [
      {
        heading: "Informe",
        body: diag.reportContent || "Sin contenido generado",
      },
    ],
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="enruta-diagnostico.pdf"`,
    },
  });
}

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lifeProjects } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { LifeProjectForm } from "./life-project-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export default async function LifeProjectPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const [project] = await db
    .select()
    .from(lifeProjects)
    .where(eq(lifeProjects.studentId, row.student.id))
    .limit(1);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        eyebrow="Etapa 4"
        title="Proyecto de vida"
        description="Transforma la exploración en un plan concreto — con meta, plan B y personas de apoyo. Puede cambiar."
        actions={
          project ? (
            <a href="/api/pdf/proyecto-de-vida">
              <Button variant="outline" size="sm">
                Descargar PDF
              </Button>
            </a>
          ) : null
        }
      />
      <LifeProjectForm project={project ?? null} />
    </div>
  );
}

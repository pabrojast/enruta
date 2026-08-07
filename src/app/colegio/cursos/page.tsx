import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CoursesPage() {
  const session = await requireRole([
    "school_admin",
    "head_teacher",
    "enruta_admin",
  ]);
  const rows = session.user.schoolId
    ? await db
        .select()
        .from(courses)
        .where(eq(courses.schoolId, session.user.schoolId))
    : await db.select().from(courses);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cursos</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-base">{c.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/60">
              Nivel {c.gradeLevel} · Año {c.year}
              {c.specialtyTp ? ` · ${c.specialtyTp}` : ""}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

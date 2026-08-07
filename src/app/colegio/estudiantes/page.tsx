import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students, users } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SchoolStudentsPage() {
  const session = await requireRole([
    "school_admin",
    "head_teacher",
    "enruta_admin",
  ]);

  const rows = session.user.schoolId
    ? await db
        .select({ student: students, user: users })
        .from(students)
        .innerJoin(users, eq(students.userId, users.id))
        .where(eq(students.schoolId, session.user.schoolId))
    : await db
        .select({ student: students, user: users })
        .from(students)
        .innerJoin(users, eq(students.userId, users.id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Estudiantes del establecimiento</h1>
      <p className="text-sm text-white/50">
        Vista general (sin respuestas sensibles ni notas psicológicas).
      </p>
      <div className="grid gap-3">
        {rows.map(({ student, user }) => (
          <Card key={student.id}>
            <CardHeader>
              <CardTitle className="text-base">{user.fullName}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/60">
              {student.gradeLevel}° medio · Perfil{" "}
              {student.profileCompleted ? "completo" : "pendiente"}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

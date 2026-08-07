import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  guardianStudents,
  guardians,
  students,
  users,
  vocationalReports,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { AlertBanner } from "@/components/alert-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GuardianExpectationsForm } from "./expectations-form";

export default async function FamiliaHome() {
  const session = await requireRole(["guardian", "enruta_admin"]);

  let links: {
    link: typeof guardianStudents.$inferSelect;
    student: typeof students.$inferSelect;
    user: typeof users.$inferSelect;
  }[] = [];

  if (session.user.role === "guardian") {
    const [g] = await db
      .select()
      .from(guardians)
      .where(eq(guardians.userId, session.user.id))
      .limit(1);
    if (g) {
      links = await db
        .select({
          link: guardianStudents,
          student: students,
          user: users,
        })
        .from(guardianStudents)
        .innerJoin(students, eq(guardianStudents.studentId, students.id))
        .innerJoin(users, eq(students.userId, users.id))
        .where(eq(guardianStudents.guardianId, g.id));
    }
  }

  const cards = await Promise.all(
    links.map(async ({ link, student, user }) => {
      const [report] = await db
        .select()
        .from(vocationalReports)
        .where(eq(vocationalReports.studentId, student.id))
        .limit(1);
      return { link, student, user, report };
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Acompañar sin invadir</h1>
        <p className="text-white/60">
          Aquí ves el avance general del proceso. No se muestran respuestas
          personales sensibles ni notas psicológicas.
        </p>
      </div>
      <AlertBanner>
        Tips: pregunta con curiosidad, evita frases como “ya debieras decidir” y
        celebra la exploración de varias alternativas.
      </AlertBanner>

      {cards.length === 0 ? (
        <p className="text-white/50">
          No hay estudiantes vinculados a esta cuenta.
        </p>
      ) : (
        cards.map(({ link, student, user, report }) => (
          <Card key={link.id}>
            <CardHeader>
              <CardTitle className="text-base">{user.fullName}</CardTitle>
              <p className="text-sm text-white/50">
                {student.gradeLevel}° medio · Perfil{" "}
                {student.profileCompleted ? "completo" : "en construcción"}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>
                  Informe:{" "}
                  {report?.status === "delivered"
                    ? "entregado (conversen juntos)"
                    : report
                      ? "en proceso con el colegio"
                      : "aún no generado"}
                </Badge>
                <Badge>
                  Acceso sensible:{" "}
                  {link.canViewSensitive ? "autorizado" : "no autorizado"}
                </Badge>
              </div>
              <GuardianExpectationsForm
                linkId={link.id}
                defaultValue={link.familyExpectations ?? ""}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

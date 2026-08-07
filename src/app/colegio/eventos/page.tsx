import { eq } from "drizzle-orm";
import { db } from "@/db";
import { eventRegistrations, events, students, users } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceButton } from "./attendance-button";

export default async function SchoolEventsPage() {
  const session = await requireRole([
    "school_admin",
    "head_teacher",
    "enruta_admin",
  ]);

  const eventRows = session.user.schoolId
    ? await db
        .select()
        .from(events)
        .where(eq(events.schoolId, session.user.schoolId))
    : await db.select().from(events);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Eventos y asistencia</h1>
      {await Promise.all(
        eventRows.map(async (e) => {
          const regs = await db
            .select({
              reg: eventRegistrations,
              student: students,
              user: users,
            })
            .from(eventRegistrations)
            .innerJoin(students, eq(eventRegistrations.studentId, students.id))
            .innerJoin(users, eq(students.userId, users.id))
            .where(eq(eventRegistrations.eventId, e.id));

          return (
            <Card key={e.id}>
              <CardHeader>
                <CardTitle className="text-base">{e.title}</CardTitle>
                <p className="text-sm text-white/50">
                  {new Date(e.startsAt).toLocaleString("es-CL")} ·{" "}
                  {regs.length} inscritos
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {regs.map(({ reg, user }) => (
                  <div
                    key={reg.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm"
                  >
                    <span>
                      {user.fullName} · {reg.status}
                      {reg.attended == null
                        ? ""
                        : reg.attended
                          ? " · asistió"
                          : " · ausente"}
                    </span>
                    <div className="flex gap-1">
                      <AttendanceButton registrationId={reg.id} attended />
                      <AttendanceButton
                        registrationId={reg.id}
                        attended={false}
                      />
                    </div>
                  </div>
                ))}
                {regs.length === 0 ? (
                  <p className="text-sm text-white/40">Sin inscripciones</p>
                ) : null}
              </CardContent>
            </Card>
          );
        }),
      )}
    </div>
  );
}

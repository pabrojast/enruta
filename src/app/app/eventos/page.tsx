import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { eventRegistrations, events } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegisterEventButton } from "./register-button";

export default async function EventosPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const allEvents = await db.select().from(events);
  const mine = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.studentId, row.student.id));
  const regMap = new Map(mine.map((r) => [r.eventId, r]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Eventos y experiencias</h1>
        <p className="text-white/60">
          Charlas, talleres y visitas. Tras participar, puedes registrar
          evidencias en tu portafolio.
        </p>
      </div>
      <div className="grid gap-4">
        {allEvents.map((e) => {
          const reg = regMap.get(e.id);
          return (
            <Card key={e.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <Badge className="mb-2 capitalize">{e.type}</Badge>
                  <CardTitle className="text-base">{e.title}</CardTitle>
                  <p className="mt-1 text-sm text-white/55">{e.description}</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-white/60">
                  <p>
                    {new Date(e.startsAt).toLocaleString("es-CL")} ·{" "}
                    {e.modality}
                  </p>
                  <p>
                    {e.location} · Cupos: {e.capacity ?? "—"} ·{" "}
                    {e.organizer}
                  </p>
                </div>
                {reg ? (
                  <Badge className="border-neon-green/40 text-neon-green">
                    Inscrito/a · {reg.status}
                  </Badge>
                ) : (
                  <RegisterEventButton eventId={e.id} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

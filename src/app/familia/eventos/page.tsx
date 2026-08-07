import { db } from "@/db";
import { events } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function FamiliaEventosPage() {
  await requireRole(["guardian", "enruta_admin"]);
  const rows = await db.select().from(events);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Próximos talleres y reuniones</h1>
      <p className="text-sm text-white/55">
        Información general para planificar acompañamiento familiar.
      </p>
      <div className="grid gap-3">
        {rows.map((e) => (
          <Card key={e.id}>
            <CardHeader>
              <Badge className="mb-2 w-fit capitalize">{e.type}</Badge>
              <CardTitle className="text-base">{e.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/65">
              <p>{e.description}</p>
              <p className="mt-2 text-white/45">
                {new Date(e.startsAt).toLocaleString("es-CL")} · {e.modality} ·{" "}
                {e.location}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

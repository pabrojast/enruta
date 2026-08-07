import { desc } from "drizzle-orm";
import { db } from "@/db";
import { eventMaterials, events } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { PartnerEventForm } from "./event-form";
import { MaterialsForm } from "./materials-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PartnerEventsPage() {
  await requireRole(["partner", "enruta_admin"]);
  const rows = await db.select().from(events).orderBy(desc(events.startsAt));
  const materials = await db.select().from(eventMaterials);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Eventos de vinculación</h1>
        <p className="text-white/60">
          Publica charlas, visitas o talleres, materiales y revisa cupos.
        </p>
      </div>
      <PartnerEventForm />
      <div>
        <h2 className="mb-3 text-lg font-semibold">Materiales informativos</h2>
        <MaterialsForm
          events={rows.map((e) => ({ id: e.id, title: e.title }))}
        />
      </div>
      <div className="grid gap-3">
        {rows.map((e) => {
          const mats = materials.filter((m) => m.eventId === e.id);
          return (
            <Card key={e.id}>
              <CardHeader>
                <Badge className="mb-2 w-fit capitalize">{e.type}</Badge>
                <CardTitle className="text-base">{e.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/65">
                <p>{e.description}</p>
                <p className="mt-2 text-white/45">
                  {new Date(e.startsAt).toLocaleString("es-CL")} · cupos{" "}
                  {e.capacity} · {e.organizer}
                </p>
                {mats.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-xs">
                    {mats.map((m) => (
                      <li key={m.id}>
                        {m.title} · {m.materialType} · scan {m.scanStatus}
                        {m.url ? ` · ${m.url}` : ""}
                        {m.filePath ? ` · ${m.filePath}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

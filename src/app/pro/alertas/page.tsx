import { eq } from "drizzle-orm";
import { db } from "@/db";
import { alerts } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { canSeeRestrictedAlerts } from "@/lib/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertActions } from "./alert-actions";

export default async function AlertsPage() {
  const session = await requireRole([
    "counselor",
    "psychologist",
    "enruta_admin",
  ]);

  let rows = session.user.schoolId
    ? await db
        .select()
        .from(alerts)
        .where(eq(alerts.schoolId, session.user.schoolId))
    : await db.select().from(alerts);

  if (!canSeeRestrictedAlerts(session.user.role)) {
    rows = rows.filter((a) => a.level !== "restricted");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Alertas</h1>
      <p className="text-sm text-white/60">
        Niveles: informativa, seguimiento, prioritaria, restringida a psicología.
      </p>
      <div className="grid gap-3">
        {rows.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge>{a.level}</Badge>
                  <Badge className="capitalize">{a.status}</Badge>
                </div>
                <CardTitle className="text-base">{a.title}</CardTitle>
              </div>
              <AlertActions alertId={a.id} status={a.status} />
            </CardHeader>
            <CardContent className="text-sm text-white/65">
              {a.description}
              <p className="mt-2 text-xs text-white/40">
                Tipo: {a.type} ·{" "}
                {new Date(a.createdAt).toLocaleString("es-CL")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

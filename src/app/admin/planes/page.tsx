import { db } from "@/db";
import {
  commercialPlans,
  featureFlags,
  schoolPlans,
  schools,
} from "@/db/schema";
import { AssignPlanForm } from "./assign-form";
import { FlagToggle } from "./flag-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPlansPage() {
  const [plans, schoolRows, assignments, flags] = await Promise.all([
    db.select().from(commercialPlans),
    db.select().from(schools),
    db.select().from(schoolPlans),
    db.select().from(featureFlags),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Planes y feature flags</h1>
        <p className="text-white/60">
          Diagnóstico, Piloto y 4 Años. Los módulos se activan por establecimiento.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <Badge className="mb-2 w-fit">{p.code}</Badge>
              <CardTitle className="text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/65">
              <p>{p.description}</p>
              <p className="mt-2 text-xs text-white/40">{p.priceNote}</p>
              <p className="mt-2 text-xs">
                Módulos: {((p.modules as string[]) || []).join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AssignPlanForm
        schools={schoolRows.map((s) => ({ id: s.id, name: s.name }))}
        plans={plans.map((p) => ({ id: p.id, name: p.name }))}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asignaciones actuales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {assignments.map((a) => {
            const school = schoolRows.find((s) => s.id === a.schoolId);
            const plan = plans.find((p) => p.id === a.planId);
            return (
              <div
                key={a.id}
                className="flex justify-between rounded-lg border border-white/10 px-3 py-2"
              >
                <span>{school?.name}</span>
                <Badge>{plan?.code}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Feature flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {flags.map((f) => {
            const school = schoolRows.find((s) => s.id === f.schoolId);
            return (
              <div
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm"
              >
                <span>
                  {school?.name || "global"} · <strong>{f.key}</strong> ·{" "}
                  {f.planCode || "—"}
                </span>
                <FlagToggle id={f.id} enabled={f.enabled} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

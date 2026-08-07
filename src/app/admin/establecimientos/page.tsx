import { db } from "@/db";
import { schools } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SchoolForm } from "./school-form";

export default async function AdminSchoolsPage() {
  const rows = await db.select().from(schools);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Establecimientos</h1>
      <SchoolForm />
      <div className="grid gap-3">
        {rows.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="text-base">{s.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-sm text-white/60">
              <Badge>{s.modality}</Badge>
              <Badge>Código {s.inviteCode}</Badge>
              <span>
                {s.commune}, {s.region} · {s.urbanRural} · conectividad{" "}
                {s.connectivityLevel}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

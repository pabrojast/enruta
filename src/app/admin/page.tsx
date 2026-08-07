import { db } from "@/db";
import {
  catalogItems,
  schools,
  students,
  users,
  vocationalReports,
} from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHome() {
  const [schoolCount, userCount, studentCount, catalogCount, reportCount] =
    await Promise.all([
      db.select().from(schools),
      db.select().from(users),
      db.select().from(students),
      db.select().from(catalogItems),
      db.select().from(vocationalReports),
    ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administración ENRUTA</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Establecimientos", schoolCount.length],
          ["Usuarios", userCount.length],
          ["Estudiantes", studentCount.length],
          ["Ítems de catálogo", catalogCount.length],
          ["Informes", reportCount.length],
        ].map(([t, n]) => (
          <Card key={t as string}>
            <CardHeader>
              <CardTitle className="text-base">{t as string}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{n as number}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

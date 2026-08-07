import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminContactsPage() {
  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mensajes de contacto</h1>
      {rows.length === 0 ? (
        <p className="text-white/50">Sin mensajes todavía.</p>
      ) : (
        rows.map((m) => (
          <Card key={m.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{m.name}</CardTitle>
                <p className="text-sm text-white/50">{m.email}</p>
              </div>
              <Badge>{m.status}</Badge>
            </CardHeader>
            <CardContent className="text-sm text-white/70">
              {m.schoolName ? (
                <p className="mb-2 text-white/45">Colegio: {m.schoolName}</p>
              ) : null}
              <p className="whitespace-pre-line">{m.message}</p>
              <p className="mt-2 text-xs text-white/40">
                {new Date(m.createdAt).toLocaleString("es-CL")}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { MarkReadButton } from "./mark-read-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function NotificationsPage() {
  const session = await requireRole(["student"]);
  if (!session.user.id) redirect("/login");

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Notificaciones</h1>
      {rows.length === 0 ? (
        <p className="text-white/50">No tienes notificaciones todavía.</p>
      ) : (
        rows.map((n) => (
          <Card key={n.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <CardTitle className="text-base">{n.title}</CardTitle>
                  {!n.readAt ? <Badge>Nueva</Badge> : null}
                </div>
                <p className="text-xs text-white/40">
                  {new Date(n.createdAt).toLocaleString("es-CL")}
                </p>
              </div>
              {!n.readAt ? <MarkReadButton id={n.id} /> : null}
            </CardHeader>
            <CardContent className="text-sm text-white/70">
              {n.body}
              {n.href ? (
                <p className="mt-2">
                  <Link href={n.href} className="text-neon-cyan hover:underline">
                    Ir →
                  </Link>
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

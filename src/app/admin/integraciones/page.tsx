import { desc } from "drizzle-orm";
import { db } from "@/db";
import { emailOutbox, mineducSyncLogs } from "@/db/schema";
import { MineducForm } from "./mineduc-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertBanner } from "@/components/alert-banner";

export default async function IntegrationsPage() {
  const [emails, logs] = await Promise.all([
    db.select().from(emailOutbox).orderBy(desc(emailOutbox.createdAt)).limit(20),
    db
      .select()
      .from(mineducSyncLogs)
      .orderBy(desc(mineducSyncLogs.createdAt))
      .limit(10),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integraciones</h1>
        <p className="text-white/60">
          Correo (SMTP opcional), stub MINEDUC y outbox de notificaciones.
        </p>
      </div>
      <AlertBanner>
        Configura SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT y SMTP_FROM en .env
        para envío real. Sin SMTP, los correos quedan en outbox como logged_only.
      </AlertBanner>
      <MineducForm />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email outbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {emails.map((e) => (
            <div
              key={e.id}
              className="rounded-lg border border-white/10 px-3 py-2"
            >
              <div className="flex justify-between gap-2">
                <span>{e.toEmail}</span>
                <Badge>{e.status}</Badge>
              </div>
              <p className="text-white/50">{e.subject}</p>
            </div>
          ))}
          {emails.length === 0 ? (
            <p className="text-white/40">Sin correos todavía.</p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logs MINEDUC (stub)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {logs.map((l) => (
            <div
              key={l.id}
              className="rounded-lg border border-white/10 px-3 py-2"
            >
              <div className="flex justify-between">
                <span>{l.operation}</span>
                <Badge>{l.status}</Badge>
              </div>
              <p className="text-xs text-white/40">
                {new Date(l.createdAt).toLocaleString("es-CL")}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

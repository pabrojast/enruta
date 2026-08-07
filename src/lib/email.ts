import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { emailOutbox } from "@/db/schema";

export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

/**
 * Capa de correo: siempre registra en email_outbox.
 * Si SMTP_* está configurado, intenta envío real con nodemailer.
 */
export async function sendEmail(input: SendEmailInput) {
  const [row] = await db
    .insert(emailOutbox)
    .values({
      toEmail: input.to,
      subject: input.subject,
      body: input.body,
      status: "queued",
    })
    .returning();

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const from = process.env.SMTP_FROM || "ENRUTA <noreply@enruta.local>";

  if (!host || !user || !pass) {
    await db
      .update(emailOutbox)
      .set({
        status: "logged_only",
        providerMeta: {
          reason: "SMTP no configurado; correo registrado en outbox",
        },
        sentAt: new Date(),
      })
      .where(eq(emailOutbox.id, row.id));
    return {
      ok: true as const,
      mode: "logged_only" as const,
      outboxId: row.id,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    const info = await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.body,
    });
    await db
      .update(emailOutbox)
      .set({
        status: "sent",
        providerMeta: { messageId: info.messageId },
        sentAt: new Date(),
      })
      .where(eq(emailOutbox.id, row.id));
    return { ok: true as const, mode: "smtp" as const, outboxId: row.id };
  } catch (error) {
    await db
      .update(emailOutbox)
      .set({
        status: "failed",
        providerMeta: {
          error: error instanceof Error ? error.message : "unknown",
        },
      })
      .where(eq(emailOutbox.id, row.id));
    return {
      ok: false as const,
      mode: "smtp" as const,
      outboxId: row.id,
      error: error instanceof Error ? error.message : "Error de envío",
    };
  }
}

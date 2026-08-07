"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { catalogItems, eventRegistrations, events, savedAlternatives } from "@/db/schema";
import { getStudentByUserId } from "@/lib/students";
import { auth } from "@/lib/auth";
import type { ActionState } from "./auth";

export async function toggleSaveAlternativeAction(
  catalogItemId: string,
): Promise<ActionState & { saved?: boolean }> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "student") {
    return { error: "No autorizado" };
  }
  const row = await getStudentByUserId(session.user.id);
  if (!row) return { error: "Estudiante no encontrado" };

  const [item] = await db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.id, catalogItemId))
    .limit(1);
  if (!item) return { error: "Alternativa no encontrada" };

  const [existing] = await db
    .select()
    .from(savedAlternatives)
    .where(
      and(
        eq(savedAlternatives.studentId, row.student.id),
        eq(savedAlternatives.catalogItemId, catalogItemId),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .delete(savedAlternatives)
      .where(eq(savedAlternatives.id, existing.id));
    revalidatePath("/app/explorar");
    revalidatePath("/app/comparar");
    return { ok: true, saved: false };
  }

  await db.insert(savedAlternatives).values({
    studentId: row.student.id,
    catalogItemId,
  });
  revalidatePath("/app/explorar");
  revalidatePath("/app/comparar");
  return { ok: true, saved: true };
}

export async function registerEventAction(eventId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "student") {
    return { error: "No autorizado" };
  }
  const row = await getStudentByUserId(session.user.id);
  if (!row) return { error: "Estudiante no encontrado" };

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);
  if (!event) return { error: "Evento no encontrado" };

  if (event.schoolId && event.schoolId !== row.student.schoolId) {
    return { error: "Este evento no está disponible para tu establecimiento" };
  }

  const [existing] = await db
    .select()
    .from(eventRegistrations)
    .where(
      and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.studentId, row.student.id),
      ),
    )
    .limit(1);
  if (existing) return { error: "Ya estás inscrito/a en este evento" };

  await db.insert(eventRegistrations).values({
    eventId,
    studentId: row.student.id,
    status: "inscrito",
  });

  revalidatePath("/app/eventos");
  return { ok: true };
}

export async function markAttendanceAction(
  registrationId: string,
  attended: boolean,
): Promise<ActionState> {
  const session = await auth();
  if (
    !session?.user?.id ||
    !["counselor", "psychologist", "school_admin", "partner", "enruta_admin"].includes(
      session.user.role,
    )
  ) {
    return { error: "No autorizado" };
  }

  await db
    .update(eventRegistrations)
    .set({
      attended,
      status: attended ? "asistio" : "ausente",
    })
    .where(eq(eventRegistrations.id, registrationId));

  revalidatePath("/colegio/eventos");
  revalidatePath("/pro");
  return { ok: true };
}

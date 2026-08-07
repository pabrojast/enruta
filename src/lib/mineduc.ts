import { db } from "@/db";
import { mineducSyncLogs } from "@/db/schema";

/**
 * Stub de integración MINEDUC.
 * No llama APIs reales; registra operación y devuelve payload simulado.
 */
export async function syncSchoolDirectoryStub(input: {
  schoolId?: string | null;
  rbd?: string;
}) {
  const response = {
    provider: "MINEDUC_STUB",
    rbd: input.rbd || "00000-0",
    name: "Establecimiento demo sincronizado",
    region: "Metropolitana",
    status: "active",
    syncedAt: new Date().toISOString(),
    note: "Integración simulada. Conectar API real en producción con credenciales oficiales.",
  };

  const [log] = await db
    .insert(mineducSyncLogs)
    .values({
      schoolId: input.schoolId || null,
      operation: "sync_school_directory",
      requestPayload: { rbd: input.rbd },
      responsePayload: response,
      status: "stub_ok",
    })
    .returning();

  return { ok: true as const, data: response, logId: log.id };
}

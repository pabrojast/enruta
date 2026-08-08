import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
// Fail-fast en producción; en dev/tests postgres.js no conecta hasta la
// primera query, así que un DSN local basta para evaluar el módulo.
if (!connectionString && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL no está definida");
}

const client = postgres(
  connectionString ?? "postgresql://enruta:enruta@localhost:5433/enruta",
  { max: 10 },
);

export const db = drizzle(client, { schema });
export { client };
export type Db = typeof db;

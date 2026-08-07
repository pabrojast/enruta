import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://enruta:enruta_secret@localhost:5432/enruta";

const client = postgres(connectionString, { max: 10 });

export const db = drizzle(client, { schema });
export { client };
export type Db = typeof db;

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { consents, students, users } from "@/db/schema";

export async function getStudentByUserId(userId: string) {
  const [row] = await db
    .select({
      student: students,
      user: users,
    })
    .from(students)
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(students.userId, userId))
    .limit(1);
  return row ?? null;
}

export async function hasRequiredConsents(studentId: string) {
  const rows = await db
    .select()
    .from(consents)
    .where(eq(consents.studentId, studentId));
  const accepted = new Set(
    rows.filter((c) => c.accepted).map((c) => c.type),
  );
  return accepted.has("terms") && accepted.has("data");
}

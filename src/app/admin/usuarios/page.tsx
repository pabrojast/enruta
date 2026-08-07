import { db } from "@/db";
import { schools, users } from "@/db/schema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserForm } from "./user-form";

export default async function AdminUsersPage() {
  const [userRows, schoolRows] = await Promise.all([
    db.select().from(users),
    db.select().from(schools),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <UserForm schools={schoolRows.map((s) => ({ id: s.id, name: s.name }))} />
      <div className="grid gap-2">
        {userRows.map((u) => (
          <Card key={u.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">{u.fullName}</CardTitle>
                <p className="text-sm text-white/50">{u.email}</p>
              </div>
              <Badge>{u.role}</Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

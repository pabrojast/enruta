import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { getStudentByUserId } from "@/lib/students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioForm } from "./portfolio-form";
import { PageHeader } from "@/components/page-header";

export default async function PortafolioPage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");

  const items = await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.studentId, row.student.id))
    .orderBy(desc(portfolioItems.createdAt));

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        eyebrow="Tu memoria de ruta"
        title="Portafolio digital"
        description="Reflexiones, evidencias e hitos desde 1° a 4° medio."
      />
      <PortfolioForm />
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <p className="text-xs uppercase tracking-widest text-white/40">
                {item.type} · {item.yearLabel}
              </p>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70 whitespace-pre-line">
              {item.body}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { catalogItems } from "@/db/schema";
import { CatalogForm } from "../catalog-form";

export default async function EditCatalogItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item] = await db
    .select()
    .from(catalogItems)
    .where(eq(catalogItems.id, id))
    .limit(1);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/catalogo"
          className="text-sm text-neon-cyan hover:underline"
        >
          ← Volver al catálogo
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editar · {item.title}</h1>
        <p className="text-sm text-white/50">
          Slug: <code className="text-white/70">{item.slug}</code>
        </p>
      </div>
      <CatalogForm item={item} />
    </div>
  );
}

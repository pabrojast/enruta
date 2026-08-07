import Link from "next/link";
import { CatalogForm } from "../catalog-form";

export default function NewCatalogItemPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/catalogo"
          className="text-sm text-neon-cyan hover:underline"
        >
          ← Volver al catálogo
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nuevo ítem de catálogo</h1>
        <p className="text-sm text-white/50">
          Incluye fuente y año si cargas métricas de empleabilidad o ingreso.
        </p>
      </div>
      <CatalogForm />
    </div>
  );
}

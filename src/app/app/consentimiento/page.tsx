"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveConsentsAction } from "@/app/actions/student";
import type { ActionState } from "@/app/actions/auth";
import { AlertBanner } from "@/components/alert-banner";
import {
  FormActions,
  LongFormShell,
} from "@/components/long-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

const initial: ActionState = {};

export default function ConsentPage() {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveConsentsAction, initial);

  useEffect(() => {
    if (state.ok) router.push("/app/perfil");
  }, [state.ok, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        eyebrow="Antes de empezar"
        title="Consentimiento y uso de datos"
        description="ENRUTA trata datos de orientación educativa. No emite diagnósticos psicológicos. Las respuestas sensibles se manejan con roles y mediación profesional."
      />

      <LongFormShell
        title="Antes de continuar"
        description="Lee con calma. Puedes preguntar a tu orientador/a si algo no te queda claro."
      >
        <form action={action} className="space-y-4">
          <label className="check-row text-sm leading-relaxed text-[#1f2937]">
            <input type="checkbox" name="terms" required />
            <span>
              Acepto los{" "}
              <a
                href="/terminos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0d9488] underline underline-offset-2"
              >
                términos de uso
              </a>{" "}
              de ENRUTA y entiendo que los resultados son{" "}
              <strong>orientativos</strong>, no determinantes.
            </span>
          </label>
          <label className="check-row text-sm leading-relaxed text-[#1f2937]">
            <input type="checkbox" name="data" required />
            <span>
              Autorizo el tratamiento de mi perfil, cuestionarios y portafolio
              para orientación dentro de mi establecimiento, según la{" "}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0d9488] underline underline-offset-2"
              >
                política de privacidad
              </a>
              .
            </span>
          </label>

          <div className="rounded-xl border border-[#dbeafe] bg-[#eff6ff] px-4 py-3 text-sm text-[#1e3a5f]">
            <p className="font-medium">Recuerda</p>
            <p className="mt-1 leading-relaxed">
              Tu apoderado/a no ve automáticamente respuestas sensibles. Un
              profesional puede acompañarte a revisar resultados importantes.
            </p>
          </div>

          {state.error ? (
            <AlertBanner tone="warn">{state.error}</AlertBanner>
          ) : null}

          <FormActions>
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando…" : "Aceptar y continuar"}
            </Button>
          </FormActions>
        </form>
      </LongFormShell>
    </div>
  );
}

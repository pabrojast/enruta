"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { validateReportAction } from "@/app/actions/professional";
import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({ reportId }: { reportId: string }) {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function act(decision: "validate_deliver" | "request_changes") {
    start(async () => {
      setError(null);
      const res = await validateReportAction(reportId, decision, notes);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/pro/informes");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Decisión profesional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="notes">Notas de revisión (visibles al equipo)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones, matices o acuerdos con el estudiante..."
          />
        </div>
        {error ? <AlertBanner tone="warn">{error}</AlertBanner> : null}
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending} onClick={() => act("validate_deliver")}>
            {pending ? "Guardando…" : "Validar y entregar al estudiante"}
          </Button>
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() => act("request_changes")}
          >
            Devolver a borrador
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

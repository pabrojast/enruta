"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAlertStatusAction } from "@/app/actions/professional";
import { Button } from "@/components/ui/button";

export function AlertActions({
  alertId,
  status,
}: {
  alertId: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  function setStatus(s: "open" | "in_progress" | "closed") {
    start(async () => {
      await updateAlertStatusAction(alertId, s);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      {status !== "in_progress" ? (
        <Button
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => setStatus("in_progress")}
        >
          En seguimiento
        </Button>
      ) : null}
      {status !== "closed" ? (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => setStatus("closed")}
        >
          Cerrar
        </Button>
      ) : null}
    </div>
  );
}

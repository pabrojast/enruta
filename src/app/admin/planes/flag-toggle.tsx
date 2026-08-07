"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFeatureFlagAction } from "@/app/actions/extended";
import { Button } from "@/components/ui/button";

export function FlagToggle({ id, enabled }: { id: string; enabled: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant={enabled ? "outline" : "secondary"}
      disabled={pending}
      onClick={() =>
        start(async () => {
          await toggleFeatureFlagAction(id, !enabled);
          router.refresh();
        })
      }
    >
      {enabled ? "Activo" : "Inactivo"}
    </Button>
  );
}

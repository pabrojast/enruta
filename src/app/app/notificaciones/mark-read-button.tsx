"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markNotificationReadAction } from "@/app/actions/misc";
import { Button } from "@/components/ui/button";

export function MarkReadButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await markNotificationReadAction(id);
          router.refresh();
        })
      }
    >
      Marcar leída
    </Button>
  );
}

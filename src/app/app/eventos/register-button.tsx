"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerEventAction } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";

export function RegisterEventButton({ eventId }: { eventId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await registerEventAction(eventId);
          router.refresh();
        })
      }
    >
      {pending ? "Inscribiendo…" : "Inscribirme"}
    </Button>
  );
}

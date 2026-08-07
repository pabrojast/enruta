"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markAttendanceAction } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";

export function AttendanceButton({
  registrationId,
  attended,
}: {
  registrationId: string;
  attended: boolean;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant={attended ? "outline" : "ghost"}
      disabled={pending}
      onClick={() =>
        start(async () => {
          await markAttendanceAction(registrationId, attended);
          router.refresh();
        })
      }
    >
      {attended ? "Asistió" : "Ausente"}
    </Button>
  );
}

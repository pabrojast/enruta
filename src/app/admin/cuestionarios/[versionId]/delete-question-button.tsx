"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteQuestionAction } from "@/app/actions/questionnaire-admin";
import { Button } from "@/components/ui/button";

export function DeleteQuestionButton({ questionId }: { questionId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="danger"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await deleteQuestionAction(questionId);
          router.refresh();
        })
      }
    >
      Eliminar
    </Button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { toggleSaveAlternativeAction } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";

export function SaveAlternativeButton({
  catalogItemId,
  initiallySaved,
}: {
  catalogItemId: string;
  initiallySaved: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, start] = useTransition();

  return (
    <Button
      size="sm"
      variant={saved ? "outline" : "secondary"}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleSaveAlternativeAction(catalogItemId);
          if (res.ok && typeof res.saved === "boolean") setSaved(res.saved);
        })
      }
    >
      {saved ? "Guardada" : "Guardar en mis alternativas"}
    </Button>
  );
}

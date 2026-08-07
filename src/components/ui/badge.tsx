import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/85",
        className,
      )}
      {...props}
    />
  );
}

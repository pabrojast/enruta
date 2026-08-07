import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center",
        className,
      )}
    >
      <div
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-neon-cyan"
        aria-hidden
      >
        ∅
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/60">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

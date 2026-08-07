import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1.5 flex justify-between text-xs text-white/60">
          <span>{label}</span>
          <span className="tabular">{v}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progreso"}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink transition-[width] duration-300 ease-out"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

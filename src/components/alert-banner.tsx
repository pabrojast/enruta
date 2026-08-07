import { cn } from "@/lib/utils";

export function AlertBanner({
  children,
  tone = "info",
  className,
  live = true,
}: {
  children: React.ReactNode;
  tone?: "info" | "warn" | "success";
  className?: string;
  live?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live={live ? "polite" : undefined}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tone === "info" && "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan",
        tone === "warn" && "border-amber-400/30 bg-amber-400/10 text-amber-100",
        tone === "success" &&
          "border-neon-green/30 bg-neon-green/10 text-neon-green",
        className,
      )}
    >
      {children}
    </div>
  );
}

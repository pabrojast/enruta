import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex min-h-11 h-11 w-full rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white",
      "placeholder:text-white/40",
      "transition-[border-color,box-shadow,background-color] duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:border-neon-cyan/40",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

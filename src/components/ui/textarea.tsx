import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-sm text-white",
      "placeholder:text-white/40",
      "transition-[border-color,box-shadow,background-color] duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:border-neon-cyan/40",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink text-black font-semibold shadow-lg shadow-neon-cyan/20 hover:brightness-110 active:brightness-95",
  secondary:
    "bg-white/10 text-white border border-white/15 hover:bg-white/16 hover:border-white/25",
  ghost: "bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
  danger:
    "bg-red-500/20 text-red-100 border border-red-400/30 hover:bg-red-500/30",
  outline:
    "border border-neon-cyan/45 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/70",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 h-10 px-3 text-sm rounded-lg",
  md: "min-h-11 h-11 px-4 text-sm rounded-xl",
  lg: "min-h-12 h-12 px-6 text-base rounded-xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,opacity,box-shadow,filter,transform] duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:pointer-events-none",
        "touch-manipulation select-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

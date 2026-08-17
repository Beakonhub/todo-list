import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brick-500 text-strip hover:bg-brick-600",
  secondary: "bg-board-raised text-strip border border-board-line hover:border-teal-500/60",
  ghost: "bg-transparent text-strip/80 hover:bg-board-raised",
  danger: "bg-transparent text-brick-500 border border-brick-500/40 hover:bg-brick-500/10",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

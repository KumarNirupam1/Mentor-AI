import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const styles =
    variant === "outline"
      ? "border border-purple/20 bg-transparent text-purple"
      : "bg-lavender/40 text-purple";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

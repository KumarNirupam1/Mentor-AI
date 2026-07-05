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
      ? "border border-[#d1e3ef] bg-white text-ink"
      : "bg-sky-deep text-ink";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

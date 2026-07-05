import { type ReactNode } from "react";

interface ActionCardProps {
  title: string;
  description: string;
  backgroundColor: string;
  step?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ActionCard({
  title,
  description,
  backgroundColor,
  step,
  icon,
  onClick,
  className = "",
}: ActionCardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`rounded-3xl border border-ink/10 p-5 text-left card-shadow transition-all hover:card-shadow-lg ${onClick ? "cursor-pointer hover:-translate-y-1" : ""} ${className}`}
      style={{ backgroundColor }}
    >
      <div className="flex items-start justify-between gap-3">
        {step && (
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold text-purple">
            {step}
          </span>
        )}
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60">
            {icon}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{description}</p>
    </Tag>
  );
}

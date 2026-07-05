interface ActionCardProps {
  title: string;
  description: string;
  backgroundColor: string;
  step?: string;
  onClick?: () => void;
  className?: string;
}

export function ActionCard({
  title,
  description,
  backgroundColor,
  step,
  onClick,
  className = "",
}: ActionCardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`rounded-2xl border border-black/80 p-5 text-left card-shadow transition-all hover:card-shadow-lg ${onClick ? "cursor-pointer hover:-translate-y-0.5" : ""} ${className}`}
      style={{
        backgroundColor,
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      {step && (
        <span className="mb-2 inline-block rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple">
          Step {step}
        </span>
      )}
      <h3 className="font-display text-lg text-[#2c2c2c]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#2c2c2c]/80">{description}</p>
    </Tag>
  );
}

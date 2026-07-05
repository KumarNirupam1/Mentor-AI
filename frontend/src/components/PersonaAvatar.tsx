import Image from "next/image";

import type { Persona } from "@/types/chat";
import { PERSONA_META, PERSONAS } from "@/types/chat";

const avatarByPersona = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p.avatar]),
) as Record<Persona, string>;

interface PersonaAvatarProps {
  persona: Persona;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { box: "h-8 w-8", img: 32 },
  md: { box: "h-10 w-10", img: 40 },
  lg: { box: "h-16 w-16", img: 64 },
};

export function PersonaAvatar({ persona, size = "sm", className = "" }: PersonaAvatarProps) {
  const meta = PERSONA_META[persona];
  const s = sizes[size];

  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full border-2 border-white ${s.box} card-shadow ${className}`}
      style={{ backgroundColor: meta.cardColor }}
    >
      <Image
        src={avatarByPersona[persona]}
        alt={meta.name}
        width={s.img}
        height={s.img}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

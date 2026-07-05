export type Persona = "hitesh" | "piyush";

export interface Chat {
  _id: string;
  userId: string;
  persona: Persona;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const PERSONA_META: Record<
  Persona,
  { name: string; emoji: string; cardColor: string; accentClass: string }
> = {
  hitesh: {
    name: "Hitesh",
    emoji: "☕",
    cardColor: "#faf393",
    accentClass: "bg-yellow",
  },
  piyush: {
    name: "Piyush",
    emoji: "🚀",
    cardColor: "#a6a5d4",
    accentClass: "bg-lavender",
  },
};

export const PERSONAS: {
  id: Persona;
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  cardColor: string;
  emoji: string;
  role: string;
  quote: string;
}[] = [
  {
    id: "hitesh",
    name: "Hitesh",
    tagline: "Founder of Learnyst & Chai aur Code",
    role: "Full-Stack Educator",
    description:
      "Master full-stack development, JavaScript, and building real-world apps with an experienced educator.",
    avatar: "https://github.com/hiteshchoudhary.png",
    cardColor: "#faf393",
    emoji: "☕",
    quote: "Hey! Let's build something cool!",
  },
  {
    id: "piyush",
    name: "Piyush",
    tagline: "Founder of Teachyst",
    role: "GenAI Builder",
    description:
      "Dive into programming, GenAI, web dev, and building projects from scratch with a creative builder.",
    avatar: "https://github.com/piyushgarg-dev.png",
    cardColor: "#a6a5d4",
    emoji: "🚀",
    quote: "Let's ship your next big idea!",
  },
];

export const FEATURES = [
  {
    title: "Vibrant Personas",
    description:
      "Pick from AI mentors — each with their own personality, expertise, and teaching style.",
    color: "bg-lavender",
    icon: "✨",
  },
  {
    title: "Chat & Learn",
    description:
      "Ask anything about coding, GenAI, or building projects. Get answers in a friendly way.",
    color: "bg-peach",
    icon: "💬",
  },
  {
    title: "Instant Replies",
    description:
      "Jump into conversations and get helpful responses powered by AI.",
    color: "bg-yellow",
    icon: "⚡",
  },
];

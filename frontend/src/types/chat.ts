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
  { name: string; avatar: string; cardColor: string; accentClass: string }
> = {
  hitesh: {
    name: "Hitesh",
    avatar: "/hitesh.webp",
    cardColor: "#faf393",
    accentClass: "bg-yellow",
  },
  piyush: {
    name: "Piyush",
    avatar: "/piyush.webp",
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
  role: string;
  quote: string;
  conversationPreview: { role: "user" | "assistant"; content: string }[];
}[] = [
  {
    id: "hitesh",
    name: "Hitesh",
    tagline: "Founder of Learnyst & Chai aur Code",
    role: "Full-Stack Educator",
    description:
      "Master full-stack development, JavaScript, and building real-world apps with an experienced educator.",
    avatar: "/hitesh.webp",
    cardColor: "#faf393",
    quote: "Hey! Let's build something cool!",
    conversationPreview: [
      {
        role: "user",
        content: "MERN pehle seekhun ya GenAI?",
      },
      {
        role: "assistant",
        content:
          "Dekho, software development skill hai jo aapko seekhni padegi. Interface to lagega na — chahe AI seekho ya ML, authentication to lagega hi. Bina HTML, JS ke project kaise banaoge?",
      },
      {
        role: "user",
        content: "API keys frontend me chipka du?",
      },
      {
        role: "assistant",
        content:
          "Kuch b use kro bs keys frontend me mt chipkana, otherwise you are on your own.",
      },
    ],
  },
  {
    id: "piyush",
    name: "Piyush",
    tagline: "Founder of Teachyst",
    role: "GenAI Builder",
    description:
      "Dive into programming, GenAI, web dev, and building projects from scratch with a creative builder.",
    avatar: "/piyush.webp",
    cardColor: "#a6a5d4",
    quote: "Let's ship your next big idea!",
    conversationPreview: [
      {
        role: "user",
        content: "Can we build our own LLM?",
      },
      {
        role: "assistant",
        content:
          "Let's make our own llm — that's the whole vibe. Bas JavaScript aani chahiye, ek simple mon stack project ho, chahe todo app hi ho, even that is enough.",
      },
      {
        role: "user",
        content: "Live itni der baad kyun?",
      },
      {
        role: "assistant",
        content:
          "Main 5 minute se live tha but galat YouTube account se connected tha. Soch raha tha koi aaya kyon nahi... fir realize — main kisi aur channel pe live hoon!",
      },
    ],
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MessageCircle, Sparkles } from "lucide-react";

import { PageShell, PillBadge } from "@/components/PageShell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { PERSONAS } from "@/types/chat";
import type { Persona } from "@/types/chat";

export function PersonaSelection() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSelect = (persona: Persona) => {
    router.push(`/chat/${persona}`);
  };

  return (
    <PageShell showNav={false}>
      <header className="border-b border-[#d1e3ef] bg-sky/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Dashboard 🏠
            </p>
            <h1 className="truncate font-display text-xl text-ink">
              Hey, {user?.name?.split(" ")[0]}! 👋
            </h1>
          </div>
          <Button variant="outline" onClick={() => void logout()} className="!py-2 !px-4 text-sm">
            <LogOut className="mr-1.5 inline h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <PillBadge icon={<Sparkles className="h-4 w-4 text-coral" />}>
              Pick your mentor ✨
            </PillBadge>
          </div>
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Who do you want to chat with? 💬
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Each persona has their own vibe, expertise, and teaching style 🎯
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => handleSelect(persona.id)}
              className="mockup-card p-6 text-left transition-all hover:-translate-y-1 hover:card-shadow-lg"
              style={{ backgroundColor: persona.cardColor }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white card-shadow">
                    <Image src={persona.avatar} alt={persona.name} width={96} height={96} className="rounded-full object-cover" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white text-sm card-shadow">
                    {persona.emoji}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl text-ink">{persona.name}</h3>
                <p className="mt-1 text-sm font-semibold text-purple">{persona.tagline}</p>

                <div className="mt-4 rounded-2xl bg-white/50 px-4 py-3">
                  <p className="text-sm leading-relaxed text-ink/80">{persona.description}</p>
                </div>

                <span className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-purple py-3 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" />
                  Chat with {persona.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-coral underline-offset-4 hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </PageShell>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PageShell } from "@/components/PageShell";
import { StarAccent } from "@/components/DecorativeElements";
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
      <header className="border-b border-[#e5e5e5] bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-purple/60">
              Dashboard
            </p>
            <h1 className="truncate font-display text-xl text-purple">
              Hey, {user?.name?.split(" ")[0]}! 👋
            </h1>
          </div>
          <Button variant="outline" onClick={() => void logout()} className="!py-2 !px-4 text-sm">
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple/20 bg-peach-cta px-4 py-1.5 text-sm font-semibold text-purple card-shadow">
            <StarAccent className="h-4 w-4 text-orange" />
            Pick your mentor
          </div>
          <h2 className="font-display text-4xl text-purple sm:text-5xl">
            Who do you want to chat with?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Each persona has their own vibe, expertise, and teaching style.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => handleSelect(persona.id)}
              className="rounded-2xl border border-black/10 p-6 text-left card-shadow transition-all hover:card-shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: persona.cardColor }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white card-shadow">
                    <Image
                      src={persona.avatar}
                      alt={persona.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-purple/20 bg-white text-sm card-shadow">
                    {persona.emoji}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-2xl text-[#2c2c2c]">
                  {persona.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-purple">
                  {persona.tagline}
                </p>

                <div className="mt-4 rounded-2xl border border-white/60 bg-white/40 px-4 py-3">
                  <p className="text-sm leading-relaxed text-[#2c2c2c]/80">
                    {persona.description}
                  </p>
                </div>

                <span className="mt-6 w-full rounded-full bg-purple py-3 text-sm font-semibold text-white">
                  Chat with {persona.name} 💬
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-purple underline-offset-4 hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </PageShell>
  );
}

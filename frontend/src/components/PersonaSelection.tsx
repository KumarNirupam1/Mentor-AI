"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, LogOut, MessageCircle } from "lucide-react";

import { OpenaiKeyDialog } from "@/components/OpenaiKeyDialog";
import { PageShell, PillBadge } from "@/components/PageShell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { PERSONAS } from "@/types/chat";
import type { Persona } from "@/types/chat";

export function PersonaSelection() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [showUpdateKey, setShowUpdateKey] = useState(false);

  const handleSelect = (persona: Persona) => {
    if (!user?.hasOpenaiApiKey) return;
    router.push(`/chat/${persona}`);
  };

  return (
    <PageShell showNav={false}>
      <header className="border-b border-[#d1e3ef] bg-sky/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Dashboard
            </p>
            <h1 className="truncate font-display text-xl text-ink">
              Hey, {user?.name?.split(" ")[0]}!
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {user?.hasOpenaiApiKey && (
              <Button
                variant="outline"
                onClick={() => setShowUpdateKey(true)}
                className="!py-2 !px-3 text-sm"
              >
                <KeyRound className="mr-1.5 inline h-4 w-4" />
                API key
              </Button>
            )}
            <Button variant="outline" onClick={() => void logout()} className="!py-2 !px-4 text-sm">
              <LogOut className="mr-1.5 inline h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <PillBadge>Pick your mentor</PillBadge>
          </div>
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Who do you want to chat with?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Each persona has their own vibe, expertise, and teaching style.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 sm:items-stretch">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => handleSelect(persona.id)}
              className="mockup-card flex h-full flex-col p-6 text-left transition-all hover:-translate-y-1 hover:card-shadow-lg"
              style={{ backgroundColor: persona.cardColor }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white card-shadow">
                  <Image
                    src={persona.avatar}
                    alt={persona.name}
                    width={96}
                    height={96}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                <h3 className="mt-5 font-display text-2xl text-ink">{persona.name}</h3>
                <p className="mt-1 text-sm font-semibold text-purple">{persona.tagline}</p>
              </div>

              <div className="mt-5 flex-1 space-y-2">
                {persona.conversationPreview.map((msg, i) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={i}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[92%] rounded-2xl px-3 py-2 text-left text-xs leading-relaxed sm:text-sm ${
                          isUser
                            ? "bg-purple text-white"
                            : "border border-white/60 bg-white/60 text-ink"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <span className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-purple py-3 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" />
                Chat with {persona.name}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-coral underline-offset-4 hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>

      <OpenaiKeyDialog
        open={showUpdateKey}
        dismissible
        onDismiss={() => setShowUpdateKey(false)}
        onSuccess={() => {
          setShowUpdateKey(false);
          void refreshUser();
        }}
      />
    </PageShell>
  );
}

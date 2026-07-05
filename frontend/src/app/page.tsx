"use client";

import Image from "next/image";
import Link from "next/link";

import { ActionCard } from "@/components/ActionCard";
import { ChatPreviewMock, DetoxieHeroDecor } from "@/components/DetoxieDecor";
import { StarAccent, WavyDivider } from "@/components/DecorativeElements";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { PERSONAS } from "@/types/chat";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Pick your mentor",
    description:
      "Choose Hitesh or Piyush — each with a distinct voice, expertise, and teaching style.",
    backgroundColor: "#faf393",
  },
  {
    step: "2",
    title: "Start a conversation",
    description:
      "Ask doubts, explore ideas, or get guidance — just like chatting with a real mentor.",
    backgroundColor: "#f2d2ac",
  },
  {
    step: "3",
    title: "Learn & build",
    description:
      "Get practical answers on coding, GenAI, and shipping projects from scratch.",
    backgroundColor: "#a6a5d4",
  },
];

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const ctaHref = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream">
      <DetoxieHeroDecor />

      {/* Nav */}
      <nav className="relative z-20 border-b border-[#e5e5e5] bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender font-display text-xl font-bold text-purple card-shadow transition-transform group-hover:-rotate-6">
              P
            </span>
            <span className="font-display text-2xl text-purple">
              Persona<span className="text-orange">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <span className="text-sm text-muted-foreground">...</span>
            ) : isAuthenticated ? (
              <>
                <span className="hidden text-sm font-medium text-purple sm:inline">
                  Hey, {user?.name?.split(" ")[0]}!
                </span>
                <Link href="/dashboard">
                  <Button className="!py-2.5 !px-5 text-sm">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold text-purple hover:bg-beige/60 sm:inline-block"
                >
                  Sign in
                </Link>
                <Link href="/login">
                  <Button className="!py-2.5 !px-5 text-sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero — Detoxie welcome center + home editorial headline */}
      <section className="relative z-10 px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-purple/60">
              A step towards smarter learning
            </p>

            <h1 className="mt-4 font-display text-4xl leading-[1.15] text-purple sm:text-5xl lg:text-6xl">
              Take control of how you{" "}
              <span className="relative inline-block">
                <span className="relative z-10">learn</span>
                <span className="absolute -bottom-1 left-0 h-3 w-full -rotate-1 bg-orange/70" />
              </span>{" "}
              from the best.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-purple/80 lg:mx-0 mx-auto">
              Chat with Hitesh & Piyush — AI mentors who teach like they&apos;re
              sitting right beside you, over chai.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href={ctaHref} className="w-full sm:w-auto sm:min-w-[220px]">
                <Button fullWidth className="!py-4 text-base">
                  {isAuthenticated ? "Pick a Persona" : "Get Started"}
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button fullWidth variant="secondary" className="!py-4 text-base">
                  See how it works
                </Button>
              </a>
            </div>

            {/* Persona strip — compact Detoxie action-card colors */}
            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              {PERSONAS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 card-shadow"
                  style={{ backgroundColor: p.cardColor }}
                >
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <span className="text-sm font-semibold text-[#2c2c2c]">
                    {p.name} {p.emoji}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat preview — Detoxie beige input + cream card feel */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ChatPreviewMock />
            <StarAccent className="absolute -top-5 -left-4 h-7 w-7 animate-float text-orange" />
            <StarAccent className="absolute -bottom-2 -right-2 h-5 w-5 animate-float-delayed text-lavender" />
          </div>
        </div>
      </section>

      <WavyDivider />

      {/* How it works — Detoxie ActionCard stack */}
      <section id="how-it-works" className="relative z-10 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-purple/60">
              Simple as chai
            </p>
            <h2 className="mt-2 font-display text-4xl text-purple sm:text-5xl">
              Three steps to your first mentor chat
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No complicated setup. Sign in, pick a persona, and start learning.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {HOW_IT_WORKS.map((item, i) => (
              <ActionCard
                key={item.step}
                step={item.step}
                title={item.title}
                description={item.description}
                backgroundColor={item.backgroundColor}
                className={i === 1 ? "sm:mt-6" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      <WavyDivider flip />

      {/* Meet the mentors — editorial cards with quotes */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-display text-4xl text-purple sm:text-5xl">
              Meet your mentors
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Two voices. One goal — help you grow.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {PERSONAS.map((persona, i) => (
              <div
                key={persona.id}
                className={`rounded-2xl border border-black/80 p-6 card-shadow-lg ${i === 1 ? "sm:mt-8" : ""}`}
                style={{ backgroundColor: persona.cardColor }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white">
                    <Image
                      src={persona.avatar}
                      alt={persona.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-[#2c2c2c]">
                      {persona.name} {persona.emoji}
                    </h3>
                    <p className="text-sm font-semibold text-purple">{persona.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#2c2c2c]/85">
                  {persona.description}
                </p>
                <blockquote className="mt-4 rounded-2xl border border-white/50 bg-white/40 px-4 py-3 text-sm font-medium italic text-purple">
                  &ldquo;{persona.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Detoxie pill button, centered welcome feel */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="absolute left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-orange/30 blur-3xl pointer-events-none" />

          <h2 className="relative font-display text-3xl text-purple sm:text-4xl">
            Welcome to PersonaAI
          </h2>
          <p className="relative mt-4 text-lg text-purple/80">
            Your mentors are waiting. Start a conversation and learn something
            new today.
          </p>

          <Link href={ctaHref} className="relative mt-10 inline-block w-full max-w-sm">
            <Button fullWidth className="!py-4 text-lg">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#e5e5e5] bg-white px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-lg text-purple">
            Persona<span className="text-orange">AI</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Warm design. Real mentors. Built for learners.
          </p>
        </div>
      </footer>
    </div>
  );
}

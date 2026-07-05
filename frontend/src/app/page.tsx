"use client";

import Image from "next/image";
import Link from "next/link";

import { ActionCard } from "@/components/ActionCard";
import { ChatPreviewMock, DetoxieHeroDecor } from "@/components/DetoxieDecor";
import { StarAccent, WavyDivider } from "@/components/DecorativeElements";
import { PillBadge } from "@/components/PageShell";
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
    <div className="dot-bg relative min-h-screen overflow-x-hidden">
      <DetoxieHeroDecor />

      {/* Nav */}
      <nav className="relative z-20 border-b border-[#d1e3ef] bg-sky/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-display text-2xl text-ink">
              Mentor<span className="text-coral">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <span className="text-sm text-muted-foreground">...</span>
            ) : isAuthenticated ? (
              <>
                <span className="hidden text-sm font-medium sm:inline">
                  Hey, {user?.name?.split(" ")[0]}!
                </span>
                <Link href="/dashboard">
                  <Button variant="coral" className="!py-2.5 !px-5 text-sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink hover:bg-white/60 sm:inline-block"
                >
                  Sign in
                </Link>
                <Link href="/login">
                  <Button variant="coral" className="!py-2.5 !px-5 text-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero — previous split layout */}
      <section className="relative z-10 px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:justify-start">
              <PillBadge>Your AI mentors, reimagined</PillBadge>
            </div>

            <h1 className="font-display text-4xl leading-[1.15] text-ink sm:text-5xl lg:text-6xl">
              Take control of how you{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-coral">learn</span>
                <span className="absolute -bottom-1 left-0 h-3 w-full -rotate-1 bg-orange/70" />
              </span>{" "}
              from the best.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0 mx-auto">
              Chat with Hitesh & Piyush — AI mentors who teach like they&apos;re
              sitting right beside you, over chai.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href={ctaHref} className="w-full sm:w-auto sm:min-w-[220px]">
                <Button variant="coral" fullWidth className="!py-4 text-base">
                  {isAuthenticated ? "Pick a Persona" : "Get Started"}
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button fullWidth variant="secondary" className="!py-4 text-base">
                  See how it works
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              {PERSONAS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-full border border-[#d1e3ef] bg-white px-3 py-1.5 card-shadow"
                >
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <span className="text-sm font-semibold text-ink">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ChatPreviewMock />
            <StarAccent className="absolute -top-5 -left-4 h-7 w-7 animate-float text-coral" />
            <StarAccent className="absolute -bottom-2 -right-2 h-5 w-5 animate-float-delayed text-lavender" />
          </div>
        </div>
      </section>

      <WavyDivider />

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Simple as chai
            </p>
            <h2 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
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

      {/* Meet mentors */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              Meet your mentors
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Two voices. One goal — help you grow.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 sm:items-stretch">
            {PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className="mockup-card flex h-full flex-col p-6"
                style={{ backgroundColor: persona.cardColor }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white card-shadow">
                    <Image
                      src={persona.avatar}
                      alt={persona.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-display text-2xl text-ink">{persona.name}</h3>
                    <p className="mt-0.5 text-sm font-semibold leading-snug text-purple">
                      {persona.tagline}
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/85">
                  {persona.description}
                </p>
                <blockquote className="mt-6 rounded-2xl bg-white/50 px-4 py-3 text-sm font-medium italic text-purple">
                  &ldquo;{persona.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden mockup-card p-8 text-center sm:p-12">
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-lavender/50" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-peach-cta/60" />

            <h2 className="relative font-display text-3xl text-ink sm:text-4xl">
              Ready to meet your mentors?
            </h2>
            <p className="relative mt-4 text-lg text-muted-foreground">
              Jump into a conversation with Hitesh or Piyush and start learning today.
            </p>
            <Link href={ctaHref} className="relative mt-8 inline-block w-full max-w-sm">
              <Button variant="coral" fullWidth className="!py-4 text-lg">
                {isAuthenticated ? "Go to Dashboard" : "Sign Up & Chat"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-4 py-10">
        <p className="text-center text-sm text-muted-foreground">
          © 2026{" "}
          <a
            href="https://github.com/KumarNirupam1"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline underline-offset-2 hover:text-coral"
          >
            Kumar Nirupam
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}

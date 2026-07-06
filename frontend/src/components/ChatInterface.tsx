"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Send } from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PersonaAvatar } from "@/components/PersonaAvatar";
import { Input } from "@/components/ui/Input";
import { getPersonaUsage } from "@/lib/chats";
import { createMessage, getAllMessages } from "@/lib/messages";
import type { Chat, Message, PersonaUsage } from "@/types/chat";
import { PERSONA_META } from "@/types/chat";

interface ChatInterfaceProps {
  chat: Chat;
  onBack: () => void;
}

function formatCooldown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ChatInterface({ chat, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<PersonaUsage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const meta = PERSONA_META[chat.persona];
  const isBlocked = usage?.isLimited ?? false;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const refreshUsage = useCallback(async () => {
    const data = await getPersonaUsage(chat.persona);
    if (data) setUsage(data);
    return data;
  }, [chat.persona]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      const [data] = await Promise.all([getAllMessages(chat._id), refreshUsage()]);
      if (!cancelled) {
        setMessages(data);
        setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [chat._id, refreshUsage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  useEffect(() => {
    if (!usage?.isLimited || !usage.cooldownSecondsRemaining) return;

    const timer = window.setInterval(() => {
      setUsage((prev) => {
        if (!prev?.isLimited || prev.cooldownSecondsRemaining <= 0) return prev;

        const nextSeconds = prev.cooldownSecondsRemaining - 1;
        if (nextSeconds <= 0) {
          void refreshUsage();
          return { ...prev, cooldownSecondsRemaining: 0, isLimited: false, remaining: prev.maxMessages };
        }

        return { ...prev, cooldownSecondsRemaining: nextSeconds };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [usage?.isLimited, usage?.cooldownSecondsRemaining, refreshUsage]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputMessage.trim();
    if (!content || isSending || isBlocked) return;

    setIsSending(true);
    setError(null);
    setInputMessage("");

    const optimistic: Message = { role: "user", content };
    setMessages((prev) => [...prev, optimistic]);

    const result = await createMessage(chat._id, content);

    if (!result.ok) {
      setMessages((prev) => prev.slice(0, -1));
      setInputMessage(content);
      setError(result.error);
      if (result.usage) setUsage(result.usage);
      setIsSending(false);
      return;
    }

    setMessages((prev) => [...prev, result.message]);
    if (result.usage) setUsage(result.usage);
    setIsSending(false);
  };

  return (
    <div className="dot-bg flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-[#d1e3ef] bg-sky/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-full border border-[#d1e3ef] bg-white px-3 py-2 text-sm font-semibold text-ink"
          >
            ← Back
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <PersonaAvatar persona={chat.persona} size="md" className="rounded-xl" />
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg text-ink">{meta.name}</h1>
              <p className="truncate text-xs font-medium text-muted-foreground">
                {chat.title || "New conversation"}
                {usage && !isBlocked && (
                  <span className="ml-2 text-purple">
                    · {usage.remaining}/{usage.maxMessages} messages left
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        {isBlocked && usage && (
          <div className="mb-4 mockup-card border border-coral/30 bg-peach-cta/40 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral/15">
              <Clock className="h-6 w-6 text-coral" />
            </div>
            <p className="mt-3 font-display text-lg text-ink">
              You&apos;ve used all {usage.maxMessages} messages with {meta.name}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Come back in{" "}
              <span className="font-semibold text-coral">
                {formatCooldown(usage.cooldownSecondsRemaining)}
              </span>{" "}
              to chat again. This helps keep the app running for everyone.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner label="Loading messages..." />
          </div>
        ) : messages.length === 0 && !isBlocked ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="max-w-sm mockup-card p-8">
              <p className="font-display text-xl text-ink">
                Say hello to {meta.name}!
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask about coding, projects, or anything you&apos;re curious about.
              </p>
              {usage && (
                <p className="mt-3 text-xs font-medium text-purple">
                  {usage.remaining} of {usage.maxMessages} messages available with {meta.name}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <PersonaAvatar persona={chat.persona} size="sm" className="mb-1 rounded-lg" />
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] ${
                      isUser ? "speech-bubble-user" : "speech-bubble-assistant"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {isUser ? "You" : meta.name}
                    </p>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-end gap-2">
                <PersonaAvatar persona={chat.persona} size="sm" className="mb-1 rounded-lg" />
                <div className="speech-bubble-assistant flex items-center gap-1.5 px-5 py-3">
                  <span className="typing-dot inline-block h-2 w-2 rounded-full bg-purple/40" />
                  <span className="typing-dot inline-block h-2 w-2 rounded-full bg-purple/40" />
                  <span className="typing-dot inline-block h-2 w-2 rounded-full bg-purple/40" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-[#d1e3ef] bg-sky/90 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4">
          {error && (
            <div className="mb-3 rounded-xl border border-destructive/30 bg-red-50 px-3 py-1.5 text-center text-xs font-medium text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={(e) => void handleSend(e)} className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isBlocked
                  ? `Cooldown active — come back in ${formatCooldown(usage?.cooldownSecondsRemaining ?? 0)}`
                  : `Message ${meta.name}...`
              }
              disabled={isSending || isBlocked}
              className="h-12 flex-1"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending || isBlocked}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral text-white shadow-md shadow-coral/20 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

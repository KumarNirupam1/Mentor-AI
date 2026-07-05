"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PersonaAvatar } from "@/components/PersonaAvatar";
import { Input } from "@/components/ui/Input";
import { createMessage, getAllMessages } from "@/lib/messages";
import type { Chat, Message } from "@/types/chat";
import { PERSONA_META } from "@/types/chat";

interface ChatInterfaceProps {
  chat: Chat;
  onBack: () => void;
}

export function ChatInterface({ chat, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const meta = PERSONA_META[chat.persona];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      const data = await getAllMessages(chat._id);
      if (!cancelled) {
        setMessages(data);
        setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [chat._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputMessage.trim();
    if (!content || isSending) return;

    setIsSending(true);
    setError(null);
    setInputMessage("");

    const optimistic: Message = { role: "user", content };
    setMessages((prev) => [...prev, optimistic]);

    const reply = await createMessage(chat._id, content);

    if (!reply) {
      setMessages((prev) => prev.slice(0, -1));
      setInputMessage(content);
      setError("Failed to send message. Please try again.");
      setIsSending(false);
      return;
    }

    setMessages((prev) => [...prev, reply]);
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
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner label="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="max-w-sm mockup-card p-8">
              <PersonaAvatar persona={chat.persona} size="lg" className="mx-auto" />
              <p className="mt-4 font-display text-xl text-ink">
                Say hello to {meta.name}!
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask about coding, projects, or anything you&apos;re curious about.
              </p>
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
              placeholder={`Message ${meta.name}...`}
              disabled={isSending}
              className="h-12 flex-1"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
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

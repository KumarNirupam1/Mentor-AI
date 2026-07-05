"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquarePlus, Trash2 } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { createChat, deleteChat, getAllChats } from "@/lib/chats";
import type { Chat, Persona } from "@/types/chat";
import { PERSONA_META } from "@/types/chat";

interface ChatListProps {
  persona: Persona;
  onBack: () => void;
  onSelectChat: (chat: Chat) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ChatList({ persona, onBack, onSelectChat }: ChatListProps) {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = PERSONA_META[persona];

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const data = await getAllChats(persona);
    setChats(data);
    setIsLoading(false);
  }, [persona]);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  const handleNewChat = async () => {
    setIsCreating(true);
    setError(null);
    const chat = await createChat(persona);
    if (!chat) {
      setError("Failed to create conversation. Please try again.");
      setIsCreating(false);
      return;
    }
    setChats((prev) => [chat, ...prev]);
    setIsCreating(false);
    onSelectChat(chat);
  };

  const handleDelete = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await deleteChat(chatId);
    if (!ok) {
      setError("Failed to delete conversation.");
      return;
    }
    setChats((prev) => prev.filter((c) => c._id !== chatId));
  };

  return (
    <PageShell showNav={false}>
      <header className="border-b border-[#e5e5e5] bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-full border border-purple/20 bg-white px-4 py-2 text-sm font-semibold text-purple hover:bg-beige/50"
          >
            ← Back
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm card-shadow"
                style={{ backgroundColor: meta.cardColor }}
              >
                {meta.emoji}
              </span>
              <h1 className="truncate font-display text-lg text-purple">
                {meta.name}&apos;s Chats
              </h1>
            </div>
            <p className="truncate text-xs text-muted-foreground">{user?.name}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="shrink-0 rounded-full border border-purple/20 bg-white px-3 py-2 text-sm font-semibold text-purple"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <button
          type="button"
          onClick={() => void handleNewChat()}
          disabled={isCreating}
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-full bg-purple py-3.5 text-base font-semibold text-white disabled:opacity-60 sm:w-auto sm:px-8"
        >
          <MessageSquarePlus className="h-5 w-5" />
          {isCreating ? "Creating..." : "Start new chat ✨"}
        </button>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg text-purple">Your conversations</h2>
          <Badge>{chats.length}</Badge>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-destructive/30 bg-red-50 px-4 py-2 text-center text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner label="Loading your chats..." />
        ) : chats.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-purple/30 bg-white py-16 text-center card-shadow">
            <p className="text-4xl">💬</p>
            <p className="mt-4 font-display text-lg text-purple">No chats yet!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start your first conversation with {meta.name}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat, index) => (
              <div
                key={chat._id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectChat(chat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectChat(chat);
                  }
                }}
                className={`group flex cursor-pointer items-center justify-between rounded-2xl border border-[#e5e5e5] bg-white px-4 py-3.5 card-shadow transition-all hover:card-shadow-lg hover:-translate-y-0.5 ${index % 2 === 1 ? "sm:ml-4" : ""}`}
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="truncate font-display font-bold text-[#2c2c2c]">
                    {chat.title || "New conversation"}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => void handleDelete(chat._id, e)}
                  className="shrink-0 rounded-xl p-2 text-destructive opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50"
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}

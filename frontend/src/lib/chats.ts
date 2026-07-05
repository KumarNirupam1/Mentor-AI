import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/user";
import type { Chat, Persona } from "@/types/chat";

export async function getAllChats(persona: Persona): Promise<Chat[]> {
  const res = await apiFetch(`/api/v1/chats/${persona}`);
  if (!res.ok) return [];
  const body = (await res.json()) as ApiResponse<{ chats: Chat[] }>;
  return body.data.chats ?? [];
}

export async function createChat(persona: Persona): Promise<Chat | null> {
  const res = await apiFetch("/api/v1/chats", {
    method: "POST",
    body: JSON.stringify({ persona }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as ApiResponse<{ chat: Chat }>;
  return body.data.chat;
}

export async function deleteChat(id: string): Promise<boolean> {
  const res = await apiFetch(`/api/v1/chats/${id}`, { method: "DELETE" });
  return res.ok;
}

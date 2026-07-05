import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/user";
import type { Message } from "@/types/chat";

export async function getAllMessages(chatId: string): Promise<Message[]> {
  const res = await apiFetch(`/api/v1/messages/${chatId}`);
  if (res.status === 404) return [];
  if (!res.ok) return [];
  const body = (await res.json()) as ApiResponse<{ messages: Message[] }>;
  return body.data.messages ?? [];
}

export async function createMessage(
  chatId: string,
  content: string,
): Promise<Message | null> {
  const res = await apiFetch(`/api/v1/messages/${chatId}`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as ApiResponse<{ parsed: Message }>;
  return body.data.parsed;
}

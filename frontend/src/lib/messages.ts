import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/user";
import type { Message, PersonaUsage } from "@/types/chat";

export type CreateMessageResult =
  | { ok: true; message: Message; usage: PersonaUsage | null }
  | {
      ok: false;
      error: string;
      usage: PersonaUsage | null;
      rateLimited: boolean;
      requiresOpenaiKey?: boolean;
    };

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
): Promise<CreateMessageResult> {
  const res = await apiFetch(`/api/v1/messages/${chatId}`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  const body = (await res.json()) as ApiResponse<{ parsed: Message; usage?: PersonaUsage }> & {
    message?: string;
  };

  if (res.status === 429) {
    const rateLimitData = body.data as { usage?: PersonaUsage } | undefined;
    return {
      ok: false,
      error: body.message ?? "Message limit reached. Please come back after the cooldown.",
      usage: rateLimitData?.usage ?? null,
      rateLimited: true,
    };
  }

  if (res.status === 403) {
    const keyData = body.data as { requiresOpenaiKey?: boolean } | undefined;
    return {
      ok: false,
      error: body.message ?? "OpenAI API key required.",
      usage: null,
      rateLimited: false,
      requiresOpenaiKey: keyData?.requiresOpenaiKey ?? false,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      error: body.message ?? "Failed to send message. Please try again.",
      usage: null,
      rateLimited: false,
    };
  }

  return {
    ok: true,
    message: body.data.parsed,
    usage: body.data.usage ?? null,
  };
}

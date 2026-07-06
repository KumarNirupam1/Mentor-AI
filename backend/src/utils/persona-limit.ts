import type { IUser } from "../models/user.models.ts";

export type Persona = "hitesh" | "piyush";

export const MAX_MESSAGES_PER_PERSONA =
  Number(process.env.PERSONA_MESSAGE_LIMIT) || 10;

export const COOLDOWN_MS =
  (Number(process.env.PERSONA_COOLDOWN_MINUTES) || 10) * 60 * 1000;

export interface PersonaUsageSnapshot {
  messageCount: number;
  remaining: number;
  maxMessages: number;
  isLimited: boolean;
  cooldownUntil: string | null;
  cooldownSecondsRemaining: number;
}

type UsageRecord = {
  messageCount: number;
  cooldownUntil: Date | null;
};

function defaultUsage(): Record<Persona, UsageRecord> {
  return {
    hitesh: { messageCount: 0, cooldownUntil: null },
    piyush: { messageCount: 0, cooldownUntil: null },
  };
}

function ensurePersonaUsage(user: IUser): Record<Persona, UsageRecord> {
  if (!user.personaUsage?.hitesh || !user.personaUsage?.piyush) {
    user.personaUsage = defaultUsage();
  }
  return user.personaUsage as Record<Persona, UsageRecord>;
}

function maybeResetUsage(record: UsageRecord): boolean {
  if (!record.cooldownUntil) return false;

  if (Date.now() >= record.cooldownUntil.getTime()) {
    record.messageCount = 0;
    record.cooldownUntil = null;
    return true;
  }

  return false;
}

export function buildUsageSnapshot(record: UsageRecord): PersonaUsageSnapshot {
  const now = Date.now();
  const cooldownActive =
    !!record.cooldownUntil && now < record.cooldownUntil.getTime();
  const isLimited = cooldownActive || record.messageCount >= MAX_MESSAGES_PER_PERSONA;
  const remaining = cooldownActive
    ? 0
    : Math.max(0, MAX_MESSAGES_PER_PERSONA - record.messageCount);

  return {
    messageCount: record.messageCount,
    remaining,
    maxMessages: MAX_MESSAGES_PER_PERSONA,
    isLimited,
    cooldownUntil: record.cooldownUntil?.toISOString() ?? null,
    cooldownSecondsRemaining: cooldownActive
      ? Math.ceil((record.cooldownUntil!.getTime() - now) / 1000)
      : 0,
  };
}

export async function getPersonaUsage(
  user: IUser,
  persona: Persona,
): Promise<PersonaUsageSnapshot> {
  const usage = ensurePersonaUsage(user);
  const record = usage[persona];
  const didReset = maybeResetUsage(record);

  if (didReset) {
    await user.save();
  }

  return buildUsageSnapshot(record);
}

export async function assertCanSendPersonaMessage(
  user: IUser,
  persona: Persona,
): Promise<{ allowed: boolean; usage: PersonaUsageSnapshot }> {
  const usage = await getPersonaUsage(user, persona);
  return { allowed: !usage.isLimited, usage };
}

/** Reserve one message slot BEFORE calling OpenAI — protects API budget */
export async function reservePersonaMessage(
  user: IUser,
  persona: Persona,
): Promise<{ allowed: boolean; usage: PersonaUsageSnapshot }> {
  const usage = ensurePersonaUsage(user);
  const record = usage[persona];

  maybeResetUsage(record);

  const before = buildUsageSnapshot(record);
  if (before.isLimited) {
    return { allowed: false, usage: before };
  }

  record.messageCount += 1;

  if (record.messageCount >= MAX_MESSAGES_PER_PERSONA) {
    record.cooldownUntil = new Date(Date.now() + COOLDOWN_MS);
  }

  await user.save();
  return { allowed: true, usage: buildUsageSnapshot(record) };
}

/** Roll back reservation if OpenAI fails — does not consume the user's quota */
export async function releasePersonaMessage(
  user: IUser,
  persona: Persona,
): Promise<void> {
  const usage = ensurePersonaUsage(user);
  const record = usage[persona];

  record.messageCount = Math.max(0, record.messageCount - 1);

  if (record.messageCount < MAX_MESSAGES_PER_PERSONA) {
    record.cooldownUntil = null;
  }

  await user.save();
}

export async function recordPersonaMessage(
  user: IUser,
  persona: Persona,
): Promise<PersonaUsageSnapshot> {
  const usage = ensurePersonaUsage(user);
  const record = usage[persona];

  maybeResetUsage(record);
  record.messageCount += 1;

  if (record.messageCount >= MAX_MESSAGES_PER_PERSONA) {
    record.cooldownUntil = new Date(Date.now() + COOLDOWN_MS);
  }

  await user.save();
  return buildUsageSnapshot(record);
}

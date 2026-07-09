"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveOpenaiApiKey } from "@/lib/auth";

interface OpenaiKeyDialogProps {
  open: boolean;
  onSuccess: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function OpenaiKeyDialog({
  open,
  onSuccess,
  dismissible = false,
  onDismiss,
}: OpenaiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKey.trim();

    if (!trimmed) {
      setError("Please enter your OpenAI API key.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const result = await saveOpenaiApiKey(trimmed);

    if (!result.ok) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    setApiKey("");
    setIsSaving(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div
        className="mockup-card w-full max-w-md p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="openai-key-title"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender">
          <KeyRound className="h-7 w-7 text-purple" />
        </div>

        <h2 id="openai-key-title" className="mt-5 text-center font-display text-2xl text-ink">
          Add your OpenAI API key
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
          Chat runs on your own OpenAI account. Your key is stored securely and never
          shared with other users.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="openai-api-key" className="mb-2 block text-sm font-semibold text-ink">
              API key
            </label>
            <Input
              id="openai-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              disabled={isSaving}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-destructive/30 bg-red-50 px-3 py-2 text-center text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="coral"
            fullWidth
            disabled={isSaving || !apiKey.trim()}
            className="!py-3.5"
          >
            {isSaving ? "Validating..." : "Save & start chatting"}
          </Button>

          {dismissible && (
            <button
              type="button"
              onClick={onDismiss}
              className="w-full py-2 text-sm font-semibold text-muted-foreground hover:text-ink"
            >
              Cancel
            </button>
          )}
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Get a key from{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-coral underline-offset-2 hover:underline"
          >
            platform.openai.com
          </a>
        </p>
      </div>
    </div>
  );
}

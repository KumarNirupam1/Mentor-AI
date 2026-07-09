"use client";

import { OpenaiKeyDialog } from "@/components/OpenaiKeyDialog";
import { useAuth } from "@/context/AuthContext";

interface OpenaiKeyGateProps {
  children: React.ReactNode;
}

export function OpenaiKeyGate({ children }: OpenaiKeyGateProps) {
  const { user, refreshUser } = useAuth();
  const needsKey = user && !user.hasOpenaiApiKey;

  return (
    <>
      {needsKey ? (
        <div className="pointer-events-none opacity-40 blur-[1px]">{children}</div>
      ) : (
        children
      )}
      <OpenaiKeyDialog
        open={Boolean(needsKey)}
        onSuccess={() => void refreshUser()}
      />
    </>
  );
}

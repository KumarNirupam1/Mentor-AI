"use client";

import { PersonaSelection } from "@/components/PersonaSelection";
import { OpenaiKeyGate } from "@/components/OpenaiKeyGate";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <OpenaiKeyGate>
        <PersonaSelection />
      </OpenaiKeyGate>
    </ProtectedRoute>
  );
}

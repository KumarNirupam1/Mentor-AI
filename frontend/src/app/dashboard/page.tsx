"use client";

import { PersonaSelection } from "@/components/PersonaSelection";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <PersonaSelection />
    </ProtectedRoute>
  );
}

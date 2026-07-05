import Link from "next/link";

import { DecorativeBackground } from "./DecorativeBackground";

interface PageShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function PageShell({ children, showNav = true }: PageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-cream">
      <DecorativeBackground />
      {showNav && (
        <nav className="relative z-20 border-b border-[#e5e5e5] bg-cream/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="group flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender font-display text-lg font-bold text-purple card-shadow transition-transform group-hover:-rotate-6">
                P
              </span>
              <span className="font-display text-xl font-bold text-purple">
                Persona<span className="text-orange">AI</span>
              </span>
            </Link>
          </div>
        </nav>
      )}
      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );
}

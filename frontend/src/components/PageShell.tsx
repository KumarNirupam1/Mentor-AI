import Link from "next/link";
import { Sparkles } from "lucide-react";

interface PageShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function PageShell({ children, showNav = true }: PageShellProps) {
  return (
    <div className="dot-bg relative flex min-h-screen flex-col">
      {showNav && (
        <nav className="relative z-20 border-b border-[#d1e3ef] bg-sky/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="group flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender font-display text-lg font-bold text-purple card-shadow transition-transform group-hover:-rotate-6">
                P
              </span>
              <span className="font-display text-xl text-ink">
                Persona<span className="text-coral">AI</span>
              </span>
            </Link>
          </div>
        </nav>
      )}
      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );
}

export function PillBadge({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-peach-cta/90 px-4 py-2 text-sm font-semibold text-ink card-shadow">
      {icon ?? <Sparkles className="h-4 w-4 text-coral" />}
      {children}
    </span>
  );
}

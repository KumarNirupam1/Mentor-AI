/** Organic shapes inspired by Detoxie welcome / home screens — CSS/SVG, no asset deps */

export function DetoxieHeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Solid orange circle — Detoxie welcome top-right */}
      <div className="absolute top-16 right-6 h-28 w-28 rounded-full bg-orange sm:top-20 sm:right-12 sm:h-32 sm:w-32" />

      {/* Organic blob — top left */}
      <svg
        className="absolute -top-24 -left-32 h-80 w-80 rotate-12 opacity-40 sm:-top-32 sm:-left-40 sm:h-96 sm:w-96"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M45 30C70 5 130 10 165 45C195 75 190 130 155 165C120 195 55 185 25 145C-5 105 15 55 45 30Z"
          fill="#FFBF75"
        />
      </svg>

      {/* Organic blob — bottom left */}
      <svg
        className="absolute -bottom-32 -left-28 h-72 w-72 -rotate-6 opacity-35 sm:h-80 sm:w-80"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M60 20C95 0 155 15 175 55C195 95 175 155 130 175C85 195 35 165 20 120C5 75 25 40 60 20Z"
          fill="#f2d2ac"
        />
      </svg>

      {/* Soft lavender wash — home screen bg feel */}
      <div className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-lavender/25 blur-3xl" />
    </div>
  );
}

export function ChatPreviewMock() {
  return (
    <div className="relative rounded-3xl border border-black/10 bg-white p-5 card-shadow-lg sm:p-6">
      <div className="mb-4 flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow text-lg">
          ☕
        </div>
        <div>
          <p className="font-display text-sm text-purple">Hitesh</p>
          <p className="text-xs text-muted-foreground">Online · ready to help</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-purple px-4 py-2.5 text-sm text-white">
          How do I start learning full-stack dev?
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-[#e5e5e5] bg-beige/60 px-4 py-2.5 text-sm text-[#2c2c2c]">
          Hanji! Pehle HTML, CSS, JS clear karo — foundation strong rakho. Phir ek
          simple project banao, deploy karo. Bas itna hi start hai ji! ☕
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-10 flex-1 rounded-3xl bg-beige px-4 text-sm leading-10 text-[#999]">
          Ask anything...
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple text-white text-sm">
          →
        </div>
      </div>

      {/* Detoxie-style accent dot */}
      <div className="absolute -bottom-3 -right-3 h-14 w-14 rounded-full bg-lavender/80 border-2 border-white" />
    </div>
  );
}

export function DecorativeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange/30 blur-3xl" />
      <div className="absolute top-20 right-8 h-32 w-32 rounded-full bg-orange shadow-sm" />
      <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-peach/50 blur-2xl" />
      <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-lavender/20 blur-3xl" />
    </div>
  );
}

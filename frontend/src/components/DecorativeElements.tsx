export function StarAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export function WavyDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`relative z-10 h-12 w-full ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 48"
        fill="none"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 24C240 48 480 0 720 24C960 48 1200 0 1440 24V48H0V24Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

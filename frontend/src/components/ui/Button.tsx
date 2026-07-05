import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "coral" | "secondary" | "ghost" | "outline";
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-purple text-white hover:opacity-90 disabled:bg-[#807fb3] disabled:text-[#D1D5DB]",
  coral:
    "bg-coral text-white hover:bg-coral-dark disabled:opacity-50 shadow-md shadow-coral/20",
  secondary:
    "bg-white text-ink border border-[#d1e3ef] hover:bg-sky-deep disabled:opacity-50",
  ghost: "bg-transparent text-ink hover:bg-white/60",
  outline:
    "bg-transparent border border-purple/30 text-purple hover:bg-white/60",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full px-6 py-3.5 text-base font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-purple text-white hover:opacity-90 disabled:bg-[#807fb3] disabled:text-[#D1D5DB]",
  secondary:
    "bg-peach-cta text-dark hover:opacity-90 disabled:opacity-50",
  ghost: "bg-transparent text-purple hover:bg-beige/50",
  outline:
    "bg-transparent border border-purple/30 text-purple hover:bg-beige/50",
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
      className={`rounded-full px-6 py-3.5 text-base font-semibold transition-opacity active:scale-[0.98] disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

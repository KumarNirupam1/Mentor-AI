import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-3xl border border-[#d1e3ef] bg-white px-5 py-3.5 text-base font-medium text-ink placeholder:text-[#999] outline-none focus:border-coral/50 focus:ring-2 focus:ring-coral/20 ${className}`}
      {...props}
    />
  );
}

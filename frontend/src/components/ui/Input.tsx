import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-3xl bg-beige px-5 py-3.5 text-base font-medium text-[#2c2c2c] placeholder:text-[#999] outline-none focus:ring-2 focus:ring-purple/30 ${className}`}
      {...props}
    />
  );
}

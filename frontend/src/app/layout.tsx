import type { Metadata } from "next";
import { DM_Sans, Young_Serif } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-young-serif",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "PersonaAI",
  description: "Chat with AI personas — Hitesh & Piyush",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream font-body text-purple">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Poppins, Young_Serif } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-young-serif",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mentor-AI",
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
      className={`${youngSerif.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col dot-bg font-body text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

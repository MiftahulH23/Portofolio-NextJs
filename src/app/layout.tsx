import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Miftahul Huda — Full-Stack Developer",
  description:
    "Portfolio of Miftahul Huda, a Full-Stack Web Developer building secure, fast web systems with Laravel, React and Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

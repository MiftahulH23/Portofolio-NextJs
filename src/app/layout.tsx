import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const description =
  "Portfolio of Miftahul Huda, a Full-Stack Web Developer building secure, fast web systems with Laravel, React and Next.js.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Miftahul Huda — Full-Stack Developer", template: "%s · Miftahul Huda" },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "Miftahul Huda", title: "Miftahul Huda — Full-Stack Developer", description },
  twitter: { card: "summary_large_image", title: "Miftahul Huda — Full-Stack Developer", description },
};

export const viewport: Viewport = { themeColor: "#09090B" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Miftahul Huda | Full-Stack Web Developer",
  description: "Portfolio Miftahul Huda, seorang Full-Stack Web Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          inter.variable
        )}
        // Menambahkan inline style agar gradasi pasti teraplikasi
        style={{
          background: 'linear-gradient(to bottom right, oklch(0.205 0 0), oklch(0.145 0 0), oklch(0.205 0 0))'
        }}
      >
        {children}
      </body>
    </html>
  );
}
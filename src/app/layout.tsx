import type { Viewport } from "next"; // Mengganti Metadata dengan Viewport jika diperlukan, atau hapus
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Kita hapus 'export const metadata' karena sudah tidak dipakai di sini
// Jika kamu butuh title/description, kita bisa letakkan di page.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.variable)}
        style={{
          background:
            "linear-gradient(to bottom right, oklch(0.205 0 0), oklch(0.145 0 0), oklch(0.205 0 0))",
        }}
      >
        {children}
      </body>
    </html>
  );
}

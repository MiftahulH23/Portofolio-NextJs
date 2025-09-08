import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/sections/Header";
import CursorSpotlight from "@/components/ui/CursorSpotlight";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. Tambahkan className="dark" di sini
    // 2. Ubah style colorScheme menjadi 'dark'
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-background text-foreground"
        )}
      >
        <CursorSpotlight />
        <Header />
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}


import "./globals.css";
import CursorSpotlight from "@/components/ui/CursorSpotlight";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Ticker from "@/components/sections/Ticker";

export const metadata = {
  title: "Miftahul Huda — Full-Stack Developer",
  description: "Portfolio of Miftahul Huda, a Full-Stack Web Developer focused on building modern, fast, and scalable web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#080808] text-[#f0f0f0] antialiased grain">
        <ScrollProgress />
        <CursorSpotlight />
        <Ticker />
        {children}
      </body>
    </html>
  );
}
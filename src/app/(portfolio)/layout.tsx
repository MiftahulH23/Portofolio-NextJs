import { LanguageProvider } from "@/context/LanguageContext";
import { CommandPalette } from "@/components/command/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <LanguageProvider>
      <SmoothScroll>
        <div className="theme-d min-h-screen bg-ink-950 font-display text-ink-50">
          <Header />
          {children}
          <Footer />
          <CommandPalette />
        </div>
      </SmoothScroll>
    </LanguageProvider>
  );
}

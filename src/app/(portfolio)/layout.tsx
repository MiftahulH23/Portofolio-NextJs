import CursorSpotlight from "@/components/ui/CursorSpotlight";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Header from "@/components/sections/Header";
import { LanguageProvider } from "@/context/LanguageContext";

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <ScrollProgress />
      <CursorSpotlight />
      <Header />
      {children}
    </LanguageProvider>
  );
}

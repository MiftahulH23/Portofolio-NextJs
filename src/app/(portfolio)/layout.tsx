import { LanguageProvider } from "@/context/LanguageContext";

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

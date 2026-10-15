import { LanguageProvider } from "@/context/LanguageContext";

export default function WorldLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <LanguageProvider>
      <div className="theme-d min-h-dvh bg-[#07070f] font-display text-ink-50">{children}</div>
    </LanguageProvider>
  );
}

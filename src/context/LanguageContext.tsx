"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { portfolioDataEn, portfolioDataId, translations } from "@/lib/data";

type Language = "en" | "id";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  data: typeof portfolioDataEn;
  t: typeof translations.en;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Language;
    if (saved && (saved === "en" || saved === "id")) {
      setLang(saved);
    }
    setIsLoaded(true);
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => {
      const newLang = prev === "en" ? "id" : "en";
      localStorage.setItem("portfolio-lang", newLang);
      return newLang;
    });
  };

  const data = lang === "en" ? portfolioDataEn : portfolioDataId;
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, data, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { getContent, getUi, type Lang, type PortfolioContent, type UiStrings } from "@/content";

const STORAGE_KEY = "portfolio-lang";
const CHANGE_EVENT = "portfolio:lang-change";

// Used only when localStorage is unavailable (private mode, blocked storage).
let memoryLang: Lang | null = null;

function readLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") return stored;
  } catch {
    // storage blocked: fall through to memory
  }
  return memoryLang ?? "en";
}

function writeLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
    memoryLang = null;
  } catch {
    memoryLang = lang;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLanguage: () => void;
  content: PortfolioContent;
  ui: UiStrings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);
  const toggleLanguage = useCallback(() => writeLang(lang === "en" ? "id" : "en"), [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLanguage, content: getContent(lang), ui: getUi(lang) }),
    [lang, setLang, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

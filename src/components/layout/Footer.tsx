"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";

export function Footer() {
  const { ui } = useLanguage();
  return (
    <footer className="mx-auto flex max-w-[1312px] flex-wrap justify-between gap-3 px-4 pb-10 pt-7 font-mono text-xs text-ink-300 sm:px-8">
      <span>{fmt(ui.footer.rights, { year: new Date().getFullYear() })}</span>
      <span>{ui.footer.built}</span>
    </footer>
  );
}

"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";

export function Footer() {
  const { ui } = useLanguage();
  return (
    <footer className="mx-auto flex max-w-[1312px] flex-wrap justify-between gap-3 px-4 pb-10 pt-7 text-sm text-ink-300 sm:px-8">
      {/* Static pages keep the build year in their HTML; the client may already be in the next year. */}
      <span suppressHydrationWarning>{fmt(ui.footer.rights, { year: new Date().getFullYear() })}</span>
      <span>{ui.footer.built}</span>
    </footer>
  );
}

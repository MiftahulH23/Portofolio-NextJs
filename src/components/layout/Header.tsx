"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Menu, Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { openCommandPalette } from "@/lib/events";

const pill =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-ink-600 bg-ink-850 px-3.5 font-mono text-[13px] text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50";

export function Header() {
  const { ui, content, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const cv = content.personal.cvUrl;
  const links = [
    { href: "/#work", label: ui.nav.work },
    { href: "/#about", label: ui.nav.about },
    { href: "/#stack", label: ui.nav.stack },
    { href: "/#contact", label: ui.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ink-950/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1312px] items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <Link href="/" className="text-[22px] font-extrabold tracking-[-0.03em]">
          miftahul<span className="text-lime">.dev</span>
        </Link>

        <nav aria-label={ui.nav.primary} className="hidden gap-7 font-mono text-[13px] bento:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink-300 transition-colors hover:text-ink-50">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 bento:flex">
          <button type="button" onClick={openCommandPalette} className={pill} aria-keyshortcuts="Control+K Meta+K">
            <Search className="size-[15px]" aria-hidden="true" />
            {ui.nav.search}
            <kbd className="rounded-md border border-ink-500 px-1.5 py-0.5 text-ink-200">⌘K</kbd>
          </button>
          <button type="button" onClick={toggleLanguage} aria-label={ui.nav.switchLang} className={pill}>
            {ui.nav.langLabel}
          </button>
          {cv && (
            <a href={cv} download className={`${pill} font-display text-[15px] font-semibold`}>
              <Download className="size-4" aria-hidden="true" />
              {ui.nav.resume}
            </a>
          )}
          <Link href="/#contact" className="inline-flex min-h-11 items-center rounded-xl bg-lime px-[18px] text-[15px] font-bold text-ink-950">
            {ui.nav.hire}
          </Link>
        </div>

        <div className="flex items-center gap-2 bento:hidden">
          <button type="button" onClick={openCommandPalette} className={pill} aria-label={ui.nav.search}>
            <Search className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={toggleLanguage} aria-label={ui.nav.switchLang} className={pill}>
            {ui.nav.langLabel}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? ui.nav.closeMenu : ui.nav.menu}
            className={pill}
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-ink-700 bg-ink-950 px-4 pb-6 pt-2 bento:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-ink-700 font-mono text-base text-ink-200">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap gap-2">
            {cv && (
              <a href={cv} download className={pill}>
                <Download className="size-4" aria-hidden="true" />
                {ui.nav.resume}
              </a>
            )}
            <Link href="/#contact" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center rounded-xl bg-lime px-[18px] font-bold text-ink-950">
              {ui.nav.hire}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

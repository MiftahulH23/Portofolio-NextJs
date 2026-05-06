"use client";

import { MobileNav } from "@/components/MobileNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
export default function Header() {
  const { t, lang, toggleLanguage } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { name: t.nav.home, href: "#home" },
    { name: t.nav.about, href: "#about" },
    { name: t.nav.services, href: "#services" },
    { name: t.nav.experience, href: "#experience" },
    { name: t.nav.projects, href: "#projects" },
  ];
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Tampilan Desktop
  if (isDesktop) {
    return (
      <header className="fixed top-14 left-1/2 -translate-x-1/2 z-[60]">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center gap-6 rounded-full bg-[#0a0a0c]/80 backdrop-blur-md border border-white/5 px-6 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link href="#home" className="text-sm font-black tracking-widest text-[#e8e8e8] px-2 uppercase pr-4 border-r border-white/10">
            MH
          </Link>
          <ul className="flex items-center gap-4">
            {navItems.map((item) => (
              <li key={item.name} className="relative" onMouseEnter={() => setHoveredItem(item.name)}>
                <Link href={item.href} className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#666666] hover:text-[#e8e8e8] transition-colors px-3 py-2">
                  {item.name}
                </Link>
                {hoveredItem === item.name && (
                  <motion.div
                    className="absolute bottom-[-8px] left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    layoutId="underline"
                  />
                )}
              </li>
            ))}
          </ul>
          
          <div className="pl-4 border-l border-white/10 ml-2">
            <button
              onClick={toggleLanguage}
              className="text-[10px] font-black tracking-widest uppercase text-[#888] hover:text-white transition-colors py-1 px-2 rounded hover:bg-white/5"
            >
              {lang === "en" ? "ID" : "EN"}
            </button>
          </div>
        </motion.nav>
      </header>
    );
  }

  // Tampilan Mobile
  return (
    <header className="fixed top-14 right-6 z-[60] flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-card/70 backdrop-blur-sm border border-border shadow-sm text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          {lang === "en" ? "ID" : "EN"}
        </button>
        <MobileNav />
    </header>
  );
}
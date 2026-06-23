"use client";

import { MobileNav } from "@/components/MobileNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Phone } from "lucide-react";

export default function Header() {
  const { t, lang, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { name: t.nav.services || "SERVICES", href: "#services" },
    { name: t.nav.projects || "WORKS", href: "#projects" },
    { name: t.nav.templates || "TEMPLATES", href: "#templates" },
    { name: t.nav.about || "NOTES", href: "#about" },
    { name: t.nav.experience || "EXPERIENCE", href: "#experience" },
  ];

  // Tampilan Desktop
  if (isDesktop) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[60] bg-background py-6 px-8 md:px-16 lg:px-24">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="#home" className="text-2xl font-semibold italic text-foreground tracking-tight">
            Miftahul
          </Link>
          
          <ul className="flex items-center gap-8">
            {navItems.map((item, index) => (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={`text-sm font-semibold tracking-wide transition-colors ${index === 0 ? 'border border-border rounded-full px-5 py-2 text-foreground' : 'text-muted-foreground hover:text-foreground uppercase'}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-6">
            <a href="https://wa.me/6282252209655" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer group">
              <span>+62 822-5220-9655</span>
              <div className="bg-primary/10 p-2 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Phone size={16} />
              </div>
            </a>
            
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold uppercase text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-black/5"
            >
              {lang === "en" ? "ID" : "EN"}
            </button>
          </div>
        </nav>
      </header>
    );
  }

  // Tampilan Mobile
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between bg-background py-4 px-6">
        <Link href="#home" className="text-xl font-semibold italic text-foreground tracking-tight">
            Miftahul
        </Link>
        <div className="flex items-center gap-4">
            <button
            onClick={toggleLanguage}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 text-xs font-bold text-foreground"
            >
            {lang === "en" ? "ID" : "EN"}
            </button>
            <MobileNav />
        </div>
    </header>
  );
}
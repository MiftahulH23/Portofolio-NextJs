"use client";

import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Pendidikan", href: "#education" },
  { name: "Pengalaman", href: "#experience" },
  { name: "Proyek", href: "#projects" },
];

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Tampilan Desktop
  if (isDesktop) {
    return (
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center gap-6 rounded-full bg-card/70 backdrop-blur-sm border border-border px-4 py-2 shadow-sm"
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link href="#home" className="text-lg font-bold text-foreground px-4">
            MH
          </Link>
          <ul className="flex items-center gap-4">
            {navItems.map((item) => (
              <li key={item.name} className="relative" onMouseEnter={() => setHoveredItem(item.name)}>
                <Link href={item.href} className="text-md font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                  {item.name}
                </Link>
                {hoveredItem === item.name && (
                  <motion.div
                    className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="underline"
                  />
                )}
              </li>
            ))}
          </ul>
          <div className="pl-4">
            <ThemeToggle />
          </div>
        </motion.nav>
      </header>
    );
  }

  // Tampilan Mobile
  return (
    <header className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <ThemeToggle />
        <MobileNav />
    </header>
  );
}
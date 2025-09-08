"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MobileNav } from "@/components/ui/MobileNav";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Pendidikan", href: "#education" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
];

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    // Tampilan untuk Desktop
    return (
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center gap-8 rounded-full bg-card/70 backdrop-blur-sm border border-border px-8 py-3 shadow-sm"
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Logo / Nama */}
          <Link href="#home" className="text-lg font-bold text-foreground">
            MH
          </Link>

          {/* Menu Navigasi Desktop */}
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
              >
                <Link
                  href={item.href}
                  className="text-md font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>

                {hoveredItem === item.name && (
                  <motion.div
                    className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-primary"
                    layoutId="underline"
                  />
                )}
              </li>
            ))}
          </ul>
        </motion.nav>
      </header>
    );
  }

  // Tampilan untuk Mobile
  return (
    <header className="fixed top-6 right-6 z-50">
      <MobileNav />
    </header>
  );
}

"use client";

import { MobileNav } from "@/components/MobileNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
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
        </motion.nav>
      </header>
    );
  }

  // Tampilan Mobile
  return (
    <header className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <MobileNav />
    </header>
  );
}
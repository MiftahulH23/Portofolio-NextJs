"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu } from "lucide-react";

export function MobileNav() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: t.nav.home, href: "#home" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.education, href: "#education" },
    { name: t.nav.experience, href: "#experience" },
    { name: t.nav.projects, href: "#projects" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const wrapperVariants: Variants = {
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    closed: {
      scale: 0.95,
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const itemVariants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="flex items-center gap-2 rounded-full bg-card/70 backdrop-blur-sm border border-border px-4 py-2 shadow-sm"
      >
        <span className="text-sm font-bold">Menu</span>
        <Menu className="h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={wrapperVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute top-full right-0 mt-2 w-48 origin-top-right rounded-xl border border-border bg-card/80 p-2 backdrop-blur-sm shadow-lg"
          >
            {navItems.map((item) => (
              <motion.li key={item.name} variants={itemVariants}>
                <Link
                  href={item.href}
                  onClick={toggleMenu}
                  className="block w-full p-2 text-md font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md"
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";
import { Github, Linkedin, Instagram, Heart, Coffee } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { data: portfolioData, t } = useLanguage();
  return (
    <footer className="relative border-t border-border py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-muted-foreground tracking-wider uppercase font-bold">
          &copy; 2025 {portfolioData.personalInfo.name}. {t.footer.rights}.
        </p>

        <div className="flex items-center gap-6">
          {[
            { href: portfolioData.personalInfo.github, Icon: Github, label: "GitHub" },
            { href: portfolioData.personalInfo.linkedin, Icon: Linkedin, label: "LinkedIn" },
            { href: portfolioData.personalInfo.instagram, Icon: Instagram, label: "Instagram" },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <p className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wide uppercase">
          {t.footer.builtWith}{" "}
          <Heart size={12} className="text-red-500 fill-red-500" />
          {" "}{t.footer.lotsOf}{" "}
          <Coffee size={12} className="text-amber-700 fill-amber-700" />
        </p>
      </div>
    </footer>
  );
}
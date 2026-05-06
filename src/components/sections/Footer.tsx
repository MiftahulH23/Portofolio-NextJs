"use client";
import { Github, Linkedin, Instagram, Heart, Coffee } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { data: portfolioData, t } = useLanguage();
  return (
    <footer className="relative border-t border-[#0e0e0e] py-10">
      <div className="divider-glow" />
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-[#222222] tracking-[0.15em] uppercase font-semibold">
          &copy; 2025 {portfolioData.personalInfo.name}. {t.footer.rights}.
        </p>

        <div className="flex items-center gap-4">
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
              className="text-[#1e1e1e] hover:text-[#444444] transition-colors"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>

        <p className="text-[10px] text-[#1e1e1e] flex items-center gap-1.5 tracking-wide">
          {t.footer.builtWith}{" "}
          <Heart size={9} className="text-[#252525]" />
          {" "}{t.footer.lotsOf}{" "}
          <Coffee size={9} className="text-[#252525]" />
        </p>
      </div>
    </footer>
  );
}
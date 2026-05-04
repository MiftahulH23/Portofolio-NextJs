import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import ContactCTA from "@/components/sections/ContactCTA";
import { portfolioData } from "@/lib/data";
import { Github, Linkedin, Instagram, Heart, Coffee } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Education />
      <Experience />
      <Projects />
      <ContactCTA />

      {/* Footer */}
      <footer className="relative border-t border-[#0e0e0e] py-10">
        <div className="divider-glow" />
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-[#222222] tracking-[0.15em] uppercase font-semibold">
            &copy; 2025 {portfolioData.personalInfo.name}. All rights reserved.
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
            Built with{" "}
            <Heart size={9} className="text-[#252525]" />
            {" "}&amp; lots of{" "}
            <Coffee size={9} className="text-[#252525]" />
          </p>
        </div>
      </footer>
    </>
  );
}

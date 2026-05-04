"use client";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { Mail, Phone, Github, Linkedin, Instagram } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-10"
    >
      {/* Bottom glow */}
      <div className="hero-glow" />

      {/* Ambient top-left glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-200px",
          left: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)",
        }}
      />

      {/* Background Large Text */}
      <div className="bg-text" aria-hidden="true">
        <span>PORTFOLIO</span>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3.5rem,11vw,9rem)] text-[#e8e8e8] mb-12"
        >
          Let&apos;s build
          <br />
          something<span className="text-[#303030]">.</span>
        </motion.h1>

        {/* Sub-label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[#383838] text-sm font-medium tracking-widest uppercase mb-10"
        >
          {portfolioData.personalInfo.headline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 justify-center mb-16"
        >
          <a
            href={`mailto:${portfolioData.personalInfo.email}`}
            className="btn-primary"
          >
            <Mail size={14} />
            Send Email
          </a>
          <a
            href={`https://wa.me/${portfolioData.personalInfo.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <Phone size={14} />
            Book a Call
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex items-center gap-2"
        >
          {[
            { href: portfolioData.personalInfo.github, label: "GitHub", Icon: Github },
            { href: portfolioData.personalInfo.linkedin, label: "LinkedIn", Icon: Linkedin },
            { href: portfolioData.personalInfo.instagram, label: "Instagram", Icon: Instagram },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-[11px] font-semibold text-[#333333] border border-[#171717] rounded-full hover:text-[#777777] hover:border-[#2a2a2a] transition-all duration-300 tracking-wider"
            >
              <Icon size={12} />
              {label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.25em] text-[#2a2a2a] uppercase font-bold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-[#2a2a2a] to-transparent"
        />
      </motion.div>
    </section>
  );
}
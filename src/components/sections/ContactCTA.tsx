"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import Lanyard from "../ui/Lanyard";

export default function ContactCTA() {
  const { data: portfolioData, t } = useLanguage();
  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-[#0a0a0c]">
      <div className="divider-glow" />
      {/* Center glow */}
      <div className="contact-cta-glow" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-label mb-8"
        >
          07 — {t.contact.title}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,9vw,7rem)] text-[#e8e8e8] mb-10"
        >
          {t.contact.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[#404040] text-base max-w-md mb-12 leading-relaxed"
        >
          {t.contact.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap gap-4 justify-center lg:justify-start"
        >
          <a
            href={`mailto:${portfolioData.personalInfo.email}`}
            className="btn-primary"
          >
            <Mail size={14} />
            {portfolioData.personalInfo.email}
            <ArrowUpRight size={14} />
          </a>
          <a
            href={`https://wa.me/${portfolioData.personalInfo.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <Phone size={14} />
            WhatsApp
          </a>
        </motion.div>
        </div>

        {/* Right Content - Interactive Lanyard */}
        <div className="w-full flex justify-center items-center lg:h-auto h-[500px]">
          <Lanyard />
        </div>
      </div>
    </section>
  );
}

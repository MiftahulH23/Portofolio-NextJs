"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowUpRight } from "lucide-react";

export default function ContactCTA() {
  const { data: portfolioData, t } = useLanguage();
  return (
    <section id="contact" className="py-24 lg:py-32 bg-background border-t border-border/50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="w-8 h-[2px] bg-accent"></span>
          <p className="text-accent font-bold tracking-widest text-sm uppercase">
            {t.contact.title}
          </p>
          <span className="w-8 h-[2px] bg-accent"></span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl lg:text-8xl font-bold text-foreground tracking-tight leading-[1.05] mb-10"
        >
          Let's make something <br className="hidden md:block" />
          <span className="text-primary italic font-serif pr-2">amazing</span> together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-14 leading-relaxed"
        >
          {t.contact.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto"
        >
          <a
            href={`mailto:${portfolioData.personalInfo.email}`}
            className="px-10 py-5 bg-foreground text-background font-bold rounded-full hover:bg-primary transition-all duration-300 shadow-xl hover:shadow-primary/25 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
          >
            <Mail size={20} />
            Email Me
            <ArrowUpRight size={20} className="ml-1" />
          </a>
          <a
            href={`https://wa.me/${portfolioData.personalInfo.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-white text-foreground border border-border font-bold rounded-full hover:border-foreground transition-all duration-300 flex items-center justify-center gap-3 text-lg"
          >
            <Phone size={20} />
            WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion, Variants } from "framer-motion";
import { Mail, Phone, Copy, Check, MapPin, GraduationCap, Monitor, Globe } from "lucide-react";
import { useState } from "react";
import { TiltCard } from "../ui/TiltCard";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.55, 
      delay: i * 0.1, 
      ease: [0.16, 1, 0.3, 1] as const 
    },
  }),
};

export default function About() {
  const { data: portfolioData, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioData.personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: t.about.stats.years, value: "4+" },
    { label: t.about.stats.projects, value: `${portfolioData.projects.length}` },
    { label: t.about.stats.gpa, value: portfolioData.education.gpa.split("/")[0] },
  ];

  const details = [
    { Icon: MapPin, label: t.about.details.location, value: "Riau, Indonesia" },
    { Icon: GraduationCap, label: t.about.details.education, value: portfolioData.education.institution },
    { Icon: Monitor, label: t.about.details.degree, value: portfolioData.education.degree },
    { Icon: Globe, label: t.about.details.availability, value: t.about.remote },
  ];

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-accent font-bold tracking-widest text-sm uppercase mb-12 flex items-center gap-4"
        >
          <span className="w-8 h-[2px] bg-accent"></span>
          {t.about.label}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7">
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-8"
            >
              {portfolioData.personalInfo.name}
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-muted-foreground leading-relaxed text-lg"
            >
              {portfolioData.personalInfo.summary}
            </motion.p>

            {/* Stats row */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex gap-12 mt-12 pt-10 border-t border-border/50"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-bold text-foreground tracking-tight mb-2">{s.value}</p>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase font-semibold">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Contact card */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <TiltCard className="bg-background p-8 rounded-3xl border border-border shadow-sm group relative w-full h-full">
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">{t.about.details.contact}</p>
                  <div className="space-y-5">
                    {/* Email */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-border/50 flex-shrink-0">
                            <Mail size={16} className="text-primary" />
                        </div>
                        <a
                          href={`mailto:${portfolioData.personalInfo.email}`}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {portfolioData.personalInfo.email}
                        </a>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        aria-label="Copy email"
                      >
                        {copied ? (
                          <Check size={14} className="text-secondary" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    {/* Phone */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-border/50 flex-shrink-0">
                          <Phone size={16} className="text-primary" />
                      </div>
                      <a
                        href={`https://wa.me/${portfolioData.personalInfo.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {portfolioData.personalInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Details card */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <TiltCard className="bg-background p-8 rounded-3xl border border-border shadow-sm group relative w-full h-full">
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">{t.about.details.details}</p>
                  <div className="space-y-4">
                    {details.map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between gap-4 text-sm font-medium">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Icon size={16} />
                          <span>{label}</span>
                        </div>
                        <span className="text-foreground text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section id="about" className="relative py-32 overflow-hidden bg-[#0a0a0c]">
      {/* Background elements */}
      <div className="bg-dot-pattern opacity-40" />
      <div className="bg-text opacity-15">
        <span>ABOUT</span>
      </div>

      {/* Divider */}
      <div className="divider-glow" />
      {/* Ambient glow */}
      <div className="section-glow-left" />

      <div className="max-w-5xl mx-auto px-6 pt-2">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="section-label mb-14"
        >
          01 — {t.about.label}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* LEFT */}
          <div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#e8e8e8] tracking-tight leading-tight mb-6"
            >
              {portfolioData.personalInfo.name}
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[#484848] leading-relaxed text-[0.95rem]"
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
              className="flex gap-10 mt-12"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-[#e8e8e8] tracking-tight">{s.value}</p>
                  <p className="text-[11px] text-[#383838] mt-1 tracking-widest uppercase font-semibold">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">
            {/* Contact card */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <TiltCard className="card-dark p-6 group relative w-full h-full">
              <div className="relative z-10">
                <p className="section-label mb-5">{t.about.details.contact}</p>
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Mail size={13} className="text-[#383838] flex-shrink-0" />
                    <a
                      href={`mailto:${portfolioData.personalInfo.email}`}
                      className="text-sm text-[#5a5a5a] hover:text-[#e8e8e8] transition-colors"
                    >
                      {portfolioData.personalInfo.email}
                    </a>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="text-[#2a2a2a] hover:text-[#666666] transition-colors flex-shrink-0"
                    aria-label="Copy email"
                  >
                    {copied ? (
                      <Check size={13} className="text-green-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone size={13} className="text-[#383838] flex-shrink-0" />
                  <a
                    href={`https://wa.me/${portfolioData.personalInfo.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#5a5a5a] hover:text-[#e8e8e8] transition-colors"
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
              <TiltCard className="card-dark p-6 group relative w-full h-full">
              <div className="relative z-10">
                <p className="section-label mb-5">{t.about.details.details}</p>
              <div className="space-y-3">
                {details.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-2.5 text-[#2e2e2e]">
                      <Icon size={12} />
                      <span>{label}</span>
                    </div>
                    <span className="text-[#5a5a5a] text-right">{value}</span>
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

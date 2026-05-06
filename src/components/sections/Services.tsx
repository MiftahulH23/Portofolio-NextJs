"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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

export default function Services() {
  const { data: portfolioData, t } = useLanguage();
  return (
    <section id="services" className="relative py-32 overflow-hidden bg-[#0a0a0c]">
      {/* Background elements */}
      <div className="bg-grid-pattern opacity-50" />
      <div className="bg-text opacity-20">
        <span>SERVICES</span>
      </div>

      <div className="divider-glow" />
      <div className="section-glow-left" />
      <div className="section-glow-accent" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="section-label mb-4"
        >
          03 — {t.services.title}
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#e8e8e8] tracking-tight mb-14"
        >
          Services I provide.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.services.map((service, i) => (
            <motion.div
              key={service.number}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <TiltCard className="service-card group relative h-full w-full">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  {/* Number */}
                  <p className="text-[10px] font-bold tracking-[0.15em] text-[#252525]">
                    {service.number}
                  </p>
                  {/* Arrow on hover */}
                  <ArrowUpRight
                    size={18}
                    className="text-[#1e1e1e] group-hover:text-[#666666] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#e8e8e8] tracking-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#4a4a4a] leading-relaxed mb-6 group-hover:text-[#6a6a6a] transition-colors duration-300 line-clamp-3">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold tracking-widest text-[#2a2a2a] group-hover:text-[#444444] uppercase px-2.5 py-1 border border-[#181818] group-hover:border-[#2a2a2a] rounded-full transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

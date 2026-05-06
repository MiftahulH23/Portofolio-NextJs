"use client";
import { portfolioData } from "@/lib/data";
import { motion, Variants } from "framer-motion";
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

export default function Experience() {
  return (
    <section id="experience" className="relative py-32 overflow-hidden bg-[#0a0a0c]">
      {/* Background elements */}
      <div className="bg-diagonal-pattern" />
      <div className="bg-text opacity-15">
        <span>EXPERIENCE</span>
      </div>

      <div className="divider-glow" />
      <div className="section-glow-left" />
      <div className="section-glow-right" />
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
          05 — Experience
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#e8e8e8] tracking-tight mb-14"
        >
          Where I&apos;ve worked.
        </motion.h2>

        <div>
          {portfolioData.workExperience.map((job, index) => (
            <motion.div
              key={index}
              custom={index + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-5"
            >
              <TiltCard className="card-dark p-8 md:p-10 group relative w-full h-full">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Left */}
                <div>
                  <p className="text-base font-bold text-[#e8e8e8] mb-1 group-hover:text-white transition-colors">
                    {job.position}
                  </p>
                  <p className="text-sm text-[#484848] mb-4">{job.company}</p>
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#2a2a2a] uppercase">
                    {job.duration}
                  </span>
                </div>

                {/* Right: achievements */}
                <ul className="space-y-4">
                  {job.achievements.map((ach, i) => (
                    <li key={i} className="flex gap-4 text-sm text-[#484848] leading-relaxed">
                      <span className="text-[#1e1e1e] flex-shrink-0 mt-0.5 font-bold">—</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

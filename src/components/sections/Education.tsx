"use client";
import { portfolioData } from "@/lib/data";
import { motion, Variants } from "framer-motion";
import { BackgroundBeams } from "../ui/background-beams";
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

export default function Education() {
  const { education } = portfolioData;

  return (
    <section id="education" className="relative py-32 overflow-hidden bg-[#0b0c10]">
      {/* Background elements */}
      <div className="bg-grid-pattern opacity-40" />
      <div className="bg-text opacity-20">
        <span>EDUCATION</span>
      </div>

      <div className="divider-glow" />
      <div className="section-glow-left" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="section-label mb-14"
        >
          04 — Education
        </motion.p>

        {/* Tambahkan "relative" (dan letakkan elemen lain di atas z-index jika perlu) */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <TiltCard className="relative card-dark p-8 md:p-10 overflow-hidden group w-full h-full">
          
          {/* Bungkus konten aslinya di div relative agar teks tidak tertimpa efek glow */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="section-label mb-5">Bachelor&apos;s Degree</p>
              <h3 className="text-2xl md:text-3xl font-bold text-[#e8e8e8] tracking-tight mb-2">
                {education.institution}
              </h3>
              <p className="text-[#484848] text-base">{education.degree}</p>
            </div>

            <div className="flex gap-10 md:text-right flex-shrink-0">
              <div>
                <p className="section-label mb-2">Duration</p>
                <p className="text-sm text-[#5a5a5a]">{education.duration}</p>
              </div>
              <div>
                <p className="section-label mb-2">GPA</p>
                <p className="text-sm font-bold text-[#e8e8e8]">{education.gpa}</p>
              </div>
            </div>
          </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
"use client";
import { portfolioData } from "@/lib/data";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Skills() {
  const categories = Object.entries(portfolioData.skills);

  return (
    <section id="skills" className="relative py-28 overflow-hidden">
      <div className="divider-glow" />
      <div className="section-glow-right" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="section-label mb-4"
        >
          02 — Tech Stack
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#e8e8e8] tracking-tight mb-12"
        >
          Tools I work with.
        </motion.h2>

        {/* 2-column layout for categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {categories.map(([category, items], catIdx) => (
            <div key={category}>
              <motion.div
                custom={catIdx * 2}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#3a3a3a] uppercase">
                  {category}
                </span>
                <div className="flex-1 h-px bg-[#181818]" />
              </motion.div>

              <motion.div
                custom={catIdx * 2 + 1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-2"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
              >
                {items.map((skill) => (
                  <div
                    key={skill.name}
                    className="skill-icon-card"
                    title={skill.name}
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      width={24}
                      height={24}
                    />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
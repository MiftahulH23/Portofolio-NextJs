"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion, Variants } from "framer-motion";

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

export default function Skills() {
  const { data: portfolioData, t } = useLanguage();
  const categories = Object.entries(portfolioData.skills);

  return (
    <section id="skills" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* HEADER SECTION */}
        <div className="mb-16 max-w-3xl">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-accent font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-4"
          >
            <span className="w-8 h-[2px] bg-accent"></span>
            {t.skills.label}
          </motion.p>

          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6"
          >
            {t.skills.heading}
          </motion.h2>
        </div>

        {/* 2-column layout for categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {categories.map(([category, items], catIdx) => (
            <div key={category}>
              <motion.div
                custom={catIdx * 2}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-foreground uppercase">
                  {category}
                </span>
                <div className="flex-1 h-px bg-border" />
              </motion.div>

              <motion.div
                custom={catIdx * 2 + 1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
              >
                {items.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 bg-white border border-border shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl px-4 py-3"
                    title={skill.name}
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      width={22}
                      height={22}
                      className="flex-shrink-0"
                    />
                    <span className="text-sm font-semibold text-foreground tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                      {skill.name}
                    </span>
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
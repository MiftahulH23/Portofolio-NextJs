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

export default function Education() {
  const { data: portfolioData, t } = useLanguage();
  const { education } = portfolioData;

  return (
    <section id="education" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* HEADER SECTION */}
        <div className="mb-10 max-w-3xl">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-accent font-bold tracking-widest text-sm uppercase flex items-center gap-4"
          >
            <span className="w-8 h-[2px] bg-accent"></span>
            {t.education.title}
          </motion.p>
        </div>

        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* ULTRA MINIMALIST BLOCK */}
          <div className="border-t border-b border-border py-12 md:py-16 flex flex-col lg:flex-row justify-between lg:items-center gap-12 group hover:bg-black/[0.01] transition-colors duration-500 -mx-6 px-6 lg:-mx-12 lg:px-12">
            
            {/* Left Side: Degree & Institution */}
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-5 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                {t.education.bachelors}
              </p>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4 group-hover:text-primary transition-colors duration-500 leading-tight">
                {education.degree}
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {education.institution}
              </p>
            </div>

            {/* Right Side: Duration & GPA */}
            <div className="flex flex-col sm:flex-row gap-10 lg:gap-16 lg:text-right flex-shrink-0">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">
                  {t.education.duration}
                </p>
                <p className="text-xl font-medium text-foreground tracking-tight">{education.duration}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">
                  {t.education.gpa}
                </p>
                <p className="text-xl font-medium text-foreground tracking-tight">{education.gpa}</p>
              </div>
            </div>
            
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
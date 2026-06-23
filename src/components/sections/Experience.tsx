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

// Colors for the timeline dots based on the reference image
const dotColors = ["#2A9D8F", "#E76F51", "#E9C46A", "#264653"];
const lightColors = ["rgba(42,157,143,0.15)", "rgba(231,111,81,0.15)", "rgba(233,196,106,0.15)", "rgba(38,70,83,0.15)"];

export default function Experience() {
  const { data: portfolioData, t } = useLanguage();
  return (
    <section id="experience" className="relative py-24 lg:py-32 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* HEADER SECTION */}
        <div className="mb-20 max-w-3xl">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-accent font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-4"
          >
            <span className="w-8 h-[2px] bg-accent"></span>
            {t.experience.title}
          </motion.p>

          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6"
          >
            {t.experience.heading}
          </motion.h2>
        </div>

        {/* TIMELINE LIST */}
        <div className="relative max-w-5xl">
          {/* Dashed Line on Left */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[1px] border-l-2 border-dashed border-border/80" />

          <div className="flex flex-col gap-12 md:gap-16">
            {portfolioData.workExperience.map((job, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative flex flex-col md:flex-row items-start w-full pl-16 md:pl-20"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 w-10 h-10 bg-background flex items-center justify-center z-10">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: lightColors[index % 4] }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: dotColors[index % 4] }} 
                    />
                  </div>
                </div>

                {/* Left Block: Company & Duration */}
                <div className="w-full md:w-[35%] lg:w-1/3 pt-1.5 mb-4 md:mb-0 md:pr-8">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2">{job.company}</h3>
                  <p className="text-sm font-medium tracking-wide text-muted-foreground">{job.duration}</p>
                </div>

                {/* Right Block: Position & Details */}
                <div className="w-full md:w-[65%] lg:w-2/3 pt-1.5">
                  <h4 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {job.position}
                  </h4>
                  <p className="text-base text-muted-foreground leading-relaxed text-justify md:text-left">
                    {job.achievements.join(" ")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

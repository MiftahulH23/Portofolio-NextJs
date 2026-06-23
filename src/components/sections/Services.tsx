"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Layout, Server, Layers, Smartphone } from "lucide-react";

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

const getIcon = (index: number) => {
  switch (index) {
    case 0: return <Layout strokeWidth={1.5} className="w-10 h-10" />;
    case 1: return <Server strokeWidth={1.5} className="w-10 h-10" />;
    case 2: return <Layers strokeWidth={1.5} className="w-10 h-10" />;
    case 3: return <Smartphone strokeWidth={1.5} className="w-10 h-10" />;
    default: return <Layout strokeWidth={1.5} className="w-10 h-10" />;
  }
};

export default function Services() {
  const { data: portfolioData, t } = useLanguage();
  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* TOP: HEADING SECTION */}
        <div className="flex flex-col mb-16">
          <div className="max-w-3xl">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-accent font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-4"
            >
              <span className="w-8 h-[2px] bg-accent"></span>
              {t.services.title}
            </motion.p>

            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6"
            >
              {t.services.heading}
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-muted-foreground leading-relaxed text-lg max-w-2xl"
            >
              I help brands and businesses create beautiful, highly functional, and scalable digital experiences from end to end.
            </motion.p>
          </div>
        </div>

        {/* BOTTOM: SERVICE 2x2 GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {portfolioData.services.map((service, i) => (
            <motion.div
              key={service.number}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group flex flex-col h-full border-t border-border pt-8"
            >
              <div className="flex justify-between items-start mb-8">
                {/* Icon & Number */}
                <div className="flex items-center gap-5">
                  <p className="text-sm font-bold tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                    {service.number}
                  </p>
                  <div className="text-foreground/30 group-hover:text-primary transition-colors duration-500">
                    {getIcon(i)}
                  </div>
                </div>
                {/* Arrow indicator */}
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                  <ArrowUpRight size={18} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-base text-muted-foreground leading-relaxed mb-8 flex-1">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase px-3 py-1.5 bg-white border border-border rounded-full group-hover:border-primary/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA BUTTON AT BOTTOM */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <a 
            href={`https://wa.me/${portfolioData.personalInfo.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-foreground text-background font-bold rounded-full hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-primary/25 hover:-translate-y-1 flex items-center gap-3"
          >
             Start a Project <ArrowUpRight size={18} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}

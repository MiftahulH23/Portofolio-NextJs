"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function Templates() {
  const { data: portfolioData, t } = useLanguage();
  const templates = portfolioData.templates;

  if (!templates || templates.length === 0) return null;

  return (
    <section id="templates" className="relative py-24 lg:py-32 overflow-hidden bg-white">
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
            {t.templates?.title || "Templates"}
          </motion.p>

          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6"
          >
            {t.templates?.heading || "Frontend Templates."}
          </motion.h2>
        </div>

        {/* TEMPLATES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
          {templates.map((template: any, idx: number) => (
            <motion.div
              key={template.title}
              custom={idx + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group"
            >
              <Link href={template.link} className="block relative aspect-video w-full rounded-3xl overflow-hidden mb-8 border border-border shadow-sm group-hover:shadow-xl transition-all duration-500">
                <Image
                  src={template.image}
                  alt={template.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                  <div className="bg-white text-foreground rounded-full p-4 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </Link>

              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold tracking-wide px-3 py-1 bg-background text-foreground rounded-full border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {template.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

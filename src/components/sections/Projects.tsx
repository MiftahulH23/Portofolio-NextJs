"use client";
import { useLanguage } from "@/context/LanguageContext";
import { portfolioDataEn } from "@/lib/data";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
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

type Project = (typeof portfolioDataEn.projects)[number];

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      custom={index + 2}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="col-span-1 md:col-span-2"
    >
      <TiltCard className="bg-white rounded-3xl p-6 border border-border shadow-sm group relative w-full h-full hover:shadow-md transition-shadow duration-300">
        {/* Image */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-2xl bg-background mb-6 border border-border/50">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground text-xs tracking-widest uppercase">{t.projects.noPreview}</span>
            </div>
          )}
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="px-4 py-2 rounded-full border border-border/50 bg-white/90 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] text-primary uppercase shadow-sm">
              {t.projects.featured}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-2">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
              {project.title}
            </h3>
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-background hover:text-foreground transition-all"
                aria-label="Source code"
              >
                <Github size={16} />
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-background hover:text-foreground transition-all"
                aria-label="Live demo"
              >
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-3xl">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase px-3 py-1.5 bg-background border border-border rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function SmallProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      custom={index + 2}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <TiltCard className="bg-white rounded-3xl p-5 border border-border shadow-sm group relative w-full h-full hover:shadow-md transition-shadow duration-300 flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-background mb-5 border border-border/50">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 scale-100 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground text-xs tracking-widest uppercase">{t.projects.noPreview}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-1">
          <div className="flex justify-between items-start gap-3 mb-3">
            <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {project.title}
            </h3>
            <div className="flex gap-1.5 flex-shrink-0">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-background hover:text-foreground transition-all"
                aria-label="Source code"
              >
                <Github size={14} />
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-background hover:text-foreground transition-all"
                aria-label="Live demo"
              >
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="text-[10px] font-bold tracking-widest text-foreground/70 uppercase px-2.5 py-1 bg-background border border-border rounded-full">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center px-1">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  const { data: portfolioData, t } = useLanguage();
  const featured = portfolioData.projects.filter((p) => p.featured);
  const rest = portfolioData.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-24 lg:py-32 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* HEADER SECTION */}
        <div className="mb-16">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-accent font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-4"
          >
            <span className="w-8 h-[2px] bg-accent"></span>
            {t.projects.title}
          </motion.p>

          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6"
          >
            {t.projects.heading}
          </motion.h2>
        </div>

        {/* Featured project — full width */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {featured.map((project, i) => (
              <FeaturedProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Remaining projects — 3 column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {rest.map((project, i) => (
            <SmallProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
        
      </div>
    </section>
  );
}
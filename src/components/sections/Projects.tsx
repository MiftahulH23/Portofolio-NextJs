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
  return (
    <motion.div
      custom={index + 2}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="col-span-1 md:col-span-2"
    >
      <TiltCard className="project-card group relative w-full h-full">
      {/* Image */}
      <div className="relative w-full h-72 overflow-hidden bg-[#0a0a0a]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#2a2a2a] text-xs tracking-widest uppercase">No Preview</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/20 to-transparent" />
        
        {/* Featured Badge */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[9px] font-bold tracking-[0.2em] text-white uppercase shadow-lg">
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-bold text-[#e8e8e8] tracking-tight group-hover:text-white transition-colors leading-tight">
            {project.title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#444444] hover:text-[#aaaaaa] transition-colors"
              aria-label="Source code"
            >
              <Github size={15} />
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#444444] hover:text-[#aaaaaa] transition-colors"
              aria-label="Live demo"
            >
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <p className="text-sm text-[#5a5a5a] leading-relaxed mb-6">{project.description}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-auto">
          {project.technologies.map((tech) => (
            <span key={tech} className="text-[10px] font-bold tracking-widest text-[#3e3e3e] uppercase">
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
  return (
    <motion.div
      custom={index + 2}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <TiltCard className="project-card group relative w-full h-full">
      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden bg-[#0a0a0a]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 opacity-55 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#2a2a2a] text-xs tracking-widest uppercase">No Preview</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-base font-bold text-[#d8d8d8] tracking-tight group-hover:text-white transition-colors leading-tight">
            {project.title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#404040] hover:text-[#888888] transition-colors"
              aria-label="Source code"
            >
              <Github size={13} />
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#404040] hover:text-[#888888] transition-colors"
              aria-label="Live demo"
            >
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <p className="text-xs text-[#505050] leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-auto">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[9px] font-bold tracking-widest text-[#3d3d3d] uppercase">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[9px] font-bold text-[#333333] uppercase">
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
    <section id="projects" className="relative py-32 overflow-hidden bg-[#0b0c10]">
      {/* Background elements */}
      <div className="bg-dot-pattern" />
      <div className="bg-text opacity-15">
        <span>PROJECTS</span>
      </div>

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
          06 — {t.projects.title}
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#e8e8e8] tracking-tight mb-14"
        >
          Selected work.
        </motion.h2>

        {/* Featured project — full width */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {featured.map((project, i) => (
              <FeaturedProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Remaining projects — 3 column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {rest.map((project, i) => (
            <SmallProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
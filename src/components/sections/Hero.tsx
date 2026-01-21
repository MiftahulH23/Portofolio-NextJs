"use client";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { ArrowRight, Download, Linkedin } from "lucide-react";

export default function Hero() {
  return (
    <section className="h-[35rem] w-full flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Effect - Beda warna grid untuk Light & Dark */}
      <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Masking Gradient */}
      <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Spotlight Effect (Hanya visible di Dark Mode biar rapi) */}
      <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge Status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Siap untuk Peluang Baru
          </div>

          {/* Main Headline - Text Gradient disesuaikan */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-white dark:to-white/60 mb-6">
            Building Digital <br />
            <span className="text-blue-600 dark:text-blue-500">Experiences that Matter.</span>
          </h1>

          {/* Sub Headline */}
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10">
            Seorang Full-Stack Developer yang fokus menciptakan aplikasi web modern, cepat, dan <i>scalable</i>.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#projects" 
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold transition hover:bg-blue-700 hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              Lihat Karya <ArrowRight size={18} />
            </a>
            <a 
              href={portfolioData.personalInfo.linkedin}
              target="_blank"
              className="px-8 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
            >
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
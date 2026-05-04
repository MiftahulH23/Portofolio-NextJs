"use client";
import { portfolioData } from "@/lib/data";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlowingEffect } from "../ui/glowing-effect";

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

export default function Services() {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div className="divider-glow" />
      <div className="section-glow-left" />
      <div className="section-glow-accent" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="section-label mb-4"
        >
          03 — What I Do
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#e8e8e8] tracking-tight mb-14"
        >
          Services I provide.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
          {portfolioData.services.map((service, i) => (
            <motion.div
              key={service.number}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="service-card group"
            >
              {/* Number */}
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#252525] mb-8">
                {service.number}
              </p>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#e8e8e8] tracking-tight mb-4 group-hover:text-white transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#3e3e3e] leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold tracking-widest text-[#2a2a2a] uppercase px-2.5 py-1 border border-[#181818] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow on hover */}
              <div className="flex justify-end mt-6">
                <ArrowUpRight
                  size={16}
                  className="text-[#1e1e1e] group-hover:text-[#444444] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

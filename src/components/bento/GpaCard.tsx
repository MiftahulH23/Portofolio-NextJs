"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";
import { CountUp } from "./CountUp";

const R = 48;
const C = 2 * Math.PI * R;

export function GpaCard() {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();
  const { gpa, gpaMax, institution } = content.education;
  const offset = C * (1 - gpa / gpaMax);
  const label = fmt(ui.gpa.aria, { value: gpa.toFixed(2), max: gpaMax.toFixed(2) });

  return (
    <BentoCard cols={3} rows={2} delay={0.15} className="flex items-center gap-5">
      <div role="img" aria-label={label} className="relative size-[120px] shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#27272A" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#A3E635"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={reduce ? false : { strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: offset }}
            style={reduce ? { strokeDashoffset: offset } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </svg>
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[26px] font-extrabold">
          <CountUp value={gpa} decimals={2} />
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xl font-bold">{ui.gpa.label}</span>
        <span className="text-sm leading-snug text-ink-300">{institution}</span>
      </div>
    </BentoCard>
  );
}

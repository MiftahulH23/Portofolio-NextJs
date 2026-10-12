"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { pad } from "@/lib/format";
import { BentoCard } from "./BentoCard";

export function ProcessCard() {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();

  return (
    <BentoCard cols={12} rows={2} className="flex flex-col gap-6 p-8 bento:p-9">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs text-lime">{ui.process.kicker}</span>
        <h2 className="text-[32px] font-extrabold tracking-[-0.03em]">{ui.process.heading}</h2>
      </div>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-1.5 top-1.5 hidden h-0.5 bg-ink-600 bento:block" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-1.5 top-1.5 hidden h-0.5 origin-left bg-lime bento:block"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
        />
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 bento:grid-cols-4">
          {content.process.map((s, i) => (
            <li key={s.title} className="relative flex flex-col gap-2.5 pt-8">
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-0 size-3.5 rounded-full border-2 border-lime"
                initial={reduce ? false : { backgroundColor: "#09090B" }}
                whileInView={{ backgroundColor: "#A3E635" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.35 }}
              />
              <span className="font-mono text-xs text-ink-300">{pad(i + 1)}</span>
              <span className="text-[21px] font-extrabold">{s.title}</span>
              <span className="text-sm leading-normal text-ink-300">{s.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </BentoCard>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";

/** Spans the full row when there is no live GitHub graph beside it. */
export function TerminalCard({ wide = false }: { wide?: boolean }) {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();
  const skills = content.skills.reduce((n, g) => n + g.items.length, 0);
  const lines = [
    fmt(ui.terminal.skills, { n: skills }),
    fmt(ui.terminal.projects, { n: content.projects.length }),
    ui.terminal.availability,
    fmt(ui.terminal.ready, { email: content.personal.email }),
  ];

  return (
    <BentoCard cols={wide ? 12 : 6} rows={wide ? 2 : 3} aria-label={ui.terminal.aria} className="bg-[#050506] font-mono text-[15px] leading-[1.9] text-ink-200">
      <div aria-hidden="true" className="mb-[18px] flex gap-[7px]">
        <span className="size-[11px] rounded-full bg-[#FF5F57]" />
        <span className="size-[11px] rounded-full bg-[#FEBC2E]" />
        <span className="size-[11px] rounded-full bg-[#28C840]" />
      </div>
      <div className="flex gap-2.5 whitespace-nowrap">
        <span className="text-lime" aria-hidden="true">❯</span>
        <span
          className="inline-block animate-type overflow-hidden"
          style={{ "--type-ch": `${ui.terminal.command.length}ch` } as React.CSSProperties}
        >
          {ui.terminal.command}
        </span>
        <span aria-hidden="true" className="h-5 w-[9px] animate-caret self-center bg-ink-50" />
      </div>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          className={i === lines.length - 1 ? "text-ink-50" : "text-ink-300"}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 + i * 0.35, duration: 0.4 }}
        >
          {line}
        </motion.p>
      ))}
    </BentoCard>
  );
}

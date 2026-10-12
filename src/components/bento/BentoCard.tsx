"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const COLS = {
  3: "bento:col-span-3",
  4: "bento:col-span-4",
  5: "bento:col-span-5",
  6: "bento:col-span-6",
  7: "bento:col-span-7",
  8: "bento:col-span-8",
  12: "bento:col-span-12",
} as const;

const ROWS = {
  1: "bento:row-span-1",
  2: "bento:row-span-2",
  3: "bento:row-span-3",
  4: "bento:row-span-4",
} as const;

export type BentoCols = keyof typeof COLS;
export type BentoRows = keyof typeof ROWS;

export function bentoSpan(cols: BentoCols, rows: BentoRows): string {
  return `${COLS[cols]} ${ROWS[rows]}`;
}

interface BentoCardProps {
  cols: BentoCols;
  rows: BentoRows;
  id?: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function BentoCard({ cols, rows, id, className, delay = 0, children, ...rest }: BentoCardProps) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      aria-label={rest["aria-label"]}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn(
        "relative min-h-[220px] scroll-mt-24 overflow-hidden rounded-3xl border border-ink-700 bg-ink-850 p-7",
        "transition-[translate,border-color] duration-500 hover:-translate-y-1 hover:border-ink-500 bento:min-h-0",
        bentoSpan(cols, rows),
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

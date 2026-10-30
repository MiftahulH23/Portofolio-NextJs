"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";

const R = 48;
const C = 2 * Math.PI * R;

export function GpaCard() {
  const { content, ui } = useLanguage();
  const { gpa, gpaMax, institution } = content.education;
  const offset = C * (1 - gpa / gpaMax);
  const label = fmt(ui.gpa.aria, { value: gpa.toFixed(2), max: gpaMax.toFixed(2) });

  return (
    <BentoCard cols={3} rows={2} gate="education" className="flex items-center gap-5">
      <div role="img" aria-label={label} className="relative size-[120px] shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#27272A" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="var(--gate)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
          />
        </svg>
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[26px] font-extrabold tabular-nums">
          {gpa.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xl font-bold">{ui.gpa.label}</span>
        <span className="text-sm leading-snug text-ink-300">{institution}</span>
      </div>
    </BentoCard>
  );
}

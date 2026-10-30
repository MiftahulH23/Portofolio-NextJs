"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { BentoCard, CardLabel } from "./BentoCard";

export function ExperienceCard() {
  const { content, ui } = useLanguage();
  return (
    <BentoCard cols={6} rows={2} id="about" gate="experience" className="flex flex-col gap-[18px]">
      <CardLabel>{ui.experience.label}</CardLabel>
      <ol className="flex flex-col gap-[18px]">
        {content.experience.map((e, i) => (
          <li key={e.company + e.position} className="grid grid-cols-[10px_1fr] items-start gap-x-4 gap-y-0.5 sm:grid-cols-[10px_1fr_auto]">
            <span
              aria-hidden="true"
              className={cn("mt-[7px] size-2.5 rounded-full", i === 0 ? "bg-[var(--gate)]" : "border-2 border-ink-400")}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[19px] font-bold">{e.position}</span>
              <span className="text-[15px] text-ink-300">{e.company}</span>
            </div>
            {/* Under the company on phones, at the right edge from sm up. */}
            <span className="col-start-2 whitespace-nowrap font-mono text-xs tabular-nums text-ink-300 sm:col-start-3 sm:row-start-1 sm:pt-1">{e.duration}</span>
          </li>
        ))}
      </ol>
    </BentoCard>
  );
}

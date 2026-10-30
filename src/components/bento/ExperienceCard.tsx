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
          <li key={e.company + e.position} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className={cn("mt-[7px] size-2.5 shrink-0 rounded-full", i === 0 ? "bg-[var(--gate)]" : "border-2 border-ink-400")}
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[19px] font-bold">{e.position}</span>
              <span className="text-[15px] text-ink-300">{e.company}</span>
            </div>
            <span className="whitespace-nowrap font-mono text-xs tabular-nums text-ink-300">{e.duration}</span>
          </li>
        ))}
      </ol>
    </BentoCard>
  );
}

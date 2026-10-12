"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";

export function ExperienceCard() {
  const { content, ui } = useLanguage();
  return (
    <BentoCard cols={6} rows={2} id="about" delay={0.2} className="flex flex-col gap-[18px]">
      <span className="font-mono text-xs text-ink-300">{ui.experience.label}</span>
      <ol className="flex flex-col gap-[18px]">
        {content.experience.map((e, i) => (
          <li key={e.company + e.position} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className={cn("mt-[7px] size-2.5 shrink-0 rounded-full", i === 0 ? "bg-lime" : "border-2 border-ink-400")}
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[19px] font-bold">{e.position}</span>
              <span className="text-[15px] text-ink-300">{e.company}</span>
            </div>
            <span className="font-mono text-xs text-ink-300">{e.duration}</span>
          </li>
        ))}
      </ol>
    </BentoCard>
  );
}

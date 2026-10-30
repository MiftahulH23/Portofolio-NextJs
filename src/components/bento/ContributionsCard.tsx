"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Contributions } from "@/lib/github";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";

const LEVEL_BG = ["bg-[#1C1C21]", "bg-[#26331A]", "bg-[#3F5B1F]", "bg-[#6B9B2A]", "bg-lime"] as const;

export function ContributionsCard({ data, login }: { data: Contributions; login: string }) {
  const { ui } = useLanguage();
  // The offline sample pattern is never shown: it would read as real activity.
  if (data.source !== "github") return null;

  return (
    <BentoCard cols={6} rows={3} gate="profile" className="flex flex-col justify-between gap-[18px]">
      <div className="flex flex-wrap justify-between gap-3 text-sm">
        <a href={`https://github.com/${login}`} target="_blank" rel="noreferrer" className="font-semibold text-[var(--gate)] underline-offset-4 hover:underline">
          github.com/{login}
        </a>
        <span className="text-ink-300">{ui.contributions.live}</span>
      </div>
      <div role="img" aria-label={ui.contributions.aria} className="grid grid-flow-col grid-rows-7 gap-[5px]">
        {data.days.map((d, i) => (
          <span
            key={d.date || i}
            title={d.date ? `${d.date}: ${d.count}` : undefined}
            className={`aspect-square rounded-[4px] ${LEVEL_BG[d.level]}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[26px] font-bold tracking-[-0.02em]">{ui.contributions.heading}</span>
        <span className="text-sm text-ink-300">{fmt(ui.contributions.total, { n: data.total })}</span>
      </div>
    </BentoCard>
  );
}

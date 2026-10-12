"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Contributions } from "@/lib/github";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";

const LEVEL_BG = ["bg-[#1C1C21]", "bg-[#26331A]", "bg-[#3F5B1F]", "bg-[#6B9B2A]", "bg-lime"] as const;

export function ContributionsCard({ data, login }: { data: Contributions; login: string }) {
  const { ui } = useLanguage();
  const live = data.source === "github";

  return (
    <BentoCard cols={6} rows={3} delay={0.05} className="flex flex-col justify-between gap-[18px]">
      <div className="flex flex-wrap justify-between gap-3 font-mono text-xs text-ink-300">
        <a href={`https://github.com/${login}`} target="_blank" rel="noreferrer" className="hover:text-ink-50">
          github.com/{login}
        </a>
        <span>{live ? ui.contributions.live : ui.contributions.sample}</span>
      </div>
      <div role="img" aria-label={ui.contributions.aria} className="grid grid-flow-col grid-rows-7 gap-[5px]">
        {data.days.map((d, i) => (
          <span
            key={d.date || i}
            title={d.date ? `${d.date}: ${d.count}` : undefined}
            className={`aspect-square rounded-[4px] ${LEVEL_BG[d.level]} ${d.level > 0 ? "animate-shimmer" : ""}`}
            style={d.level > 0 ? { animationDelay: `${((i * 37) % 30) / 10}s` } : undefined}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[26px] font-bold tracking-[-0.02em]">{ui.contributions.heading}</span>
        {live && <span className="font-mono text-xs text-ink-300">{fmt(ui.contributions.total, { n: data.total })}</span>}
      </div>
    </BentoCard>
  );
}

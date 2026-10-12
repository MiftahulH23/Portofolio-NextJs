"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useLocalTime } from "@/hooks/useLocalTime";
import { BentoCard } from "./BentoCard";

export function LocationCard() {
  const { content, ui } = useLanguage();
  const p = content.personal;
  const time = useLocalTime(p.timezone);

  return (
    <BentoCard cols={3} rows={2} delay={0.1} className="flex flex-col justify-between">
      <span className="font-mono text-xs text-ink-300">{ui.location.label}</span>
      <div aria-hidden="true" className="absolute -right-10 -top-10 size-[180px] overflow-hidden rounded-full border border-ink-600">
        <div className="absolute inset-0 animate-spin-slow [animation-duration:6s]">
          <div className="absolute left-1/2 top-0 h-1/2 w-1/2 bg-[conic-gradient(from_0deg_at_0%_100%,rgba(163,230,53,0)_0deg,rgba(163,230,53,.28)_80deg,rgba(163,230,53,0)_90deg)]" />
        </div>
        <span className="absolute left-[48%] top-[58%] size-2 rounded-full bg-lime" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[30px] font-bold tracking-[-0.02em]">{p.location}</span>
        <span className="font-mono text-[13px] text-ink-300">
          {p.timezoneLabel} · {time ? `${time} ${ui.location.local}` : ui.location.remote}
        </span>
      </div>
    </BentoCard>
  );
}

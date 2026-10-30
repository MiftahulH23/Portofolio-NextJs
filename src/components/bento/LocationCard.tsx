"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useLocalTime } from "@/hooks/useLocalTime";
import { BentoCard, CardLabel } from "./BentoCard";

export function LocationCard() {
  const { content, ui } = useLanguage();
  const p = content.personal;
  const time = useLocalTime(p.timezone);

  return (
    <BentoCard cols={3} rows={2} gate="profile" className="flex flex-col justify-between">
      <CardLabel>{ui.location.label}</CardLabel>
      <div className="flex flex-col gap-1">
        <span className="text-[30px] font-bold leading-tight tracking-[-0.02em]">{p.location}</span>
        <span className="text-[15px] text-ink-300">
          {time ? (
            <>
              <span className="font-mono tabular-nums text-ink-50">{time}</span> {ui.location.local}, {p.timezoneLabel}
            </>
          ) : (
            ui.location.remote
          )}
        </span>
      </div>
    </BentoCard>
  );
}

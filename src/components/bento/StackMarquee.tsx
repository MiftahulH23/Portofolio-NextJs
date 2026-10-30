"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BentoCard } from "./BentoCard";

export function StackMarquee() {
  const { content, ui } = useLanguage();
  const items = content.skills.flatMap((g) => g.items);

  return (
    <BentoCard cols={12} rows={1} id="stack" gate="skills" className="flex min-h-24 items-center p-0">
      <ul aria-label={ui.stack.aria} className="sr-only">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee gap-14 whitespace-nowrap pl-7 text-[34px] font-bold tracking-[-0.02em] text-ink-500 hover:[animation-play-state:paused]"
      >
        {[...items, ...items].map((s, i) => (
          <span key={i} className="inline-flex items-center gap-14">
            {s}
            <span className="size-2.5 rounded-full bg-[var(--gate)]" />
          </span>
        ))}
      </div>
    </BentoCard>
  );
}

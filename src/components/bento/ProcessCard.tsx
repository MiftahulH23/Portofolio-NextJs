"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { BentoCard, CardLabel } from "./BentoCard";

export function ProcessCard() {
  const { content, ui } = useLanguage();

  return (
    <BentoCard cols={12} rows={2} gate="skills" className="flex flex-col gap-6 p-8 bento:p-9">
      <div className="flex flex-col gap-1.5">
        <CardLabel>{ui.process.kicker}</CardLabel>
        <h2 className="text-[32px] font-extrabold tracking-[-0.03em]">{ui.process.heading}</h2>
      </div>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-1.5 top-1.5 hidden h-0.5 bg-ink-600 bento:block" />
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 bento:grid-cols-4">
          {content.process.map((s, i) => (
            <li key={s.title} className="relative flex flex-col gap-2.5 pt-8">
              <span aria-hidden="true" className="absolute left-0 top-0 size-3.5 rounded-full border-2 border-[var(--gate)] bg-ink-850" />
              <span className="text-sm font-semibold tabular-nums text-[var(--gate)]">{fmt(ui.process.step, { n: i + 1 })}</span>
              <span className="text-[21px] font-extrabold">{s.title}</span>
              <span className="text-sm leading-normal text-ink-300">{s.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </BentoCard>
  );
}

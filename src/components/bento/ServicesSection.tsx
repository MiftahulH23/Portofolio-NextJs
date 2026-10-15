"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BentoCard, bentoSpan } from "./BentoCard";
import { ServiceIcon3D } from "./ServiceIcon3D";

export function ServicesSection() {
  const { content, ui } = useLanguage();
  return (
    <>
      <div id="services" className={`flex scroll-mt-24 flex-wrap items-end justify-between gap-4 px-1 pb-2 pt-10 bento:pt-0 ${bentoSpan(12, 1)}`}>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[13px] text-lime">{ui.services.kicker}</span>
          <h2 className="text-[52px] font-extrabold leading-none tracking-[-0.04em]">{ui.services.heading}</h2>
        </div>
        <p className="max-w-[420px] text-[17px] text-ink-300">{ui.services.sub}</p>
      </div>
      {content.services.map((s, i) => (
        <BentoCard key={s.number} cols={3} rows={2} delay={i * 0.06} className="group flex flex-col gap-3.5">
          <div className="flex items-start justify-between pt-1">
            <span className="font-mono text-[13px] text-ink-300">{s.number}</span>
            <ServiceIcon3D icon={s.icon} delay={i * -1.6} />
          </div>
          <h3 className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.02em]">{s.title}</h3>
          <p className="flex-1 text-sm leading-normal text-ink-300">{s.description}</p>
          <span className="font-mono text-[11px] text-ink-200">{s.tags.join(" · ")}</span>
        </BentoCard>
      ))}
    </>
  );
}

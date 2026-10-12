"use client";

import { Award, GraduationCap } from "lucide-react";
import type { Certification } from "@/content";
import { useLanguage } from "@/context/LanguageContext";
import { BentoCard } from "./BentoCard";

export function EducationCard({ wide }: { wide: boolean }) {
  const { content, ui } = useLanguage();
  const e = content.education;
  return (
    <BentoCard cols={wide ? 12 : 5} rows={2} id="education" className="flex flex-col justify-between gap-3.5">
      <span className="font-mono text-xs text-ink-300">{ui.education.label}</span>
      <div className="flex items-center gap-[18px]">
        <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-[18px] border border-ink-500 bg-[#1C1C21] text-lime">
          <GraduationCap className="size-[30px]" />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[21px] font-extrabold">{e.institution}</span>
          <span className="text-[15px] text-ink-300">{e.degree}</span>
        </div>
      </div>
      <div className="flex justify-between gap-3 border-t border-ink-600 pt-3.5 font-mono text-[13px] text-ink-200">
        <span>{e.duration}</span>
        <span className="text-lime">
          {ui.gpa.label} {e.gpa.toFixed(2)}
        </span>
      </div>
    </BentoCard>
  );
}

export function CertificationsCard({ certifications }: { certifications: Certification[] }) {
  const { ui } = useLanguage();
  if (certifications.length === 0) return null;
  const row = "flex items-center gap-3.5 rounded-[14px] border border-ink-600 bg-ink-800 px-3.5 py-3";

  return (
    <BentoCard cols={7} rows={2} id="certs" className="flex flex-col gap-2.5 overflow-y-auto">
      <span className="font-mono text-xs text-ink-300">{ui.certs.label}</span>
      {certifications.map((c) => {
        const body = (
          <>
            <span aria-hidden="true" className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-lime text-ink-950">
              <Award className="size-[18px]" />
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-base font-bold">{c.name}</span>
              <span className="text-[13px] text-ink-300">
                {c.issuer} · {c.year}
              </span>
            </span>
            {c.url && <span className="font-mono text-xs text-ink-200">{ui.certs.verify}</span>}
          </>
        );
        return c.url ? (
          <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className={`${row} transition-colors hover:border-ink-500`}>
            {body}
          </a>
        ) : (
          <div key={c.name} className={row}>
            {body}
          </div>
        );
      })}
    </BentoCard>
  );
}

export function EducationRow() {
  const { content } = useLanguage();
  const certs = content.certifications;
  return (
    <>
      <EducationCard wide={certs.length === 0} />
      <CertificationsCard certifications={certs} />
    </>
  );
}

"use client";

import { Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ContactForm } from "@/components/contact/ContactForm";
import { BentoCard } from "./BentoCard";

export function ContactSection() {
  const { content, ui } = useLanguage();
  const p = content.personal;

  return (
    <BentoCard cols={12} rows={4} id="contact" className="flex flex-wrap p-0">
      <div className="flex min-w-0 flex-[1_1_360px] flex-col justify-between gap-7 bg-lime p-8 text-ink-950 bento:p-10">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[13px]">{ui.contact.kicker}</span>
          <h2 className="text-[clamp(44px,5.4vw,84px)] font-extrabold leading-[0.9] tracking-[-0.05em]">
            {ui.contact.heading1}
            <br />
            {ui.contact.heading2}
          </h2>
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <div className="flex flex-wrap gap-2.5">
            <a href={`mailto:${p.email}`} className="inline-flex min-h-[52px] items-center rounded-[14px] bg-ink-950 px-6 text-[17px] font-bold text-ink-50">
              {p.email}
            </a>
            {p.cvUrl && (
              <a href={p.cvUrl} download className="inline-flex min-h-[52px] items-center gap-2 rounded-[14px] border-2 border-ink-950 px-5 text-[17px] font-bold">
                <Download className="size-[18px]" aria-hidden="true" />
                {ui.contact.cvPdf}
              </a>
            )}
          </div>
          <div className="flex gap-[18px] font-mono text-[13px]">
            <a href={p.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={p.socials.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={p.whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-[1.3_1_440px] flex-col p-8 bento:p-10">
        <ContactForm />
      </div>
    </BentoCard>
  );
}

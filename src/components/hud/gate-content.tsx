"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { RINGKAS } from "@/lib/site";
import type { GateKey } from "@/world/gates";

const chip = "rounded-full border border-[#38e1ff]/40 px-2.5 py-1 font-mono text-xs text-[#38e1ff]";
const item = "border-t border-white/10 pt-2.5 text-sm leading-relaxed";

export function GateContent({ gate }: { gate: GateKey }) {
  const { content: c, ui } = useLanguage();
  const t = ui.world.cards;
  switch (gate) {
    case "profile":
      return (
        <>
          <p className="text-[14.5px] leading-relaxed text-ink-200">{c.personal.headline}</p>
          <p className="text-[14.5px] leading-relaxed text-ink-200">{c.personal.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className={chip}>{c.personal.location}</span>
            <span className={chip}>{t.available}</span>
          </div>
        </>
      );
    case "skills":
      return (
        <ul className="grid gap-2.5">
          {c.skills.map((g) => (
            <li key={g.group} className={item}>
              <b className="block text-ink-50">{g.group}</b>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span key={s} className={chip}>{s}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      );
    case "experience":
      return (
        <ul className="grid gap-2.5">
          {c.experience.map((e) => (
            <li key={e.company + e.position} className={item}>
              <b className="block text-ink-50">{e.position}</b>
              <small className="font-mono text-xs text-ink-300">{e.company} · {e.duration}</small>
              {e.achievements[0] && <p className="mt-1 text-ink-200">{e.achievements[0]}</p>}
            </li>
          ))}
        </ul>
      );
    case "projects":
      return (
        <ul className="grid gap-2.5">
          {c.projects.map((p) => (
            <li key={p.slug} className={item}>
              <Link href={`/projects/${p.slug}`} className="block font-bold text-ink-50 underline-offset-4 hover:underline">{p.title}</Link>
              <small className="font-mono text-xs text-ink-300">{p.technologies.slice(0, 4).join(" · ")}</small>
              <p className="mt-1 text-ink-200">{p.description}</p>
            </li>
          ))}
        </ul>
      );
    case "education":
      return (
        <>
          <p className="text-[14.5px] text-ink-200">
            {c.education.degree}
            <br />
            {c.education.duration}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[54px] font-extrabold leading-none text-lime">{c.education.gpa.toFixed(2)}</span>
            <span className="text-xl text-ink-300">/ {c.education.gpaMax.toFixed(2)}</span>
          </div>
          <p className="text-sm text-ink-300">{t.gpa}</p>
        </>
      );
    case "contact":
      return (
        <>
          <p className="text-[14.5px] leading-relaxed text-ink-200">{t.contactBody}</p>
          <ul className="grid gap-2.5">
            <li className={item}>
              <b className="block text-ink-50">{t.email}</b>
              <a href={`mailto:${c.personal.email}`} className="text-[#38e1ff]">{c.personal.email}</a>
            </li>
            <li className={item}>
              <b className="block text-ink-50">GitHub</b>
              <a href={c.personal.socials.github} target="_blank" rel="noreferrer" className="text-[#38e1ff]">{c.personal.socials.github.replace(/^https?:\/\//, "")}</a>
            </li>
            <li className={item}>
              <b className="block text-ink-50">LinkedIn</b>
              <a href={c.personal.socials.linkedin} target="_blank" rel="noreferrer" className="text-[#38e1ff]">{c.personal.socials.linkedin.replace(/^https?:\/\//, "")}</a>
            </li>
          </ul>
          <Link href={`${RINGKAS}#contact`} className="inline-flex min-h-11 items-center rounded-xl bg-lime px-4 font-bold text-ink-950">{t.sendMessage}</Link>
        </>
      );
  }
}

export function gateTitle(gate: GateKey, c: ReturnType<typeof useLanguage>): string {
  const t = c.ui.world.cards;
  switch (gate) {
    case "profile": return c.content.personal.name;
    case "skills": return t.skillsTitle;
    case "experience": return t.experienceTitle;
    case "projects": return t.projectsTitle;
    case "education": return c.content.education.institution;
    case "contact": return t.contactTitle;
  }
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { BentoCard, CardLabel } from "./BentoCard";

export function ProjectList() {
  const { content, ui } = useLanguage();
  const others = content.projects.filter((p) => !p.featured);

  return (
    <BentoCard cols={4} rows={4} gate="projects" className="flex flex-col gap-1">
      <CardLabel className="mb-2">{ui.projects.label}</CardLabel>
      {others.map((p) => (
        <Link
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="group flex flex-1 flex-col justify-center gap-1.5 border-t border-ink-700 py-4 first-of-type:border-t-0"
        >
          <span className="text-[19px] font-bold leading-tight decoration-[var(--gate)] underline-offset-4 group-hover:underline">{p.title}</span>
          <span className="text-[13px] text-ink-300">{p.technologies.slice(0, 3).join(", ")}</span>
        </Link>
      ))}
    </BentoCard>
  );
}

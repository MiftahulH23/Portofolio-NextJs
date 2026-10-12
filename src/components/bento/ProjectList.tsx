"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { pad } from "@/lib/format";
import { BentoCard } from "./BentoCard";

export function ProjectList() {
  const { content, ui } = useLanguage();
  const others = content.projects.filter((p) => !p.featured);

  return (
    <BentoCard cols={4} rows={4} delay={0.05} className="flex flex-col gap-3">
      <span className="font-mono text-xs text-ink-300">{ui.projects.label}</span>
      {others.map((p) => (
        <Link
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="flex flex-1 flex-col justify-between gap-2.5 rounded-2xl border border-ink-600 bg-ink-800 p-5 transition-colors hover:border-ink-500"
        >
          <span className="flex justify-between gap-3">
            <span className="font-mono text-xs text-lime">{pad(content.projects.indexOf(p) + 1)}</span>
            <ArrowUpRight className="size-4 text-ink-300" aria-hidden="true" />
          </span>
          <span className="text-[19px] font-bold leading-tight">{p.title}</span>
          <span className="font-mono text-xs text-ink-300">{p.technologies.slice(0, 3).join(" · ")}</span>
        </Link>
      ))}
    </BentoCard>
  );
}

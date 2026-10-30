"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt, hostOf } from "@/lib/format";
import { BentoCard, CardLabel } from "./BentoCard";
import { BrowserBar } from "./BrowserBar";

export function FeaturedProject() {
  const { content, ui } = useLanguage();
  const project = content.projects.find((p) => p.featured) ?? content.projects[0];

  return (
    <BentoCard cols={8} rows={4} id="work" gate="projects" className="flex flex-col gap-5 p-8 bento:p-9">
      <div className="flex items-start justify-between gap-3">
        <div className="flex max-w-[560px] flex-col gap-2">
          <CardLabel>{ui.featured.kicker}</CardLabel>
          <h2 className="text-[clamp(28px,3vw,36px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{project.title}</h2>
        </div>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            aria-label={ui.featured.live}
            className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--gate)] text-ink-950"
          >
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </a>
        )}
      </div>

      <div className="flex min-h-[260px] flex-1 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--gate)_14%,#0e0e11)] p-6">
        <div className="w-[82%] overflow-hidden rounded-xl border border-ink-500/60 bg-[#1C1C21] shadow-[0_40px_80px_rgba(0,0,0,.55)]">
          <BrowserBar url={hostOf(project.demo)} />
          <div className="relative aspect-[16/10]">
            <Image
              src={project.image}
              alt={fmt(ui.caseStudy.screenshotAlt, { title: project.title })}
              fill
              sizes="(min-width: 900px) 600px, 90vw"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-200">
        {project.technologies.map((t) => (
          <span key={t} className="rounded-full border border-[var(--gate)]/35 px-3 py-1">
            {t}
          </span>
        ))}
        <Link href={`/projects/${project.slug}`} className="ml-auto text-base font-bold text-[var(--gate)] underline-offset-4 hover:underline">
          {ui.featured.readCase}
        </Link>
      </div>
    </BentoCard>
  );
}

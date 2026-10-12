"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/content";
import { useLanguage } from "@/context/LanguageContext";
import { fmt, hostOf, pad } from "@/lib/format";
import { BrowserBar } from "@/components/bento/BrowserBar";
import { TiltCard } from "@/components/ui/TiltCard";
import { CaseSections } from "./CaseSections";

interface Props {
  project: Project;
  index: number;
  total: number;
  next: Project;
  nextIndex: number;
}

export function CaseStudyView({ project, index, total, next, nextIndex }: Props) {
  const { ui } = useLanguage();
  const c = ui.caseStudy;
  const cs = project.caseStudy ?? {};
  const meta = [
    { label: c.role, value: project.role },
    cs.timeline ? { label: c.timeline, value: cs.timeline } : null,
    cs.team ? { label: c.team, value: cs.team } : null,
    { label: c.stack, value: project.technologies.slice(0, 3).join(" · ") },
  ].filter((m): m is { label: string; value: string } => m !== null);

  return (
    <main className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <div className="flex items-center justify-between gap-4 py-4">
        <Link href="/#work" className="inline-flex min-h-11 items-center gap-2.5 font-mono text-sm text-ink-200 hover:text-ink-50">
          <ArrowLeft className="size-[18px]" aria-hidden="true" />
          {c.back}
        </Link>
        <span className="font-mono text-[13px] text-ink-300">
          {pad(index)} / {pad(total)}
        </span>
      </div>

      <section className="flex flex-col gap-7 pb-10 pt-8">
        <span className="font-mono text-[13px] text-lime">{c.kicker}</span>
        <h1 className="max-w-[1100px] text-[clamp(44px,7vw,104px)] font-extrabold leading-[0.92] tracking-[-0.05em]">{project.title}</h1>
        <p className="max-w-[760px] text-[22px] leading-normal text-ink-300">{project.description}</p>
        <dl className="grid grid-cols-1 border-y border-ink-600 sm:grid-cols-2 bento:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {meta.map((m) => (
            <div key={m.label} className="flex flex-col gap-1.5 py-5 pr-5 bento:border-l bento:border-ink-600 bento:px-5 bento:first:border-l-0 bento:first:pl-0">
              <dt className="font-mono text-xs text-ink-300">{m.label}</dt>
              <dd className="text-lg font-bold">{m.value}</dd>
            </div>
          ))}
          {(project.demo || project.github) && (
            <div className="flex flex-wrap items-center gap-2.5 py-5 bento:border-l bento:border-ink-600 bento:px-5">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-lime px-4 font-bold text-ink-950">
                  {c.live}
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-ink-500 px-4 font-bold">
                  {c.source}
                </a>
              )}
            </div>
          )}
        </dl>
      </section>

      <TiltCard max={4} className="flex items-center justify-center rounded-[28px] border border-ink-700 bg-ink-900 p-6 bento:p-12">
        <div className="w-full animate-float overflow-hidden rounded-[14px] border border-ink-500/60 bg-[#1C1C21] shadow-[0_50px_100px_rgba(0,0,0,.6)]">
          <BrowserBar url={hostOf(project.demo)} />
          <div className="relative aspect-[16/9]">
            <Image src={project.image} alt={fmt(c.screenshotAlt, { title: project.title })} fill priority sizes="(min-width: 1312px) 1200px, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </TiltCard>

      <CaseSections project={project} caseStudy={cs} />

      <Link href={`/projects/${next.slug}`} className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-lime p-10 text-ink-950">
        <span className="flex flex-col gap-1.5">
          <span className="font-mono text-[13px]">{fmt(c.next, { n: pad(nextIndex) })}</span>
          <span className="text-[clamp(30px,4vw,56px)] font-extrabold leading-none tracking-[-0.04em]">{next.title}</span>
        </span>
        <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-ink-950 text-lime">
          <ArrowRight className="size-6" />
        </span>
      </Link>
    </main>
  );
}

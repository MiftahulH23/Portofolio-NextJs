"use client";

import Image from "next/image";
import type { CaseStudy, Project } from "@/content";
import { useLanguage } from "@/context/LanguageContext";
import { pad } from "@/lib/format";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

const card = "rounded-3xl border border-ink-700 bg-ink-850 p-[30px]";
const kicker = "font-mono text-xs text-lime";

export function CaseSections({ project, caseStudy }: { project: Project; caseStudy: CaseStudy }) {
  const { ui } = useLanguage();
  const c = ui.caseStudy;
  const { problem, responsibilities, architecture, features, challenges, results } = caseStudy;
  const hasProblemRow = Boolean(problem) || Boolean(responsibilities?.length);
  const hasDetailRow = Boolean(features?.length) || Boolean(challenges?.length);

  return (
    <>
      {hasProblemRow && (
        <section className="grid grid-cols-1 gap-4 pt-16 bento:grid-cols-12">
          {problem && (
            <div className={`${card} flex flex-col gap-3.5 bento:col-span-7`}>
              <span className={kicker}>{c.problem}</span>
              <h2 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em]">{problem.headline}</h2>
              <p className="text-[17px] leading-[1.65] text-ink-300">{problem.body}</p>
            </div>
          )}
          {responsibilities?.length ? (
            <div className={`${card} flex flex-col gap-3.5 ${problem ? "bento:col-span-5" : "bento:col-span-12"}`}>
              <span className={kicker}>{c.myRole}</span>
              <ul className="flex flex-col gap-3">
                {responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-base leading-normal">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      {architecture?.length ? (
        <section className={`${card} mt-4 flex flex-col gap-8 p-10`}>
          <div className="flex flex-col gap-1.5">
            <span className={kicker}>{c.architecture}</span>
            <h2 className="text-[32px] font-extrabold tracking-[-0.03em]">{c.archHeading}</h2>
          </div>
          <ArchitectureDiagram nodes={architecture} />
        </section>
      ) : null}

      {hasDetailRow && (
        <section className="grid grid-cols-1 gap-4 pt-4 bento:grid-cols-12">
          {features?.length ? (
            <div className={`${card} flex flex-col gap-4 ${challenges?.length ? "bento:col-span-6" : "bento:col-span-12"}`}>
              <span className={kicker}>{c.features}</span>
              <ul className="flex flex-col gap-2.5">
                {features.map((f, i) => (
                  <li key={f.title} className="flex items-start gap-3.5 rounded-[14px] bg-ink-800 p-3.5">
                    <span className="pt-[3px] font-mono text-xs text-lime">{pad(i + 1)}</span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[17px] font-bold">{f.title}</span>
                      <span className="text-sm text-ink-300">{f.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {challenges?.length ? (
            <div className={`${card} flex flex-col gap-4 bg-[#050506] ${features?.length ? "bento:col-span-6" : "bento:col-span-12"}`}>
              <span className={kicker}>{c.challenges}</span>
              <div className="flex flex-col gap-[18px] font-mono text-sm leading-[1.8] text-ink-200">
                {challenges.map((ch) => (
                  <p key={ch.problem}>
                    <span className="text-danger">{c.problemLabel}</span> <span>{ch.problem}</span>
                    <br />
                    <span className="text-lime">{c.solutionLabel}</span> <span>{ch.solution}</span>
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      )}

      {results?.length ? (
        <section aria-label={c.results} className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.label} className={`${card} flex flex-col gap-2`}>
              <span className="text-[52px] font-extrabold tracking-[-0.04em] text-lime">{r.value}</span>
              <span className="text-[15px] text-ink-300">{r.label}</span>
            </div>
          ))}
        </section>
      ) : null}

      {project.gallery?.length ? (
        <section aria-label={c.gallery} className="grid grid-cols-1 gap-4 pt-4 bento:grid-cols-2">
          {project.gallery.map((g) => (
            <div key={g.src} className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-ink-700 bg-ink-850">
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 900px) 640px, 100vw" className="object-cover object-top" />
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}

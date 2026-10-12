"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GithubIcon } from "@/components/icons";
import { BentoCard } from "./BentoCard";

const ghost = "inline-flex min-h-[52px] items-center gap-2.5 rounded-[14px] border border-ink-500 px-[22px] font-semibold transition-colors hover:border-ink-300";

export function IntroCard() {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();
  const p = content.personal;
  const words = p.name.split(" ");

  return (
    <BentoCard cols={8} rows={3} reveal={false} aria-label={ui.intro.aria} className="flex flex-col justify-between gap-8 p-8 bento:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-lime" />
          <span className="relative size-2.5 rounded-full bg-lime" />
        </span>
        <span className="font-mono text-[13px] text-ink-200">
          {ui.intro.status} · {p.location}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        <h1 className="text-[clamp(52px,6.4vw,96px)] font-extrabold leading-[0.9] tracking-[-0.05em]">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block"
              initial={reduce ? false : { y: 24 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
          <span className="animate-caret text-lime" aria-hidden="true">
            _
          </span>
        </h1>
        <p className="max-w-[620px] text-[21px] leading-[1.45] text-ink-300">
          {p.tagline.lead} <span className="text-ink-50">{p.tagline.highlight}</span> {p.tagline.tail}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/#work" className="inline-flex min-h-[52px] items-center gap-2.5 rounded-[14px] bg-ink-50 px-6 font-bold text-ink-950">
          {ui.intro.explore}
          <ArrowUpRight className="size-[18px]" aria-hidden="true" />
        </Link>
        <a href={p.socials.github} target="_blank" rel="noreferrer" className={ghost}>
          <GithubIcon className="size-[18px]" />
          {ui.intro.github}
        </a>
        {p.cvUrl && (
          <a href={p.cvUrl} download className={ghost}>
            <Download className="size-[18px]" aria-hidden="true" />
            {ui.intro.downloadCv}
          </a>
        )}
      </div>
    </BentoCard>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { RINGKAS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";

const primary = "inline-flex min-h-[52px] items-center gap-2 rounded-[14px] bg-lime px-6 font-bold text-ink-950 shadow-[0_0_30px_rgba(163,230,53,.35)] disabled:opacity-70";
const ghost = "inline-flex min-h-[52px] items-center gap-2 rounded-[14px] border border-white/15 px-6 font-bold text-ink-50 hover:border-white/30";

export function Intro({ hidden }: { hidden: boolean }) {
  const { content, ui, toggleLanguage } = useLanguage();
  const w = ui.world.intro;
  const webgl = useWebGLSupport();
  const reduce = useReducedMotion() ?? false;
  const phase = useWorld((s) => s.phase);

  const start = webgl ? (
    <button type="button" onClick={() => worldStore.start()} disabled={phase === "loading"} className={reduce ? ghost : primary}>
      {phase === "loading" ? w.loading : phase === "failed" ? w.retry : w.start}
    </button>
  ) : null;
  const compact = (
    <Link href={RINGKAS} className={reduce || !webgl ? primary : ghost}>
      {w.compact}
    </Link>
  );

  return (
    <section
      aria-label={w.aria}
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={cn(
        "fixed inset-0 isolate z-40 grid place-items-center overflow-y-auto px-4 py-8 transition-opacity duration-500",
        hidden && "pointer-events-none opacity-0",
      )}
    >
      <Image src="/world/intro-bg.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(255,61,168,.22), transparent 60%), linear-gradient(to bottom, rgba(7,7,15,.62), rgba(7,7,15,.94))" }}
      />
      <div className="flex max-w-[660px] flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-[#ff3da8]/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[.14em] text-[#ff3da8]">{w.tag}</span>
          <button type="button" onClick={toggleLanguage} aria-label={ui.world.hud.switchLang} className="min-h-11 rounded-xl border border-white/15 px-3 font-mono text-xs text-ink-200">
            {ui.world.hud.langLabel}
          </button>
        </div>
        <h1 className="text-[clamp(40px,8vw,84px)] font-extrabold leading-[.92] tracking-[-0.03em] text-balance">
          {w.titleLead} <em className="not-italic text-lime [text-shadow:0_0_28px_rgba(163,230,53,.55)]">{content.personal.name}</em>
        </h1>
        <p className="max-w-[54ch] text-[17px] leading-relaxed text-ink-200">{w.summary}</p>
        {!webgl && <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-ink-200">{w.noWebgl}</p>}
        {webgl && reduce && <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-ink-200">{w.reducedMotion}</p>}
        <div className="flex flex-wrap gap-3">
          {reduce || !webgl ? (
            <>
              {compact}
              {start}
            </>
          ) : (
            <>
              {start}
              {compact}
            </>
          )}
        </div>
        <p className="font-mono text-xs leading-[1.8] text-ink-300">
          {w.keys}
          <br />
          {w.touch}
        </p>
      </div>
    </section>
  );
}

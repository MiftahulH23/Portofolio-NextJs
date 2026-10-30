"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { RINGKAS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { KeyHints } from "./KeyHints";

const primary = "inline-flex min-h-[52px] items-center gap-2 rounded-full bg-lime px-7 font-bold text-ink-950 disabled:opacity-70";
const ghost = "inline-flex min-h-[52px] items-center gap-2 rounded-full px-5 font-bold text-ink-50 underline decoration-white/30 underline-offset-[6px] hover:decoration-white";

export function Intro({ hidden }: { hidden: boolean }) {
  const { content, ui, toggleLanguage } = useLanguage();
  const w = ui.world.intro;
  const webgl = useWebGLSupport();
  const reduce = usePrefersReducedMotion();
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
      <Image src="/world/intro-bg.jpg" alt="" fill fetchPriority="low" sizes="100vw" className="-z-10 object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(255,61,168,.22), transparent 60%), linear-gradient(to bottom, rgba(7,7,15,.62), rgba(7,7,15,.94))" }}
      />
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label={ui.world.hud.switchLang}
        className="absolute right-4 top-[calc(16px+env(safe-area-inset-top))] min-h-11 rounded-full border border-white/15 px-4 text-sm font-semibold text-ink-200 hover:text-ink-50"
      >
        {ui.world.hud.langLabel}
      </button>
      <div className="flex w-full max-w-[640px] flex-col gap-6">
        <div>
          <h1 className="text-[clamp(48px,10vw,104px)] font-extrabold leading-[.88] tracking-[-0.04em] text-balance">{content.personal.name}</h1>
          <p className="mt-3 text-[clamp(18px,2.4vw,22px)] font-semibold text-ink-200">{w.role}</p>
        </div>
        <p className="max-w-[52ch] text-[17px] leading-relaxed text-ink-300">{w.summary}</p>
        {!webgl && <p className="rounded-md border-l-[3px] border-[#ffb020] bg-white/5 p-3 text-sm text-ink-200">{w.noWebgl}</p>}
        {webgl && reduce && <p className="rounded-md border-l-[3px] border-[#ffb020] bg-white/5 p-3 text-sm text-ink-200">{w.reducedMotion}</p>}
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
        {webgl && (
          <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
            <KeyHints className="[@media(pointer:coarse)]:hidden" />
            <p className="text-sm text-ink-300">{w.touch}</p>
          </div>
        )}
      </div>
    </section>
  );
}

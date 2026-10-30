"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Ellipsis, Languages, Smartphone, Volume2, VolumeX, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { RINGKAS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";

const pill = "pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-[#0d0c1a]/85 px-3 font-mono text-xs text-ink-200 backdrop-blur hover:text-ink-50";
const plain = "pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold text-ink-300 transition-colors hover:bg-white/[.06] hover:text-ink-50";
const row = "flex min-h-12 w-full items-center gap-3 rounded-xl px-2.5 text-left text-sm text-ink-50 transition-colors active:bg-white/[.06]";
const chip = "grid size-8 shrink-0 place-items-center rounded-lg bg-white/[.06] text-lime";

function DesktopControls() {
  const { ui, toggleLanguage } = useLanguage();
  const muted = useWorld((s) => s.muted);
  const h = ui.world.hud;
  return (
    <div className="flex items-center rounded-full bg-[#05050a]/85 p-1 [@media(pointer:coarse)]:hidden">
      <button type="button" className={plain} onClick={() => worldStore.toggleMute()} aria-label={muted ? h.unmute : h.mute} aria-pressed={muted}>
        {muted ? <VolumeX className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}
      </button>
      <button type="button" className={plain} onClick={toggleLanguage} aria-label={h.switchLang}>
        {h.langLabel}
      </button>
      <Link href={RINGKAS} className={plain}>
        {h.compact}
      </Link>
    </div>
  );
}

function MenuPanel() {
  const { ui, lang, setLang } = useLanguage();
  const muted = useWorld((s) => s.muted);
  const reduce = useReducedMotion() ?? false;
  const h = ui.world.hud;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 w-60 origin-top-right rounded-2xl border border-white/10 bg-[#0d0c1a]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,.55)] backdrop-blur-xl"
    >
      <button type="button" role="switch" aria-checked={!muted} aria-label={h.sound} onClick={() => worldStore.toggleMute()} className={row}>
        <span className={chip}>{muted ? <VolumeX className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}</span>
        <span className="flex-1">{h.sound}</span>
        <span aria-hidden="true" className={cn("relative h-6 w-10 rounded-full transition-colors", muted ? "bg-white/15" : "bg-lime")}>
          <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]", muted ? "left-0.5" : "left-[18px]")} />
        </span>
      </button>
      <div className={row} role="group" aria-label={h.language}>
        <span className={chip}><Languages className="size-4" aria-hidden="true" /></span>
        <span className="flex-1">{h.language}</span>
        <span className="flex rounded-lg bg-white/[.06] p-0.5 font-mono text-[11px] font-semibold">
          {(["en", "id"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={cn("min-h-8 rounded-md px-2.5 uppercase transition-colors", lang === l ? "bg-lime text-ink-950" : "text-ink-300")}
            >
              {l}
            </button>
          ))}
        </span>
      </div>
      <div aria-hidden="true" className="mx-2.5 my-1 h-px bg-white/10" />
      <Link href={RINGKAS} className={row}>
        <span className={chip}><Smartphone className="size-4" aria-hidden="true" /></span>
        <span className="flex-1">{h.compact}</span>
        <ArrowUpRight className="size-4 text-ink-300" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}

/** Touch screens fold the controls behind one button to keep the view clear. */
function TouchMenu() {
  const h = useLanguage().ui.world.hud;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div ref={ref} className="relative hidden [@media(pointer:coarse)]:block">
      <button
        type="button"
        className={cn(pill, "size-11 justify-center px-0", open && "border-lime/60 text-lime")}
        onClick={() => setOpen((o) => !o)}
        aria-label={h.menu}
        aria-expanded={open}
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Ellipsis className="size-5" aria-hidden="true" />}
      </button>
      <AnimatePresence>{open && <MenuPanel />}</AnimatePresence>
    </div>
  );
}

export function HudControls() {
  return (
    <div className="fixed right-4 top-[calc(14px+env(safe-area-inset-top))] z-30">
      <DesktopControls />
      <TouchMenu />
    </div>
  );
}

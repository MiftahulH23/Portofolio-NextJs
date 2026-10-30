"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Smartphone, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useWorld } from "@/world/useWorld";

type Tip = "controls" | "rotate";

export const TIP_KEYS: Record<Tip, string> = { controls: "portfolio-tip-controls", rotate: "portfolio-tip-rotate" };
const SHOW_MS = 5000;

function seen(tip: Tip) {
  try {
    return window.localStorage.getItem(TIP_KEYS[tip]) === "1";
  } catch {
    return false;
  }
}

function markSeen(tip: Tip) {
  try {
    window.localStorage.setItem(TIP_KEYS[tip], "1");
  } catch {
    // Storage blocked: the tip may show again next visit, which is harmless.
  }
}

const plate = "rounded-[4px] border-l-4 border-lime bg-[#05050a]/90 text-ink-50";
const bubble = `${plate} max-w-[46%] px-3 py-1.5 text-[13px] font-semibold leading-snug`;

/** First-visit tips on touch screens: how to ride, then a nudge to rotate to landscape. */
export function TouchTips() {
  const t = useLanguage().ui.world.hud.tips;
  const running = useWorld((s) => s.phase === "running");
  const card = useWorld((s) => s.card);
  const reduce = useReducedMotion() ?? false;
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    if (!running || !window.matchMedia("(pointer: coarse)").matches) return;
    const queue: Tip[] = [];
    if (!seen("controls")) queue.push("controls");
    if (!seen("rotate") && window.matchMedia("(orientation: portrait)").matches) queue.push("rotate");
    const timers = queue.flatMap((next, i) => [
      setTimeout(() => {
        markSeen(next);
        setTip(next);
      }, 800 + i * (SHOW_MS + 600)),
      setTimeout(() => setTip((cur) => (cur === next ? null : cur)), 800 + i * (SHOW_MS + 600) + SHOW_MS),
    ]);
    const landscape = window.matchMedia("(orientation: landscape)");
    const onTurn = () => landscape.matches && setTip((cur) => (cur === "rotate" ? null : cur));
    landscape.addEventListener("change", onTurn);
    return () => {
      timers.forEach(clearTimeout);
      landscape.removeEventListener("change", onTurn);
    };
  }, [running]);

  const motionProps = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } };

  return (
    <div role="status" className="pointer-events-none fixed inset-x-4 bottom-[calc(84px+env(safe-area-inset-bottom))] z-30">
      <AnimatePresence>
        {tip === "controls" && !card && (
          <motion.div key="controls" {...motionProps} className="flex items-end justify-between">
            <span className={bubble}>{t.steer}</span>
            <span className={cn(bubble, "border-l-0 border-r-4 text-right")}>{t.ride}</span>
          </motion.div>
        )}
        {tip === "rotate" && !card && (
          <motion.div
            key="rotate"
            {...motionProps}
            className={cn(plate, "pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-2.5 py-1.5 pl-3 pr-1.5 text-sm")}
          >
            <motion.span
              aria-hidden="true"
              className="text-lime"
              animate={reduce ? undefined : { rotate: [0, 0, -90, -90, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Smartphone className="size-5" />
            </motion.span>
            <span>{t.rotate}</span>
            <button type="button" onClick={() => setTip(null)} aria-label={t.dismiss} className="grid size-9 shrink-0 place-items-center rounded-full text-ink-300">
              <X className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

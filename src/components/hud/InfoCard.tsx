"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { GATES, type GateKey } from "@/world/gates";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { gateStyle } from "./gate-color";
import { GateContent, gateTitle } from "./gate-content";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** Non-modal: the rider keeps control while it is open. */
export function InfoCard() {
  const card = useWorld((s) => s.card);
  if (!card) return null;
  // Keyed so every newly opened gate starts collapsed on touch screens.
  return <Card key={card} card={card} />;
}

/** On touch screens it opens as a compact strip so it doesn't cover the bike; the body expands on demand. */
function Card({ card }: { card: GateKey }) {
  const lang = useLanguage();
  const id = useId();
  const bodyId = useId();
  const [open, setOpen] = useState(false);
  // Read once: riding through the gate gets the full arrival, reopening from the route bar only fades in.
  const [arrived] = useState(() => worldStore.getState().arrived);
  const reduce = usePrefersReducedMotion();
  const gate = GATES.find((g) => g.key === card)!;
  const hud = lang.ui.world.hud;
  const play = arrived && !reduce;
  return (
    <motion.aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={id}
      style={gateStyle(card)}
      initial={reduce ? false : play ? { clipPath: "inset(0 0 0 100%)" } : { opacity: 0 }}
      animate={play ? { clipPath: "inset(0 0 0 0%)" } : { opacity: 1 }}
      transition={{ duration: play ? 0.32 : 0.18, ease: EASE }}
      className={cn(
        "fixed right-4 top-[110px] z-30 flex max-h-[calc(100dvh-220px)] w-[min(400px,calc(100%-32px))] flex-col gap-4 overflow-y-auto rounded-[6px] border-l-[6px] border-[var(--gate)] bg-[#05050a]/95 p-[22px] pl-5",
        "[@media(pointer:coarse)]:bottom-[calc(84px+env(safe-area-inset-bottom))] [@media(pointer:coarse)]:top-auto [@media(pointer:coarse)]:gap-2 [@media(pointer:coarse)]:p-4",
        open ? "[@media(pointer:coarse)]:max-h-[42dvh]" : "[@media(pointer:coarse)]:overflow-hidden",
      )}
    >
      {play && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 origin-right bg-[var(--gate)]"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ delay: 0.3, duration: 0.38, ease: EASE }}
        />
      )}
      <header className="flex shrink-0 items-start gap-3.5 pr-12 [@media(pointer:coarse)]:items-center [@media(pointer:coarse)]:pr-24">
        <motion.span
          aria-hidden="true"
          initial={play ? { y: 18, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3, ease: EASE }}
          className="text-[64px] font-extrabold leading-[.8] tracking-[-0.05em] text-[var(--gate)] tabular-nums [@media(pointer:coarse)]:text-[36px]"
        >
          {gate.index + 1}
        </motion.span>
        <div className="min-w-0">
          <span className="sr-only">{fmt(lang.ui.world.cards.eyebrow, { n: gate.index + 1, name: lang.ui.world.gates[card] })}</span>
          <span aria-hidden="true" className="block text-sm font-semibold text-[var(--gate)] [@media(pointer:coarse)]:text-xs">
            {lang.ui.world.gates[card]}
          </span>
          <h2 id={id} className="mt-0.5 text-2xl font-bold leading-tight text-balance [@media(pointer:coarse)]:truncate [@media(pointer:coarse)]:text-lg">
            {gateTitle(card, lang)}
          </h2>
        </div>
      </header>
      <div id={bodyId} className={cn("flex flex-col gap-3", !open && "[@media(pointer:coarse)]:hidden")}>
        <GateContent gate={card} />
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        aria-label={open ? hud.hideDetails : hud.details}
        className="absolute right-[62px] top-3 hidden size-11 place-items-center rounded-full border border-[var(--gate)]/50 text-[var(--gate)] [@media(pointer:coarse)]:grid"
      >
        <span aria-hidden="true" className={cn("transition-transform", open && "rotate-180")}>▴</span>
      </button>
      <button
        type="button"
        onClick={() => worldStore.closeCard()}
        aria-label={hud.close}
        className="absolute right-3.5 top-3.5 size-11 rounded-full text-ink-300 hover:bg-white/[.06] hover:text-ink-50 [@media(pointer:coarse)]:right-3 [@media(pointer:coarse)]:top-3"
      >
        ✕
      </button>
    </motion.aside>
  );
}

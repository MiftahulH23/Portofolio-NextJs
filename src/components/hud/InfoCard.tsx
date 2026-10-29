"use client";

import { useId, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { GATES, type GateKey } from "@/world/gates";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { GateContent, gateTitle } from "./gate-content";

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
  const gate = GATES.find((g) => g.key === card)!;
  const hud = lang.ui.world.hud;
  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={id}
      className={cn(
        "fixed right-4 top-[110px] z-30 flex max-h-[calc(100dvh-220px)] w-[min(400px,calc(100%-32px))] flex-col gap-3 overflow-y-auto rounded-[18px] border border-white/15 bg-[#0d0c1a]/90 p-[22px] backdrop-blur-md",
        "[@media(pointer:coarse)]:bottom-[calc(84px+env(safe-area-inset-bottom))] [@media(pointer:coarse)]:top-auto [@media(pointer:coarse)]:gap-2 [@media(pointer:coarse)]:p-4",
        open ? "[@media(pointer:coarse)]:max-h-[42dvh]" : "[@media(pointer:coarse)]:overflow-hidden",
      )}
    >
      <span className="font-mono text-[11px] uppercase tracking-[.14em] text-lime [@media(pointer:coarse)]:pr-24 [@media(pointer:coarse)]:text-[10px]">
        {fmt(lang.ui.world.cards.eyebrow, { n: gate.index + 1, name: lang.ui.world.gates[card] })}
      </span>
      <h2 id={id} className="shrink-0 pr-10 text-2xl font-bold leading-tight text-balance [@media(pointer:coarse)]:truncate [@media(pointer:coarse)]:pr-24 [@media(pointer:coarse)]:text-lg">
        {gateTitle(card, lang)}
      </h2>
      <div id={bodyId} className={cn("flex flex-col gap-3", !open && "[@media(pointer:coarse)]:hidden")}>
        <GateContent gate={card} />
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        aria-label={open ? hud.hideDetails : hud.details}
        className="absolute right-[62px] top-3 hidden size-11 place-items-center rounded-full border border-lime/50 text-lime [@media(pointer:coarse)]:grid"
      >
        <span aria-hidden="true" className={cn("transition-transform", open && "rotate-180")}>▴</span>
      </button>
      <button
        type="button"
        onClick={() => worldStore.closeCard()}
        aria-label={hud.close}
        className="absolute right-3.5 top-3.5 size-11 rounded-full border border-white/15 text-ink-300 hover:text-ink-50 [@media(pointer:coarse)]:right-3 [@media(pointer:coarse)]:top-3"
      >
        ✕
      </button>
    </aside>
  );
}

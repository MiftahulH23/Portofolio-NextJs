"use client";

import { useId } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { GATES } from "@/world/gates";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { GateContent, gateTitle } from "./gate-content";

/** Non-modal: the rider keeps control while it is open. */
export function InfoCard() {
  const lang = useLanguage();
  const card = useWorld((s) => s.card);
  const id = useId();
  if (!card) return null;
  const gate = GATES.find((g) => g.key === card)!;
  const hud = lang.ui.world.hud;
  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={id}
      className="fixed right-4 top-[110px] z-30 flex max-h-[calc(100dvh-220px)] w-[min(400px,calc(100%-32px))] flex-col gap-3 overflow-y-auto rounded-[18px] border border-white/15 bg-[#0d0c1a]/90 p-[22px] backdrop-blur-md [@media(pointer:coarse)]:bottom-[calc(96px+env(safe-area-inset-bottom))] [@media(pointer:coarse)]:top-auto [@media(pointer:coarse)]:max-h-[40dvh]"
    >
      <div aria-live="polite" className="contents">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-lime">
          {fmt(lang.ui.world.cards.eyebrow, { n: gate.index + 1, name: lang.ui.world.gates[card] })}
        </span>
        <h2 id={id} className="pr-10 text-2xl font-bold leading-tight text-balance">{gateTitle(card, lang)}</h2>
        <GateContent gate={card} />
      </div>
      <button
        type="button"
        onClick={() => worldStore.closeCard()}
        aria-label={hud.close}
        className="absolute right-3.5 top-3.5 size-11 rounded-full border border-white/15 text-ink-300 hover:text-ink-50"
      >
        ✕
      </button>
    </aside>
  );
}

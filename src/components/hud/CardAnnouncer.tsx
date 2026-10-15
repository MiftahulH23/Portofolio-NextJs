"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { GATES } from "@/world/gates";
import { useWorld } from "@/world/useWorld";
import { gateTitle } from "./gate-content";

/** Always-mounted live region, so screen readers hear each card open (the card itself mounts fresh each time). */
export function CardAnnouncer() {
  const lang = useLanguage();
  const card = useWorld((s) => s.card);
  const gate = card && GATES.find((g) => g.key === card);
  const text = gate ? `${fmt(lang.ui.world.cards.eyebrow, { n: gate.index + 1, name: lang.ui.world.gates[gate.key] })}: ${gateTitle(gate.key, lang)}` : "";
  return (
    <div aria-live="polite" className="sr-only">
      {text}
    </div>
  );
}

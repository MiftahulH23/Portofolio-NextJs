"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { useWorld } from "@/world/useWorld";
import { gateStyle } from "./gate-color";

/** A street-sign plate in the colour of the gate it points to. */
export function NavPill() {
  const { ui } = useLanguage();
  const nav = useWorld((s) => s.nav);
  const text = nav ? fmt(ui.world.hud.next, { name: ui.world.gates[nav.key], m: nav.distance }) : ui.world.hud.allVisited;
  return (
    <div
      style={nav ? gateStyle(nav.key) : undefined}
      className="flex items-center gap-2 rounded-[4px] border-l-4 border-[var(--gate,#b6f23a)] bg-[#05050a]/90 py-1.5 pl-2.5 pr-3 text-sm font-semibold tabular-nums text-ink-50 [@media(pointer:coarse)]:py-1 [@media(pointer:coarse)]:text-xs"
    >
      {text}
    </div>
  );
}

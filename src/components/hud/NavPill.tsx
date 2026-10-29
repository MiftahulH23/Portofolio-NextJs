"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { useWorld } from "@/world/useWorld";

export function NavPill() {
  const { ui } = useLanguage();
  const nav = useWorld((s) => s.nav);
  const text = nav ? fmt(ui.world.hud.next, { name: ui.world.gates[nav.key], m: nav.distance }) : ui.world.hud.allVisited;
  return <div className="rounded-full bg-lime px-3 py-1.5 font-mono text-xs [@media(pointer:coarse)]:px-2.5 [@media(pointer:coarse)]:py-1 [@media(pointer:coarse)]:text-[11px] font-semibold text-ink-950 shadow-[0_0_18px_rgba(163,230,53,.35)]">{text}</div>;
}

"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useWorld } from "@/world/useWorld";

export function Speedo() {
  const { ui } = useLanguage();
  const kmh = useWorld((s) => s.kmh);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-[calc(18px+env(safe-area-inset-bottom))] right-[18px] z-20 text-right [@media(pointer:coarse)]:bottom-[calc(94px+env(safe-area-inset-bottom))]">
      <b className="block text-[44px] font-extrabold leading-none tabular-nums [text-shadow:0_0_18px_rgba(56,225,255,.55)]">{kmh}</b>
      <small className="font-mono text-[11px] tracking-[.12em] text-ink-300">{ui.world.hud.speed}</small>
    </div>
  );
}

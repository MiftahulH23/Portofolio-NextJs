"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useWorld } from "@/world/useWorld";

export function Speedo() {
  const { ui } = useLanguage();
  const kmh = useWorld((s) => s.kmh);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-[calc(18px+env(safe-area-inset-bottom))] right-[18px] z-20 text-right [@media(pointer:coarse)]:bottom-auto [@media(pointer:coarse)]:right-4 [@media(pointer:coarse)]:top-[calc(156px+env(safe-area-inset-top))]">
      <b className="block text-[44px] [@media(pointer:coarse)]:text-[26px] font-extrabold leading-none tabular-nums [text-shadow:0_0_18px_rgba(56,225,255,.55)]">{kmh}</b>
      <small className="font-mono text-[11px] [@media(pointer:coarse)]:text-[9px] tracking-[.12em] text-ink-300">{ui.world.hud.speed}</small>
    </div>
  );
}

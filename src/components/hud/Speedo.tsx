"use client";

import { useLanguage } from "@/context/LanguageContext";
import { distance, fmt } from "@/lib/format";
import { useWorld } from "@/world/useWorld";

export function Speedo() {
  const { ui, lang } = useLanguage();
  const kmh = useWorld((s) => s.kmh);
  const meters = useWorld((s) => s.meters);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-[calc(18px+env(safe-area-inset-bottom))] right-[18px] z-20 text-right [@media(pointer:coarse)]:bottom-auto [@media(pointer:coarse)]:right-4 [@media(pointer:coarse)]:top-[calc(156px+env(safe-area-inset-top))]">
      <b className="font-mono text-[52px] font-bold leading-none tabular-nums tracking-[-0.04em] [@media(pointer:coarse)]:text-[26px]">
        {kmh}
        <small className="ml-1 font-display text-sm font-semibold tracking-normal text-ink-300 [@media(pointer:coarse)]:text-[10px]">{ui.world.hud.speed}</small>
      </b>
      <small className="mt-1 block font-mono text-xs tabular-nums text-ink-300 [@media(pointer:coarse)]:hidden">{fmt(ui.world.hud.trip, { distance: distance(meters, lang === "id" ? "id-ID" : "en-US") })}</small>
    </div>
  );
}

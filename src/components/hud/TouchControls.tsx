"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { BikeInput } from "@/world/bike";
import { getRuntime } from "@/world/runtime";

const btn =
  "size-[54px] select-none touch-none rounded-2xl border border-white/15 bg-[#0d0c1a]/80 font-mono text-[15px] font-bold text-ink-50 backdrop-blur data-[on=true]:border-lime data-[on=true]:text-lime";

function Hold({ k, label, children }: { k: keyof BikeInput; label: string; children: React.ReactNode }) {
  const set = (on: boolean) => (e: React.PointerEvent<HTMLButtonElement>) => {
    getRuntime().input[k] = on;
    e.currentTarget.dataset.on = String(on);
    if (on) e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  return (
    <button type="button" aria-label={label} className={btn} onPointerDown={set(true)} onPointerUp={set(false)} onPointerCancel={set(false)} onContextMenu={(e) => e.preventDefault()}>
      {children}
    </button>
  );
}

/** Shown only on coarse pointers (touch screens). */
export function TouchControls({ onBell }: { onBell?: () => void }) {
  const t = useLanguage().ui.world.hud.touch;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-30 hidden justify-between px-4 [@media(pointer:coarse)]:flex">
      <div className="pointer-events-auto flex gap-2.5">
        <Hold k="left" label={t.left}>◀</Hold>
        <Hold k="right" label={t.right}>▶</Hold>
      </div>
      <div className="pointer-events-auto flex gap-2">
        <button type="button" aria-label={t.bell} className={btn} onPointerDown={() => onBell?.()}>
          🔔
        </button>
        <Hold k="brake" label={t.brake}>▼</Hold>
        <Hold k="gas" label={t.gas}>▲</Hold>
      </div>
    </div>
  );
}

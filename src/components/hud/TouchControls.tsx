"use client";

import { Bell, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { BikeInput } from "@/world/bike";
import { getRuntime } from "@/world/runtime";

const base = "grid select-none touch-none place-items-center text-ink-50 transition-colors";
const icon = "size-6 pointer-events-none";

function Hold({ k, label, className, children }: { k: keyof BikeInput; label: string; className: string; children: React.ReactNode }) {
  const set = (on: boolean) => (e: React.PointerEvent<HTMLButtonElement>) => {
    getRuntime().input[k] = on;
    e.currentTarget.dataset.on = String(on);
    if (on) e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(base, className)}
      onPointerDown={set(true)}
      onPointerUp={set(false)}
      onPointerCancel={set(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

/** Shown only on coarse pointers (touch screens). Ride is the big key; brake lights amber like a warning sign. */
export function TouchControls({ onBell }: { onBell?: () => void }) {
  const t = useLanguage().ui.world.hud.touch;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-30 hidden items-end justify-between px-4 [@media(pointer:coarse)]:flex">
      <div className="pointer-events-auto flex h-14 overflow-hidden rounded-full bg-[#05050a]/85">
        <Hold k="left" label={t.left} className="w-16 data-[on=true]:bg-white/15">
          <ChevronLeft className={icon} aria-hidden="true" />
        </Hold>
        <span aria-hidden="true" className="my-3 w-px bg-white/15" />
        <Hold k="right" label={t.right} className="w-16 data-[on=true]:bg-white/15">
          <ChevronRight className={icon} aria-hidden="true" />
        </Hold>
      </div>
      <div className="pointer-events-auto flex items-end gap-2.5">
        <button type="button" aria-label={t.bell} className={cn(base, "size-11 rounded-full bg-[#05050a]/85 text-ink-200 active:text-lime")} onPointerDown={() => onBell?.()}>
          <Bell className="size-5 pointer-events-none" aria-hidden="true" />
        </button>
        <Hold k="brake" label={t.brake} className="size-14 rounded-full border-2 border-transparent bg-[#05050a]/85 data-[on=true]:border-[#ffb020] data-[on=true]:text-[#ffb020]">
          <ChevronDown className={icon} aria-hidden="true" />
        </Hold>
        <Hold k="gas" label={t.gas} className="size-16 rounded-full border-2 border-lime/70 bg-[#05050a]/85 text-lime data-[on=true]:bg-lime data-[on=true]:text-ink-950">
          <ChevronUp className="size-7 pointer-events-none" strokeWidth={2.5} aria-hidden="true" />
        </Hold>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { RINGKAS } from "@/lib/site";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";

const pill = "pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-[#0d0c1a]/85 px-3 font-mono text-xs text-ink-200 backdrop-blur hover:text-ink-50";

export function HudControls() {
  const { ui, toggleLanguage } = useLanguage();
  const muted = useWorld((s) => s.muted);
  const h = ui.world.hud;
  return (
    <div className="fixed right-4 top-[calc(14px+env(safe-area-inset-top))] z-30 flex gap-2">
      <button type="button" className={pill} onClick={() => worldStore.toggleMute()} aria-label={muted ? h.unmute : h.mute} aria-pressed={muted}>
        {muted ? <VolumeX className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}
      </button>
      <button type="button" className={pill} onClick={toggleLanguage} aria-label={h.switchLang}>
        {h.langLabel}
      </button>
      <Link href={RINGKAS} className={pill}>
        {h.compact}
      </Link>
    </div>
  );
}

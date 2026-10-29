"use client";

import Link from "next/link";
import { useState } from "react";
import { Ellipsis, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { RINGKAS } from "@/lib/site";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";

const pill = "pointer-events-auto inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-[#0d0c1a]/85 px-3 font-mono text-xs text-ink-200 backdrop-blur hover:text-ink-50";

function Items() {
  const { ui, toggleLanguage } = useLanguage();
  const muted = useWorld((s) => s.muted);
  const h = ui.world.hud;
  return (
    <>
      <button type="button" className={pill} onClick={() => worldStore.toggleMute()} aria-label={muted ? h.unmute : h.mute} aria-pressed={muted}>
        {muted ? <VolumeX className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}
      </button>
      <button type="button" className={pill} onClick={toggleLanguage} aria-label={h.switchLang}>
        {h.langLabel}
      </button>
      <Link href={RINGKAS} className={pill}>
        {h.compact}
      </Link>
    </>
  );
}

/** Touch screens fold the controls behind one button to keep the view clear. */
export function HudControls() {
  const h = useLanguage().ui.world.hud;
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 top-[calc(14px+env(safe-area-inset-top))] z-30">
      <div className="flex gap-2 [@media(pointer:coarse)]:hidden">
        <Items />
      </div>
      <div className="hidden [@media(pointer:coarse)]:block">
        <button type="button" className={`${pill} size-11 justify-center px-0`} onClick={() => setOpen((o) => !o)} aria-label={h.menu} aria-expanded={open}>
          <Ellipsis className="size-5" aria-hidden="true" />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 flex flex-col items-end gap-2 rounded-2xl border border-white/10 bg-[#0d0c1a]/95 p-2 backdrop-blur">
            <Items />
          </div>
        )}
      </div>
    </div>
  );
}

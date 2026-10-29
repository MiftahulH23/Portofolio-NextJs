"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useWorld } from "@/world/useWorld";
import { CardAnnouncer } from "./CardAnnouncer";
import { FinishDialog } from "./FinishDialog";
import { HudControls } from "./HudControls";
import { InfoCard } from "./InfoCard";
import { Minimap } from "./Minimap";
import { NavPill } from "./NavPill";
import { RouteBar } from "./RouteBar";
import { Speedo } from "./Speedo";
import { Toast } from "./Toast";
import { TouchControls } from "./TouchControls";

export function Hud({ onBell }: { onBell?: () => void }) {
  const { ui } = useLanguage();
  const modal = useWorld((s) => s.finished || s.contextLost);
  return (
    <>
      <div inert={modal} className="contents">
      <div className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-20 flex flex-col items-center gap-2 px-4 pb-0 pt-[58px] sm:pt-3.5 [@media(pointer:coarse)]:items-start [@media(pointer:coarse)]:gap-1.5 [@media(pointer:coarse)]:pr-[72px] [@media(pointer:coarse)]:pt-3.5">
        <RouteBar />
        <NavPill />
      </div>
      <HudControls />
      <Minimap />
      <Speedo />
      <p aria-hidden="true" className="pointer-events-none fixed bottom-[calc(14px+env(safe-area-inset-bottom))] left-[18px] z-20 font-mono text-xs text-ink-300 [@media(pointer:coarse)]:hidden">
        {ui.world.hud.keys}
      </p>
      <Toast />
      <InfoCard />
      <TouchControls onBell={onBell} />
      </div>
      <CardAnnouncer />
      <FinishDialog />
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { Hud } from "./Hud";
import { Intro } from "./Intro";

const WorldCanvas = dynamic(() => import("@/components/world/WorldCanvas"), { ssr: false, loading: () => null });

export function WorldGate() {
  const phase = useWorld((s) => s.phase);
  const running = phase === "running";
  return (
    <>
      {(phase === "loading" || running) && <WorldCanvas onReady={() => worldStore.setPhase("running")} />}
      {running && <Hud />}
      <Intro hidden={running} />
    </>
  );
}

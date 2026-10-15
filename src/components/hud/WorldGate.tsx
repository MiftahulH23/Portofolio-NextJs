"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { createAudio } from "@/components/world/audio";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { getRuntime } from "@/world/runtime";
import { worldStore, type Tier } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { ContextLost } from "./ContextLost";
import { Hud } from "./Hud";
import { Intro } from "./Intro";
import { WorldErrorBoundary } from "./WorldErrorBoundary";

const load = () => import("@/components/world/WorldCanvas");
const WorldCanvas = dynamic(load, { ssr: false, loading: () => null });

const initialTier = (): Tier => (window.matchMedia("(pointer: coarse)").matches ? "low" : "high");

export function WorldGate() {
  const phase = useWorld((s) => s.phase);
  const attempts = useWorld((s) => s.attempts);
  const contextLost = useWorld((s) => s.contextLost);
  const webgl = useWebGLSupport();
  const audio = useMemo(() => createAudio(), []);
  const running = phase === "running";

  // Warm the world chunk while the visitor reads the intro (desktop only).
  useEffect(() => {
    if (!webgl || initialTier() === "low") return;
    const warm = () => void load().catch(() => {});
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(warm, 1500);
    return () => window.clearTimeout(t);
  }, [webgl]);

  useEffect(() => {
    if (phase !== "loading") return;
    const tier = initialTier();
    worldStore.setTier(tier);
    getRuntime(tier);
    audio.unlock();
  }, [phase, audio]);

  const sounds = useMemo(() => ({ onBell: audio.bell, onChime: audio.chime, onHorn: audio.horn, onBump: audio.bump }), [audio]);

  return (
    <>
      {(phase === "loading" || running) && (
        <WorldErrorBoundary key={attempts} onError={() => worldStore.setPhase("failed")}>
          <WorldCanvas onReady={() => worldStore.setPhase("running")} sounds={sounds} />
        </WorldErrorBoundary>
      )}
      {running && <Hud onBell={audio.bell} />}
      {running && contextLost && <ContextLost />}
      <Intro hidden={running} />
    </>
  );
}

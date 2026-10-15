"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useLanguage } from "@/context/LanguageContext";
import { kmh } from "@/world/bike";
import { nearestUnvisited } from "@/world/gates";
import { getRuntime, stepWorld } from "@/world/runtime";
import { canRide, worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { useKeyboardInput } from "./useKeyboardInput";

export interface SoundHooks { onBell?: () => void; onChime?: () => void; onHorn?: () => void; onBump?: () => void }

declare global {
  interface Window { __world?: { tp(x: number, z: number, heading: number): void } }
}

/** The single per-frame simulation tick (priority -1 runs before every renderer). */
export function Simulation({ onBell, onChime, onHorn, onBump }: SoundHooks) {
  const { ui } = useLanguage();
  const hud = useRef(ui.world.hud);
  useEffect(() => {
    hud.current = ui.world.hud;
  }, [ui]);
  const riding = useWorld(canRide);

  const handlers = useMemo(() => ({ onBell: () => onBell?.(), onEscape: () => worldStore.closeCard() }), [onBell]);
  useKeyboardInput(getRuntime().input, handlers, riding);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_E2E !== "1") return;
    window.__world = {
      tp: (x, z, heading) => {
        const r = getRuntime();
        r.bike = { ...r.bike, x, z, heading, v: 0 };
      },
    };
    return () => {
      delete window.__world;
    };
  }, []);

  useFrame((_, dt) => {
    const rt = getRuntime();
    const s = worldStore.getState();
    const ev = stepWorld(rt, dt, canRide(s));
    for (const key of ev.entered) if (worldStore.enterGate(key).first) onChime?.();
    if (ev.bump) {
      onBump?.();
      worldStore.toast(hud.current.toastObstacle);
    }
    if (ev.honk) {
      onHorn?.();
      worldStore.toast(hud.current.toastCar);
    }
    if (ev.nearMiss) worldStore.toast(hud.current.toastPed);
    worldStore.setKmh(kmh(rt.bike.v));
    const n = nearestUnvisited(rt.bike.x, rt.bike.z, worldStore.getState().visited);
    worldStore.setNav(n ? { key: n.gate.key, distance: Math.round(n.distance) } : null);
  }, -1);
  return null;
}

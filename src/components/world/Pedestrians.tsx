"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import type { Group } from "three";
import type { Ped } from "@/world/pedestrians";
import { getRuntime } from "@/world/runtime";
import { useWorld } from "@/world/useWorld";
import { createPedModel } from "./models/ped";

function placePed(m: Group, p: Ped | undefined, bob: number) {
  m.visible = !!p;
  if (!p) return;
  m.position.set(p.x, bob, p.z);
  m.rotation.y = p.facing;
}

export function Pedestrians() {
  const tier = useWorld((s) => s.tier);
  const reduce = useReducedMotion() ?? false;
  const models = useMemo(() => {
    void tier;
    return getRuntime().peds.map((p) => createPedModel(p.shirt, p.skin, p.phone));
  }, [tier]);
  useFrame(({ clock }) => {
    const peds = getRuntime().peds;
    const t = clock.elapsedTime;
    models.forEach((m, i) => {
      const p = peds[i];
      placePed(m, p, !p || p.pause > 0 || reduce ? 0 : Math.abs(Math.sin(t * 7 + p.phase)) * 0.06);
    });
  });
  return (
    <>
      {models.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  );
}

"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import type { Group } from "three";
import { GATES } from "@/world/gates";
import { NEON } from "@/world/palette";
import { getRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";

export function GuideArrow() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const s = worldStore.getState();
    const target = s.nav && GATES.find((x) => x.key === s.nav!.key);
    g.visible = s.phase === "running" && !!target;
    if (!target) return;
    const b = getRuntime().bike;
    g.position.set(b.x, 2.9 + (reduce ? 0 : Math.sin(clock.elapsedTime * 3) * 0.08), b.z);
    g.rotation.y = Math.atan2(target.x - b.x, target.z - b.z);
  });
  return (
    <group ref={ref} visible={false}>
      <mesh position={[0, 0, 0.5]} rotation-x={Math.PI / 2}>
        <coneGeometry args={[0.35, 0.8, 4]} />
        <meshBasicMaterial color={NEON.lime} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0, -0.1]} scale={[0.18, 0.12, 0.7]}>
        <boxGeometry />
        <meshBasicMaterial color={NEON.lime} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

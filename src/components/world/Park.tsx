"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { AdditiveBlending, BufferGeometry, CylinderGeometry, Float32BufferAttribute, IcosahedronGeometry, type Mesh } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BLOCKS, type ParkLayout } from "@/world/city";
import { NEON } from "@/world/palette";
import { mulberry32 } from "@/world/random";
import { glowPointsMaterial } from "./painters/signs";

export function Park({ layout }: { layout: ParkLayout }) {
  const reduce = useReducedMotion() ?? false;
  const jet = useRef<Mesh>(null);
  const lot = BLOCKS.find((b) => b.park)!.lot;
  const { fountain: f } = layout;
  const geo = useMemo(() => {
    const trunks = mergeGeometries(layout.trees.map((t) => new CylinderGeometry(0.18, 0.25, 2, 6).translate(t.x, 1.1, t.z)))!;
    const leaves = mergeGeometries(layout.trees.map((t) => new IcosahedronGeometry(t.size, 0).rotateY(t.rot).translate(t.x, 3.2, t.z)))!;
    const r = mulberry32(55);
    const lights = [NEON.amber, NEON.lime, NEON.magenta].map((color) => {
      const pts: number[] = [];
      for (const t of layout.trees) pts.push(t.x + (r() - 0.5) * 3, 2.4 + r() * 1.8, t.z + (r() - 0.5) * 3);
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pts, 3));
      return { color, g, mat: glowPointsMaterial(color, 0.9) };
    });
    return { trunks, leaves, lights };
  }, [layout]);

  useFrame(({ clock }) => {
    if (jet.current && !reduce) jet.current.scale.y = 1 + Math.sin(clock.elapsedTime * 6) * 0.08;
  });

  return (
    <group>
      <mesh position={[(lot.x0 + lot.x1) / 2, 0.19, (lot.z0 + lot.z1) / 2]}>
        <boxGeometry args={[lot.x1 - lot.x0, 0.1, lot.z1 - lot.z0]} />
        <meshStandardMaterial color={0x0d2a24} roughness={1} />
      </mesh>
      <mesh position={[f.x, 0.35, f.z]}>
        <cylinderGeometry args={[4, 4.3, 0.7, 32]} />
        <meshStandardMaterial color={0x2e2a4a} roughness={0.6} />
      </mesh>
      <mesh position={[f.x, 0.66, f.z]}>
        <cylinderGeometry args={[3.6, 3.6, 0.1, 32]} />
        <meshBasicMaterial color={0x1b8fb0} />
      </mesh>
      <mesh ref={jet} position={[f.x, 2.6, f.z]}>
        <cylinderGeometry args={[0.25, 0.6, 4, 12, 1, true]} />
        <meshBasicMaterial color={NEON.cyan} transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh geometry={geo.trunks}>
        <meshStandardMaterial color={0x2b1d18} />
      </mesh>
      <mesh geometry={geo.leaves}>
        <meshStandardMaterial color={0x14473a} roughness={0.9} flatShading />
      </mesh>
      {geo.lights.map((l) => (
        <points key={l.color} geometry={l.g} material={l.mat} />
      ))}
    </group>
  );
}

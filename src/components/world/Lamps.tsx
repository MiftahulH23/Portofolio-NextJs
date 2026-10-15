"use client";

import { useMemo } from "react";
import { BufferGeometry, CylinderGeometry, Float32BufferAttribute, SphereGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Vec2 } from "@/world/city";
import { glowPointsMaterial } from "./painters/signs";

export function Lamps({ spots }: { spots: Vec2[] }) {
  const geo = useMemo(() => {
    const poles = mergeGeometries(spots.map((s) => new CylinderGeometry(0.09, 0.12, 5.5, 6).translate(s.x, 2.75, s.z)))!;
    const bulbs = mergeGeometries(spots.map((s) => new SphereGeometry(0.26, 10, 8).translate(s.x, 5.6, s.z)))!;
    const halo = new BufferGeometry();
    halo.setAttribute("position", new Float32BufferAttribute(spots.flatMap((s) => [s.x, 5.6, s.z]), 3));
    return { poles, bulbs, halo, haloMat: glowPointsMaterial(0xffd99a, 4.5) };
  }, [spots]);
  return (
    <group>
      <mesh geometry={geo.poles}>
        <meshStandardMaterial color={0x2a2840} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh geometry={geo.bulbs}>
        <meshBasicMaterial color={0xfff1c9} />
      </mesh>
      <points geometry={geo.halo} material={geo.haloMat} />
    </group>
  );
}

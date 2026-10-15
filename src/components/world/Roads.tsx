"use client";

import { useMemo } from "react";
import { BLOCKS, GRID, ROAD_HALF, SEGMENTS, SIDEWALK, CORNER_INSET } from "@/world/city";
import { NEON } from "@/world/palette";
import { boxAt, mergeBy } from "./City";

export function Roads() {
  const geo = useMemo(() => {
    const dashes: { k: number; x: number; z: number; sx: number; sz: number }[] = [];
    for (const s of SEGMENTS)
      for (let t = CORNER_INSET + 2; t < 70 - CORNER_INSET - 2; t += 6)
        dashes.push({ k: 0, x: s.horizontal ? s.a.x + t : s.a.x, z: s.horizontal ? s.a.z : s.a.z + t, sx: s.horizontal ? 3 : 0.18, sz: s.horizontal ? 0.18 : 3 });
    const zebra: typeof dashes = [];
    for (const x of GRID)
      for (const z of GRID)
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx * 70, nz = z + dz * 70;
          if (nx < 0 || nx > 280 || nz < 0 || nz > 280) continue;
          for (let k = -3; k <= 3; k++) {
            const along = ROAD_HALF + 1.8;
            zebra.push({ k: 0, x: x + dx * along + (dz !== 0 ? k * 1.6 : 0), z: z + dz * along + (dx !== 0 ? k * 1.6 : 0), sx: dx !== 0 ? 2.6 : 0.8, sz: dz !== 0 ? 2.6 : 0.8 });
          }
        }
    const slabs = BLOCKS.map((b) => ({ k: 0, b }));
    const curbs = BLOCKS.flatMap((b) => {
      const color = (b.i + b.j) % 2 ? NEON.magenta : NEON.cyan;
      const w = b.x1 - b.x0, d = b.z1 - b.z0, cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
      return [
        { color, g: [w, 0.05, 0.14, cx, 0.16, b.z0] }, { color, g: [w, 0.05, 0.14, cx, 0.16, b.z1] },
        { color, g: [0.14, 0.05, d, b.x0, 0.16, cz] }, { color, g: [0.14, 0.05, d, b.x1, 0.16, cz] },
      ];
    });
    const lo = -ROAD_HALF, hi = 280 + ROAD_HALF, len = hi - lo + SIDEWALK * 2, mid = 140;
    const outer = [
      [len, 0.14, SIDEWALK, mid, 0.07, lo - SIDEWALK / 2], [len, 0.14, SIDEWALK, mid, 0.07, hi + SIDEWALK / 2],
      [SIDEWALK, 0.14, len, lo - SIDEWALK / 2, 0.07, mid], [SIDEWALK, 0.14, len, hi + SIDEWALK / 2, 0.07, mid],
    ];
    const outerCurbs = [
      { color: NEON.magenta, g: [hi - lo, 0.05, 0.14, mid, 0.16, lo] }, { color: NEON.cyan, g: [hi - lo, 0.05, 0.14, mid, 0.16, hi] },
      { color: NEON.cyan, g: [0.14, 0.05, hi - lo, lo, 0.16, mid] }, { color: NEON.magenta, g: [0.14, 0.05, hi - lo, hi, 0.16, mid] },
    ];
    const box = (a: number[]) => boxAt(a[0], a[1], a[2], a[3], a[4], a[5]);
    return {
      dashes: mergeBy(dashes, () => 0, (d) => boxAt(d.sx, 0.02, d.sz, d.x, 0.03, d.z))[0].geometry,
      zebra: mergeBy(zebra, () => 0, (d) => boxAt(d.sx, 0.02, d.sz, d.x, 0.035, d.z))[0].geometry,
      walks: mergeBy([...slabs.map((s) => [s.b.x1 - s.b.x0, 0.14, s.b.z1 - s.b.z0, (s.b.x0 + s.b.x1) / 2, 0.07, (s.b.z0 + s.b.z1) / 2]), ...outer], () => 0, box)[0].geometry,
      curbs: mergeBy([...curbs, ...outerCurbs], (c) => c.color, (c) => box(c.g)),
    };
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[140, 0, 140]}>
        <planeGeometry args={[1600, 1600]} />
        <meshStandardMaterial color={0x110f1d} roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh geometry={geo.walks}>
        <meshStandardMaterial color={0x272241} roughness={0.9} />
      </mesh>
      <mesh geometry={geo.dashes}>
        <meshBasicMaterial color={0x8f89b8} />
      </mesh>
      <mesh geometry={geo.zebra}>
        <meshBasicMaterial color={0x5f5a80} />
      </mesh>
      {geo.curbs.map((c) => (
        <mesh key={c.key} geometry={c.geometry}>
          <meshBasicMaterial color={c.key} />
        </mesh>
      ))}
    </group>
  );
}

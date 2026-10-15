"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { BoxGeometry, type BufferGeometry, type Group, MeshStandardMaterial } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Building, SkylineBox } from "@/world/city";
import { LIGHT } from "./lighting";
import { windowTexture } from "./painters/windows";
import { signTexture } from "./painters/signs";
import { useDisposeOnChange } from "./useDisposeOnChange";

const BODY_COLORS = [0x17143a, 0x1d1236, 0x101a33, 0x1a1a2e];

/** Box with window UVs scaled to its size, so windows look the same on every building. */
function buildingGeometry(w: number, h: number, d: number, x: number, z: number): BufferGeometry {
  const g = new BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  const faces = [[d, h], [d, h], [0, 0], [0, 0], [w, h], [w, h]];
  for (let f = 0; f < 6; f++)
    for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      uv.setXY(i, (uv.getX(i) * faces[f][0]) / 14, (uv.getY(i) * faces[f][1]) / 28);
    }
  g.translate(x, h / 2, z);
  return g;
}

export function boxAt(sx: number, sy: number, sz: number, x: number, y: number, z: number): BufferGeometry {
  const g = new BoxGeometry(sx, sy, sz);
  g.translate(x, y, z);
  return g;
}

/** Merges geometries grouped by a numeric key (material index or colour). */
export function mergeBy<T>(items: T[], key: (t: T) => number, geo: (t: T) => BufferGeometry | null) {
  const groups = new Map<number, BufferGeometry[]>();
  for (const it of items) {
    const g = geo(it);
    if (!g) continue;
    const k = key(it);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(g);
  }
  return [...groups].map(([k, gs]) => ({ key: k, geometry: mergeGeometries(gs)! }));
}

export function City({ buildings, skyline }: { buildings: Building[]; skyline: SkylineBox[] }) {
  const mats = useMemo(
    () => BODY_COLORS.map((color, s) => new MeshStandardMaterial({ color, roughness: 0.8, emissive: 0xffffff, emissiveMap: windowTexture(s), emissiveIntensity: LIGHT.windows })),
    [],
  );
  const parts = useMemo(() => {
    const sky = skyline.map((s, k) => ({ ...s, mat: k % 4 }));
    return {
      bodies: mergeBy(buildings, (b) => b.mat, (b) => buildingGeometry(b.w, b.h, b.d, b.x, b.z)),
      skyBodies: mergeBy(sky, (s) => s.mat, (s) => buildingGeometry(s.w, s.h, s.d, s.x, s.z)),
      roof: mergeBy(buildings, (b) => b.trimColor, (b) => (b.roofTrim ? boxAt(b.w + 0.2, 0.3, b.d + 0.2, b.x, b.h + 0.05, b.z) : null)),
      band: mergeBy(buildings, (b) => b.bandColor, (b) => (b.bandTrim ? boxAt(b.w + 0.12, 0.45, b.d + 0.12, b.x, 3.4, b.z) : null)),
      skyTrim: mergeBy(skyline, (s) => s.trimColor, (s) => (s.trim ? boxAt(s.w + 0.3, 0.5, s.d + 0.3, s.x, s.h + 0.1, s.z) : null)),
    };
  }, [buildings, skyline]);

  return (
    <group>
      {[...parts.bodies, ...parts.skyBodies].map((p, i) => (
        <mesh key={`b${i}`} geometry={p.geometry} material={mats[p.key]} />
      ))}
      {[...parts.roof, ...parts.band, ...parts.skyTrim].map((p, i) => (
        <mesh key={`t${i}`} geometry={p.geometry}>
          <meshBasicMaterial color={p.key} />
        </mesh>
      ))}
    </group>
  );
}

/** Rooftop neon signs (generic place names from ui.world.roofSigns). */
export function RoofSigns({ buildings, texts, family }: { buildings: Building[]; texts: string[]; family: string }) {
  const reduce = useReducedMotion() ?? false;
  const signs = useMemo(
    () =>
      buildings
        .filter((b) => b.sign)
        .map((b, k) => ({ b, key: k, tex: signTexture(texts[b.sign!.text % texts.length], b.sign!.color, family) })),
    [buildings, texts, family],
  );
  const textures = useMemo(() => signs.map((s) => s.tex), [signs]);
  useDisposeOnChange(textures);
  const refs = useRef<(Group | null)[]>([]);
  useFrame(({ clock }) => {
    if (reduce) return;
    const t = clock.elapsedTime;
    signs.forEach((s, i) => {
      const g = refs.current[i];
      if (g && s.b.sign!.flicker) g.visible = !(Math.sin(t * 9 + i) > 0.93 && Math.sin(t * 2.3 + i) > 0);
    });
  });
  return (
    <>
      {signs.map((s, i) => (
        <group key={s.key} ref={(g) => { refs.current[i] = g; }} position={[s.b.x, s.b.h + 2.4, s.b.z]} rotation-y={s.b.sign!.rotated ? Math.PI / 2 : 0}>
          {[0, Math.PI].map((ry) => (
            <mesh key={ry} rotation-y={ry}>
              <planeGeometry args={[10, 2.5]} />
              <meshBasicMaterial map={s.tex} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

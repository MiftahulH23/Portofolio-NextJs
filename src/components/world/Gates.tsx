"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { AdditiveBlending, DoubleSide, type Mesh, MeshBasicMaterial, type PointLight } from "three";
import { useLanguage } from "@/context/LanguageContext";
import { pad } from "@/lib/format";
import { ROAD_HALF } from "@/world/city";
import { GATES, gateYaw } from "@/world/gates";
import { NEON } from "@/world/palette";
import { useWorld } from "@/world/useWorld";
import { canvasFonts } from "./fonts";
import { LIGHT } from "./lighting";
import { signTexture } from "./painters/signs";

function paintGate(m: { neon: MeshBasicMaterial; beam: MeshBasicMaterial }, color: number, done: boolean) {
  m.neon.color.set(done ? NEON.lime : color);
  m.beam.color.set(done ? NEON.lime : color);
  m.beam.opacity = done ? 0.05 : 0.16;
}

export function Gates({ fontsReady }: { fontsReady: boolean }) {
  const { ui } = useLanguage();
  const reduce = useReducedMotion() ?? false;
  const visited = useWorld((s) => s.visited);
  const mats = useMemo(
    () => GATES.map((g) => ({
      neon: new MeshBasicMaterial({ color: g.color }),
      beam: new MeshBasicMaterial({ color: g.color, transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
    })),
    [],
  );
  const plates = useMemo(
    () => (fontsReady ? GATES.map((g, i) => signTexture(`${pad(i + 1)} · ${ui.world.gates[g.key].toUpperCase()}`, g.color, canvasFonts().display, 1024, 192)) : []),
    [fontsReady, ui.world.gates],
  );
  const rings = useRef<(Mesh | null)[]>([]);
  const lights = useRef<(PointLight | null)[]>([]);

  useEffect(() => {
    GATES.forEach((g, i) => paintGate(mats[i], g.color, visited.includes(g.key)));
  }, [visited, mats]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    GATES.forEach((g, i) => {
      const ring = rings.current[i], light = lights.current[i];
      if (ring) {
        ring.rotation.y = reduce ? 0 : t * 1.5;
        ring.position.y = 3.4 + (reduce ? 0 : Math.sin(t * 2 + i) * 0.25);
      }
      if (light) light.intensity = visited.includes(g.key) ? LIGHT.gate.intensity * 0.45 : LIGHT.gate.intensity * (0.85 + Math.sin(t * 4 + i) * 0.25);
    });
  });

  return (
    <>
      {GATES.map((g, i) => (
        <group key={g.key} position={[g.x, 0, g.z]} rotation-y={gateYaw(g)}>
          {[-ROAD_HALF - 1, ROAD_HALF + 1].map((px) => (
            <group key={px} position={[px, 4.5, 0]}>
              <mesh scale={[0.8, 9, 0.8]}>
                <boxGeometry />
                <meshStandardMaterial color={0x1b1930} metalness={0.5} roughness={0.4} />
              </mesh>
              <mesh scale={[0.2, 8.4, 0.84]} material={mats[i].neon}>
                <boxGeometry />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 9.1, 0]} scale={[ROAD_HALF * 2 + 3, 0.4, 0.55]} material={mats[i].neon}>
            <boxGeometry />
          </mesh>
          {plates[i] &&
            [0, Math.PI].map((ry) => (
              <mesh key={ry} position={[0, 10.8, 0]} rotation-y={ry}>
                <planeGeometry args={[10.5, 1.97]} />
                <meshBasicMaterial map={plates[i]} />
              </mesh>
            ))}
          <pointLight ref={(l) => { lights.current[i] = l; }} position={[0, 6, 0]} color={g.color} intensity={LIGHT.gate.intensity} distance={LIGHT.gate.distance} decay={LIGHT.gate.decay} />
          <mesh ref={(m) => { rings.current[i] = m; }} position={[0, 3.4, 0]} material={mats[i].neon}>
            <torusGeometry args={[1.2, 0.07, 8, 40]} />
          </mesh>
          <mesh position={[0, 80, 0]} material={mats[i].beam}>
            <cylinderGeometry args={[1.3, 1.3, 160, 16, 1, true]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

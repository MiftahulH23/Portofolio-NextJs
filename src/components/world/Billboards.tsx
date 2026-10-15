"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BOARDS, placeBoard } from "@/world/billboards";
import { canvasFonts } from "./fonts";
import { glowSprite } from "./models/bike";
import { boardTexture } from "./painters/billboard";
import { useDisposeOnChange } from "./useDisposeOnChange";

const POLE = 0x2a2840;

export function Billboards({ fontsReady }: { fontsReady: boolean }) {
  const { content, ui } = useLanguage();
  const textures = useMemo(() => {
    if (!fontsReady) return null;
    const f = canvasFonts();
    return BOARDS.map((b) => ({ front: boardTexture(b.front, b, content, ui, f), back: boardTexture(b.back, b, content, ui, f) }));
  }, [fontsReady, content, ui]);
  const flat = useMemo(() => textures?.flatMap((t) => [t.front, t.back]) ?? null, [textures]);
  useDisposeOnChange(flat);
  const halos = useMemo(() => BOARDS.map((b) => [glowSprite(b.color, b.form === "tall" ? 15 : 24, 0.13), glowSprite(b.color, b.form === "tall" ? 15 : 24, 0.13)]), []);
  if (!textures) return null;

  return (
    <>
      {BOARDS.map((b, i) => {
        const p = placeBoard(b);
        const tall = b.form === "tall";
        const pw = tall ? 7 : 16, ph = tall ? 10.5 : 8, cx = tall ? 0 : 5, cy = tall ? 7.6 : 9.4;
        return (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.yaw}>
            {tall ? (
              <>
                <mesh position={[0, 0.25, 0]} scale={[2.4, 0.5, 1.4]}><boxGeometry /><meshStandardMaterial color={POLE} metalness={0.6} roughness={0.4} /></mesh>
                <mesh position={[0, 1.4, 0]} scale={[0.7, 2.4, 0.5]}><boxGeometry /><meshStandardMaterial color={POLE} metalness={0.6} roughness={0.4} /></mesh>
                {[-1, 1].map((s) => (
                  <mesh key={s} position={[s * (pw / 2 + 0.1), cy, 0]} scale={[0.16, ph + 0.4, 0.5]}><boxGeometry /><meshBasicMaterial color={b.color} /></mesh>
                ))}
              </>
            ) : (
              <>
                <mesh position={[0, 3, 0]}><cylinderGeometry args={[0.35, 0.45, 6, 10]} /><meshStandardMaterial color={POLE} metalness={0.6} roughness={0.4} /></mesh>
                <mesh position={[cx / 2, cy - ph / 2 - 0.2, 0]} scale={[cx + 0.6, 0.35, 0.35]}><boxGeometry /><meshStandardMaterial color={POLE} metalness={0.6} roughness={0.4} /></mesh>
                {[-1, 1].map((s) => (
                  <mesh key={s} position={[cx, cy + s * (ph / 2 + 0.4), 0]} scale={[pw + 0.9, 0.22, 0.5]}><boxGeometry /><meshBasicMaterial color={b.color} /></mesh>
                ))}
              </>
            )}
            <mesh position={[cx, cy, 0]} scale={[pw + 0.6, ph + 0.6, 0.4]}><boxGeometry /><meshBasicMaterial color={0x0a0914} /></mesh>
            <mesh position={[cx, cy, 0.22]}><planeGeometry args={[pw, ph]} /><meshBasicMaterial color={0xd6d6d6} map={textures[i].front} /></mesh>
            <mesh position={[cx, cy, -0.22]} rotation-y={Math.PI}><planeGeometry args={[pw, ph]} /><meshBasicMaterial color={0xd6d6d6} map={textures[i].back} /></mesh>
            <primitive object={halos[i][0]} position={[cx, cy, 1.4]} />
            <primitive object={halos[i][1]} position={[cx, cy, -1.4]} />
          </group>
        );
      })}
    </>
  );
}

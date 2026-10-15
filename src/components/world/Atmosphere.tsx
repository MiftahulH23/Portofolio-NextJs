"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, type Points, PointsMaterial } from "three";
import { mulberry32 } from "@/world/random";

export function Atmosphere() {
  const reduce = useReducedMotion() ?? false;
  const dust = useRef<Points>(null);
  const geo = useMemo(() => {
    const r = mulberry32(31);
    const d: number[] = [], s: number[] = [];
    for (let i = 0; i < 900; i++) d.push(-30 + r() * 340, 0.6 + r() * 25.4, -30 + r() * 340);
    for (let i = 0; i < 1500; i++) {
      const th = r() * Math.PI * 2, ph = r() * Math.PI * 0.42, rad = 700;
      s.push(140 + rad * Math.sin(ph) * Math.cos(th), 80 + rad * Math.cos(ph), 140 + rad * Math.sin(ph) * Math.sin(th));
    }
    const dg = new BufferGeometry();
    dg.setAttribute("position", new Float32BufferAttribute(d, 3));
    const sg = new BufferGeometry();
    sg.setAttribute("position", new Float32BufferAttribute(s, 3));
    return {
      dg, sg,
      dm: new PointsMaterial({ color: 0xb59bff, size: 0.22, transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false }),
      sm: new PointsMaterial({ color: 0xcfd6ff, size: 1.6, sizeAttenuation: false, fog: false }),
    };
  }, []);
  useFrame(({ clock }) => {
    if (dust.current && !reduce) dust.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.6;
  });
  return (
    <>
      <points ref={dust} geometry={geo.dg} material={geo.dm} />
      <points geometry={geo.sg} material={geo.sm} />
    </>
  );
}

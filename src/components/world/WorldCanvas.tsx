"use client";

import { Canvas } from "@react-three/fiber";
import { useLanguage } from "@/context/LanguageContext";
import { FOG, SKY } from "@/world/palette";
import { getRuntime } from "@/world/runtime";
import { Atmosphere } from "./Atmosphere";
import { CameraRig } from "./CameraRig";
import { City, RoofSigns } from "./City";
import { canvasFonts, useFontsReady } from "./fonts";
import { Lamps } from "./Lamps";
import { LIGHT } from "./lighting";
import { Park } from "./Park";
import { Roads } from "./Roads";

export default function WorldCanvas({ onReady, children }: { onReady?: () => void; children?: React.ReactNode }) {
  const { ui } = useLanguage();
  const fontsReady = useFontsReady();
  const city = getRuntime().city;
  return (
    <Canvas
      role="img"
      aria-label={ui.world.hud.canvas}
      style={{ position: "fixed", inset: 0 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 62, near: 0.1, far: 1000, position: [140, 4, 118] }}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={[SKY]} />
      <fogExp2 attach="fog" args={[FOG, LIGHT.fog.high]} />
      <hemisphereLight args={[LIGHT.hemi.sky, LIGHT.hemi.ground, LIGHT.hemi.intensity]} />
      <directionalLight position={LIGHT.moon.position} color={LIGHT.moon.color} intensity={LIGHT.moon.intensity} />
      <Roads />
      <City buildings={city.buildings} skyline={city.skyline} />
      {fontsReady && <RoofSigns buildings={city.buildings} texts={ui.world.roofSigns} family={canvasFonts().display} />}
      <Park layout={city.park} />
      <Lamps spots={city.lamps} />
      <Atmosphere />
      <CameraRig />
      {children}
    </Canvas>
  );
}

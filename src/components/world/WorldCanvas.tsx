"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useLanguage } from "@/context/LanguageContext";
import { FOG, SKY } from "@/world/palette";
import { getRuntime, resetRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { Atmosphere } from "./Atmosphere";
import { Billboards } from "./Billboards";
import { Bike } from "./Bike";
import { CameraRig } from "./CameraRig";
import { City, RoofSigns } from "./City";
import { canvasFonts, useFontsReady } from "./fonts";
import { Gates } from "./Gates";
import { GuideArrow } from "./GuideArrow";
import { Lamps } from "./Lamps";
import { LIGHT } from "./lighting";
import { Park } from "./Park";
import { Pedestrians } from "./Pedestrians";
import { Roads } from "./Roads";
import { Simulation, type SoundHooks } from "./Simulation";
import { Traffic } from "./Traffic";

export default function WorldCanvas({ onReady, sounds, children }: { onReady?: () => void; sounds?: SoundHooks; children?: React.ReactNode }) {
  const { ui } = useLanguage();
  const tier = useWorld((s) => s.tier);
  const fontsReady = useFontsReady();
  const city = getRuntime().city;
  // Phones start in the low tier but still get a sharp canvas; it drops to 1.25 only if frames suffer.
  const [lowDpr, setLowDpr] = useState(2);
  return (
    <Canvas
      role="img"
      aria-label={ui.world.hud.canvas}
      style={{ position: "fixed", inset: 0 }}
      dpr={tier === "high" ? [1, 2] : [1, lowDpr]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 62, near: 0.1, far: 1000, position: [140, 4, 118] }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          worldStore.reportContextLost();
        });
        onReady?.();
      }}
    >
      <color attach="background" args={[SKY]} />
      <fogExp2 attach="fog" args={[FOG, LIGHT.fog[tier]]} />
      <hemisphereLight args={[LIGHT.hemi.sky, LIGHT.hemi.ground, LIGHT.hemi.intensity]} />
      <directionalLight position={LIGHT.moon.position} color={LIGHT.moon.color} intensity={LIGHT.moon.intensity} />
      <PerformanceMonitor
        onDecline={() => {
          setLowDpr(1.25);
          if (worldStore.getState().tier === "low") return;
          resetRuntime(getRuntime(), "low", true);
          worldStore.setTier("low");
        }}
      />
      <Roads />
      <City buildings={city.buildings} skyline={city.skyline} />
      {fontsReady && <RoofSigns buildings={city.buildings} texts={ui.world.roofSigns} family={canvasFonts().display} />}
      <Park layout={city.park} />
      <Lamps spots={city.lamps} />
      <Gates fontsReady={fontsReady} />
      <Billboards fontsReady={fontsReady} />
      <GuideArrow />
      <Traffic />
      <Pedestrians />
      <Atmosphere />
      <Simulation {...sounds} />
      <Bike />
      <CameraRig />
      {children}
      {tier === "high" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={LIGHT.bloom.intensity} luminanceThreshold={LIGHT.bloom.threshold} luminanceSmoothing={LIGHT.bloom.smoothing} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}

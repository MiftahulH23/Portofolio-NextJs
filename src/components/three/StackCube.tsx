"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CanvasTexture, type Mesh, MeshStandardMaterial, SRGBColorSpace } from "three";

const ACCENT = "#A3E635";

function faceTexture(label: string, accent: boolean, fontFamily: string): CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = accent ? ACCENT : "#18181C";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = accent ? ACCENT : "#3F3F46";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, size - 12, size - 12);
    ctx.fillStyle = accent ? "#09090B" : "#F4F4F5";
    ctx.font = `500 64px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, size / 2, size / 2);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Cube({ faces, fontFamily }: { faces: string[]; fontFamily: string }) {
  const ref = useRef<Mesh>(null);
  const materials = useMemo(
    () =>
      faces.slice(0, 6).map(
        (label, i) => new MeshStandardMaterial({ map: faceTexture(label, i === 0, fontFamily), roughness: 0.35, metalness: 0.1 }),
      ),
    [faces, fontFamily],
  );

  useEffect(
    () => () => {
      for (const m of materials) {
        m.map?.dispose();
        m.dispose();
      }
    },
    [materials],
  );

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  return (
    <mesh ref={ref} rotation={[-0.35, 0.6, 0]} material={materials}>
      <boxGeometry args={[1.8, 1.8, 1.8]} />
    </mesh>
  );
}

export default function StackCube({ faces, active }: { faces: string[]; active: boolean }) {
  const [fontFamily, setFontFamily] = useState("monospace");

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
      setFontFamily(family || "monospace");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Cube faces={faces} fontFamily={fontFamily} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} />
    </Canvas>
  );
}

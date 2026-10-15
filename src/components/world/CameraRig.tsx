"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { type PerspectiveCamera, Vector3 } from "three";
import { forward } from "@/world/bike";
import { getRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";

function shakeCamera(cam: PerspectiveCamera, amount: number) {
  cam.position.x += (Math.random() - 0.5) * amount;
  cam.position.y += (Math.random() - 0.5) * amount;
}

function easeFov(cam: PerspectiveCamera, fov: number, dt: number) {
  if (Math.abs(cam.fov - fov) <= 0.05) return;
  cam.fov += (fov - cam.fov) * Math.min(1, dt * 3);
  cam.updateProjectionMatrix();
}

/** Idle orbit on the intro; spring follow with look-ahead, speed FOV and bump shake while riding. */
export function CameraRig() {
  const reduce = useReducedMotion() ?? false;
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const pos = useRef(new Vector3());
  const look = useRef(new Vector3());
  const lookS = useRef(new Vector3());
  const angle = useRef(0);
  const first = useRef(true);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 1 / 30);
    const rt = getRuntime();
    const b = rt.bike;
    const riding = worldStore.getState().phase === "running";
    const f = forward(b.heading);
    const v = Math.max(0, b.v);
    if (!riding) {
      angle.current += dt * (reduce ? 0 : 0.16);
      pos.current.set(b.x + Math.sin(angle.current) * 9, 3.6, b.z + Math.cos(angle.current) * 9);
      lookS.current.set(b.x, 1.3, b.z);
    } else {
      const back = 6.4 + v * 0.07;
      pos.current.set(b.x - f.x * back, 3 + v * 0.025, b.z - f.z * back);
      look.current.set(b.x + f.x * (5 + v * 0.2), 1.2, b.z + f.z * (5 + v * 0.2));
      lookS.current.lerp(look.current, 1 - Math.exp(-dt * 8));
    }
    if (first.current) {
      camera.position.copy(pos.current);
      lookS.current.set(b.x, 1.3, b.z);
      first.current = false;
    }
    camera.position.lerp(pos.current, 1 - Math.exp(-dt * (riding ? 5 : 2)));
    if (rt.shake > 0 && !reduce) shakeCamera(camera, rt.shake);
    camera.lookAt(lookS.current);
    easeFov(camera, (size.width < size.height ? 74 : 62) + v * 0.38, dt);
  });
  return null;
}

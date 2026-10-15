"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { Vector3 } from "three";
import { getRuntime } from "@/world/runtime";

export function CameraRig() {
  const reduce = useReducedMotion() ?? false;
  const camera = useThree((s) => s.camera);
  const look = useRef(new Vector3());
  const angle = useRef(0);
  const target = useRef(new Vector3());
  useFrame((_, raw) => {
    const dt = Math.min(raw, 1 / 30);
    const b = getRuntime().bike;
    angle.current += dt * (reduce ? 0 : 0.16);
    target.current.set(b.x + Math.sin(angle.current) * 9, 3.6, b.z + Math.cos(angle.current) * 9);
    camera.position.lerp(target.current, 1 - Math.exp(-dt * 2));
    look.current.set(b.x, 1.3, b.z);
    camera.lookAt(look.current);
  });
  return null;
}

"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { getRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";
import { applyBikePose, createBikeModel } from "./models/bike";

export function Bike() {
  const model = useMemo(() => createBikeModel(), []);
  useFrame((_, raw) => {
    const { bike, input } = getRuntime();
    applyBikePose(model, bike, input, worldStore.getState().phase === "running", Math.min(raw, 1 / 30));
  });
  return <primitive object={model.group} />;
}

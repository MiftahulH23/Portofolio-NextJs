"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { Car } from "@/world/traffic";
import { getRuntime } from "@/world/runtime";
import { useWorld } from "@/world/useWorld";
import { createCarModel } from "./models/car";

function placeCar(m: Group, c: Car | undefined) {
  m.visible = !!c;
  if (!c) return;
  m.position.set(c.pos.x, 0, c.pos.z);
  m.rotation.y = Math.atan2(c.tan.x, c.tan.z);
}

export function Traffic() {
  const tier = useWorld((s) => s.tier);
  const models = useMemo(() => {
    void tier; // rebuild when the tier (car count) changes
    return getRuntime().cars.map((c) => createCarModel(c.color, c.taxi));
  }, [tier]);
  useFrame(() => {
    const cars = getRuntime().cars;
    models.forEach((m, i) => placeCar(m, cars[i]));
  });
  return (
    <>
      {models.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  );
}

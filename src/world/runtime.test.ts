// @vitest-environment node
import { describe, expect, it } from "vitest";
import { AGENTS, createRuntime, resetRuntime, stepWorld } from "./runtime";

describe("runtime", () => {
  it("riding north from the start passes the Profile gate exactly once", () => {
    const rt = createRuntime("low");
    rt.cars = [];
    rt.peds = [];
    rt.input.gas = true;
    const entered: string[] = [];
    for (let t = 0; t < 6; t += 1 / 60) entered.push(...stepWorld(rt, 1 / 60, true).entered);
    expect(entered).toEqual(["profile"]);
    expect(rt.bike.z).toBeGreaterThan(175);
  });

  it("logs the trip while riding and clears it on a full reset", () => {
    const rt = createRuntime("low");
    rt.cars = [];
    rt.peds = [];
    rt.input.gas = true;
    for (let t = 0; t < 3; t += 1 / 60) stepWorld(rt, 1 / 60, true);
    expect(rt.trip.meters).toBeCloseTo(rt.bike.z - 128, 0);
    expect(rt.trip.seconds).toBeCloseTo(3, 1);
    expect(rt.trip.topKmh).toBeGreaterThan(0);
    resetRuntime(rt, "low", true);
    expect(rt.trip.meters).toBeGreaterThan(0);
    resetRuntime(rt, "low");
    expect(rt.trip).toEqual({ meters: 0, seconds: 0, topKmh: 0, bells: 0 });
  });

  it("does not move the bike before the ride starts", () => {
    const rt = createRuntime("low");
    rt.input.gas = true;
    stepWorld(rt, 1 / 30, false);
    expect(rt.bike.v).toBe(0);
  });

  it("resolves the bike out of a building and reports a bump", () => {
    const rt = createRuntime("low");
    rt.cars = [];
    rt.peds = [];
    const lot = rt.colliders.rects[0];
    rt.bike = { ...rt.bike, x: lot.x0 + 0.4, z: (lot.z0 + lot.z1) / 2, v: 10, heading: Math.PI / 2 };
    const ev = stepWorld(rt, 1 / 60, true);
    expect(rt.bike.x).toBeLessThanOrEqual(lot.x0 - 0.6 + 1e-6);
    expect(ev.bump).toBe(true);
    expect(rt.bike.v).toBeLessThan(5);
  });

  it("spawns more agents on the high tier", () => {
    expect(createRuntime("high").cars.length).toBeGreaterThan(createRuntime("low").cars.length);
  });

  it("a tier drop can keep the rider where they are", () => {
    const rt = createRuntime("high");
    rt.bike = { ...rt.bike, x: 200, z: 100 };
    resetRuntime(rt, "low", true);
    expect(rt.bike).toMatchObject({ x: 200, z: 100 });
    expect(rt.cars).toHaveLength(AGENTS.low.cars);
    resetRuntime(rt, "low");
    expect(rt.bike).toMatchObject({ x: 140, z: 128 });
  });
});

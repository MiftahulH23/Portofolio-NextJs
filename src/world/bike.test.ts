// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BIKE, createBike, kmh, stepBike, type BikeInput, type BikeState } from "./bike";

const none: BikeInput = { gas: false, brake: false, left: false, right: false, boost: false };
function run(s: BikeState, input: Partial<BikeInput>, seconds: number): BikeState {
  let b = s;
  for (let t = 0; t < seconds; t += 1 / 60) b = stepBike(b, { ...none, ...input }, 1 / 60);
  return b;
}

describe("stepBike", () => {
  it("accelerates toward the cap without passing it", () => {
    const b = run(createBike(0, 0, 0), { gas: true }, 20);
    expect(b.v).toBeGreaterThan(15);
    expect(b.v).toBeLessThanOrEqual(BIKE.max);
    expect(b.z).toBeGreaterThan(100);
  });
  it("sprint raises the cap", () => {
    expect(run(createBike(0, 0, 0), { gas: true, boost: true }, 20).v).toBeGreaterThan(25);
  });
  it("brakes to a stop, then reverses slowly", () => {
    const moving = { ...createBike(0, 0, 0), v: 20 };
    expect(run(moving, { brake: true }, 1).v).toBeLessThan(0.5);
    expect(run(moving, { brake: true }, 8).v).toBeGreaterThanOrEqual(BIKE.minV);
    expect(run(moving, { brake: true }, 8).v).toBeLessThan(0);
  });
  it("cannot turn on the spot", () => {
    expect(run(createBike(0, 0, 0), { left: true }, 1).heading).toBe(0);
  });
  it("steers left (+heading) forward and mirrors in reverse", () => {
    expect(run({ ...createBike(0, 0, 0), v: 10 }, { left: true, gas: true }, 0.5).heading).toBeGreaterThan(0.1);
    expect(run({ ...createBike(0, 0, 0), v: -4 }, { left: true, brake: true }, 0.5).heading).toBeLessThan(0);
  });
  it("leans into the turn", () => {
    expect(run({ ...createBike(0, 0, 0), v: 12 }, { left: true, gas: true }, 0.5).lean).toBeLessThan(-0.1);
  });
  it("clamps dt so a frame gap cannot tunnel", () => {
    const fast = { ...createBike(0, 0, 0), v: 32 };
    const b = stepBike(fast, { ...none, gas: true, boost: true }, 5);
    expect(Math.hypot(b.x, b.z)).toBeLessThanOrEqual(32 / 30 + 1e-6);
  });
  it("reports km/h", () => {
    expect(kmh(10)).toBe(16);
    expect(kmh(-2.5)).toBe(4);
  });
});

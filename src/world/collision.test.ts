// @vitest-environment node
import { describe, expect, it } from "vitest";
import { resolveCollisions } from "./collision";

const rects = [{ x0: 10, x1: 20, z0: 10, z1: 20 }];
const bounds = { lo: -9, hi: 289 };

describe("resolveCollisions", () => {
  it("leaves free positions alone", () => {
    expect(resolveCollisions(0, 0, rects, [], bounds)).toEqual({ x: 0, z: 0, hit: false });
  });
  it("pushes out of a box through the nearest side", () => {
    const r = resolveCollisions(10.3, 15, rects, [], bounds);
    expect(r.hit).toBe(true);
    expect(r.x).toBeCloseTo(9.4);
    expect(r.z).toBe(15);
  });
  it("pushes out of a circle radially", () => {
    const r = resolveCollisions(1, 0, [], [{ x: 0, z: 0, r: 1 }], bounds);
    expect(r.hit).toBe(true);
    expect(Math.hypot(r.x, r.z)).toBeCloseTo(1.6);
  });
  it("clamps to the city bounds", () => {
    const r = resolveCollisions(400, -50, [], [], bounds);
    expect(r).toEqual({ x: 288.4, z: -8.4, hit: true });
  });
});

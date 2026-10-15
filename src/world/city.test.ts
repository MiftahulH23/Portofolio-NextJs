// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BLOCKS, BOUNDS, GRID, ROAD_HALF, SEGMENTS, SIDEWALK, START, buildCity } from "./city";

describe("city layout", () => {
  it("has 16 blocks with exactly one park", () => {
    expect(BLOCKS).toHaveLength(16);
    expect(BLOCKS.filter((b) => b.park)).toHaveLength(1);
  });

  it("has 40 road segments of length 70", () => {
    expect(SEGMENTS).toHaveLength(40);
    for (const s of SEGMENTS) expect(Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z)).toBe(70);
  });

  it("is deterministic for a seed", () => {
    expect(buildCity(7)).toEqual(buildCity(7));
    expect(buildCity(7)).not.toEqual(buildCity(8));
  });

  it("keeps every building inside its block's lot", () => {
    const city = buildCity(7);
    for (const b of city.buildings) {
      const lot = BLOCKS.find((k) => !k.park && b.x > k.lot.x0 && b.x < k.lot.x1 && b.z > k.lot.z0 && b.z < k.lot.z1)!.lot;
      expect(b.x - b.w / 2).toBeGreaterThanOrEqual(lot.x0 - 1e-9);
      expect(b.x + b.w / 2).toBeLessThanOrEqual(lot.x1 + 1e-9);
      expect(b.z - b.d / 2).toBeGreaterThanOrEqual(lot.z0 - 1e-9);
      expect(b.z + b.d / 2).toBeLessThanOrEqual(lot.z1 + 1e-9);
    }
  });

  it("starts the rider on open road", () => {
    const city = buildCity(7);
    for (const r of city.rects) expect(START.x > r.x0 && START.x < r.x1 && START.z > r.z0 && START.z < r.z1).toBe(false);
    for (const c of city.circles) expect(Math.hypot(START.x - c.x, START.z - c.z)).toBeGreaterThan(c.r + 0.6);
  });

  it("puts the skyline outside the playable area", () => {
    for (const s of buildCity(7).skyline) expect(Math.max(Math.abs(s.x - 140), Math.abs(s.z - 140))).toBeGreaterThanOrEqual(166);
  });

  it("bounds include the outer sidewalk", () => {
    expect(BOUNDS.lo).toBe(-ROAD_HALF - SIDEWALK);
    expect(BOUNDS.hi).toBe(GRID[GRID.length - 1] + ROAD_HALF + SIDEWALK);
  });
});

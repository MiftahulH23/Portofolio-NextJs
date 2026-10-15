// @vitest-environment node
import { describe, expect, it } from "vitest";
import { BLOCKS, SIDEWALK } from "./city";
import { perimeter, perimeterPoint, spawnPeds, stepPeds } from "./pedestrians";
import { mulberry32 } from "./random";

const b = BLOCKS[0];

describe("pedestrians", () => {
  it("walks the sidewalk centre line and wraps around", () => {
    const p0 = perimeterPoint(b, 0);
    expect(p0.x).toBeCloseTo(b.x0 + SIDEWALK / 2);
    expect(p0.z).toBeCloseTo(b.z0 + SIDEWALK / 2);
    const again = perimeterPoint(b, perimeter(b));
    expect(again.x).toBeCloseTo(p0.x);
    expect(again.z).toBeCloseTo(p0.z);
    expect(perimeterPoint(b, -1).x).toBeCloseTo(p0.x);
  });

  it("pauses when the bike passes close and fast", () => {
    const [ped] = spawnPeds(1, mulberry32(4));
    const res = stepPeds([ped], { x: ped.x + 0.5, z: ped.z }, 8, 1 / 30);
    expect(res.nearMiss).toBe(true);
    expect(ped.pause).toBeGreaterThan(1);
  });

  it("moves along when nobody is near", () => {
    const [ped] = spawnPeds(1, mulberry32(4));
    const u = ped.u;
    stepPeds([ped], { x: -999, z: -999 }, 0, 1);
    expect(ped.u).not.toBe(u);
  });
});

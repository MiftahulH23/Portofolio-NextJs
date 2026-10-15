// @vitest-environment node
import { describe, expect, it } from "vitest";
import { linePiece, samplePiece } from "./graph";
import { mulberry32 } from "./random";
import { pushBikeFromCars, spawnCars, stepTraffic, type Car } from "./traffic";

function carOn(from: [number, number], to: [number, number], d: number, cruise = 11): Car {
  const piece = linePiece(from, to);
  const s = samplePiece(piece, d);
  return { from, to, piece, d, v: cruise, cruise, wait: 0, ignore: 0, honk: 0, pos: s.pos, tan: s.tan, color: 0xffffff, taxi: false };
}

describe("traffic", () => {
  it("spawns cars on the left lane of a segment", () => {
    for (const c of spawnCars(18, mulberry32(1))) {
      expect(c.piece.kind).toBe("line");
      const off = c.piece.kind === "line" && Math.abs(c.piece.dir.x) > 0 ? Math.abs(c.pos.z % 70) : Math.abs(c.pos.x % 70);
      expect(Math.min(off, 70 - off)).toBeCloseTo(3, 6);
    }
  });

  it("keeps driving along the grid for a minute", () => {
    const cars = spawnCars(10, mulberry32(2));
    const r = mulberry32(9);
    for (let t = 0; t < 60; t += 1 / 30) stepTraffic(cars, { x: -999, z: -999 }, 1 / 30, r);
    for (const c of cars) {
      expect(Math.abs(c.from[0] - c.to[0]) + Math.abs(c.from[1] - c.to[1])).toBe(1);
      expect(c.pos.x).toBeGreaterThan(-10);
      expect(c.pos.x).toBeLessThan(290);
    }
  });

  it("stops and honks for a bike in front", () => {
    const car = carOn([2, 1], [2, 2], 10);
    const bike = { x: car.pos.x, z: car.pos.z + 6 };
    let honked = false;
    for (let t = 0; t < 3; t += 1 / 30) honked = stepTraffic([car], bike, 1 / 30, mulberry32(1)).honked || honked;
    expect(car.v).toBeLessThan(0.5);
    expect(honked).toBe(true);
  });

  it("gets out of a stall behind a stopped car", () => {
    const stuck = carOn([2, 1], [2, 2], 20, 0);
    stuck.v = 0;
    const behind = carOn([2, 1], [2, 2], 14);
    const start = behind.d;
    for (let t = 0; t < 5; t += 1 / 30) stepTraffic([behind, stuck], { x: -999, z: -999 }, 1 / 30, mulberry32(1));
    expect(behind.d - start).toBeGreaterThan(2);
  });

  it("pushes the bike out of a car", () => {
    const car = carOn([2, 1], [2, 2], 10);
    const p = pushBikeFromCars(car.pos.x + 1, car.pos.z, [car]);
    expect(p.hit).toBe(true);
    expect(Math.hypot(p.x - car.pos.x, p.z - car.pos.z)).toBeCloseTo(2.4);
  });
});

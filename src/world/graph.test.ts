// @vitest-environment node
import { describe, expect, it } from "vitest";
import { chooseNext, linePiece, neighbors, samplePiece, turnPiece, type NodeId } from "./graph";
import { mulberry32 } from "./random";

const close = (a: { x: number; z: number }, b: { x: number; z: number }) => {
  expect(a.x).toBeCloseTo(b.x, 9);
  expect(a.z).toBeCloseTo(b.z, 9);
};

describe("road graph", () => {
  it("has no dead ends", () => {
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) expect(neighbors([i, j]).length).toBeGreaterThanOrEqual(2);
  });

  it("drives on the left lane", () => {
    const p = linePiece([2, 1], [2, 2]); // heading +z along x = 140
    expect(p.dir).toEqual({ x: 0, z: 1 });
    close(p.p0, { x: 143, z: 79 });
    close(p.p1, { x: 143, z: 131 });
    expect(p.len).toBeCloseTo(52);
  });

  it("turn pieces join their neighbouring lines", () => {
    const cases: [NodeId, NodeId, NodeId][] = [
      [[2, 1], [2, 2], [3, 2]],
      [[2, 1], [2, 2], [1, 2]],
      [[2, 1], [2, 2], [2, 3]],
      [[0, 0], [1, 0], [1, 1]],
    ];
    for (const [a, b, c] of cases) {
      const t = turnPiece(a, b, c);
      close(t.p0, linePiece(a, b).p1);
      close(t.p2, linePiece(b, c).p0);
      close(samplePiece(t, 0).pos, t.p0);
      close(samplePiece(t, t.len).pos, t.p2);
    }
  });

  it("never chooses a U-turn", () => {
    const r = mulberry32(3);
    for (let k = 0; k < 200; k++) {
      const next = chooseNext([2, 1], [2, 2], r);
      expect(next).not.toEqual([2, 1]);
    }
  });

  it("samples a line piece along its direction", () => {
    const p = linePiece([0, 0], [1, 0]);
    const s = samplePiece(p, 10);
    close(s.pos, { x: p.p0.x + 10, z: p.p0.z });
    expect(s.tan).toEqual(p.dir);
  });
});

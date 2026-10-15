import { CORNER_INSET, GRID, LANE_OFFSET, N, type Vec2 } from "./city";
import { pick, type Rand } from "./random";

export type NodeId = readonly [number, number];

export interface LinePiece { kind: "line"; p0: Vec2; p1: Vec2; dir: Vec2; len: number }
export interface TurnPiece { kind: "turn"; p0: Vec2; p1: Vec2; p2: Vec2; len: number; next: NodeId }
export type Piece = LinePiece | TurnPiece;

export const nodePos = (n: NodeId): Vec2 => ({ x: GRID[n[0]], z: GRID[n[1]] });
export const sameNode = (a: NodeId, b: NodeId) => a[0] === b[0] && a[1] === b[1];

export function neighbors(n: NodeId): NodeId[] {
  return ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
    .map(([a, b]) => [n[0] + a, n[1] + b] as const)
    .filter(([a, b]) => a >= 0 && a < N && b >= 0 && b < N);
}

/** Left-hand side of a heading (Indonesia keeps left). */
export const laneSide = (d: Vec2): Vec2 => ({ x: d.z, z: -d.x });

const norm = (v: Vec2): Vec2 => {
  const l = Math.hypot(v.x, v.z) || 1;
  return { x: v.x / l, z: v.z / l };
};
const add = (a: Vec2, b: Vec2, s = 1): Vec2 => ({ x: a.x + b.x * s, z: a.z + b.z * s });

export function linePiece(from: NodeId, to: NodeId): LinePiece {
  const A = nodePos(from), B = nodePos(to);
  const dir = norm({ x: B.x - A.x, z: B.z - A.z }), s = laneSide(dir);
  const p0 = add(add(A, dir, CORNER_INSET), s, LANE_OFFSET);
  const p1 = add(add(B, dir, -CORNER_INSET), s, LANE_OFFSET);
  return { kind: "line", p0, p1, dir, len: Math.hypot(p1.x - p0.x, p1.z - p0.z) };
}

export function bezier(p0: Vec2, p1: Vec2, p2: Vec2, t: number): Vec2 {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, z: u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z };
}

export function bezierTangent(p0: Vec2, p1: Vec2, p2: Vec2, t: number): Vec2 {
  const u = 1 - t;
  return norm({ x: 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x), z: 2 * u * (p1.z - p0.z) + 2 * t * (p2.z - p1.z) });
}

export function turnPiece(from: NodeId, at: NodeId, to: NodeId): TurnPiece {
  const B = nodePos(at);
  const d1 = norm({ x: B.x - nodePos(from).x, z: B.z - nodePos(from).z });
  const d2 = norm({ x: nodePos(to).x - B.x, z: nodePos(to).z - B.z });
  const s1 = laneSide(d1), s2 = laneSide(d2);
  const p0 = add(add(B, d1, -CORNER_INSET), s1, LANE_OFFSET);
  const p2 = add(add(B, d2, CORNER_INSET), s2, LANE_OFFSET);
  const straight = d1.x * d2.x + d1.z * d2.z > 0.5;
  const p1 = straight ? add(B, s1, LANE_OFFSET) : add(add(B, s1, LANE_OFFSET), s2, LANE_OFFSET);
  let len = 0, prev = p0;
  for (let k = 1; k <= 12; k++) {
    const q = bezier(p0, p1, p2, k / 12);
    len += Math.hypot(q.x - prev.x, q.z - prev.z);
    prev = q;
  }
  return { kind: "turn", p0, p1, p2, len, next: to };
}

export function samplePiece(p: Piece, d: number): { pos: Vec2; tan: Vec2 } {
  const t = Math.min(1, Math.max(0, d / p.len));
  if (p.kind === "line") return { pos: { x: p.p0.x + (p.p1.x - p.p0.x) * t, z: p.p0.z + (p.p1.z - p.p0.z) * t }, tan: p.dir };
  return { pos: bezier(p.p0, p.p1, p.p2, t), tan: bezierTangent(p.p0, p.p1, p.p2, t) };
}

export function chooseNext(from: NodeId, at: NodeId, r: Rand): NodeId {
  const all = neighbors(at);
  const options = all.filter((n) => !sameNode(n, from));
  return pick(r, options.length ? options : all);
}

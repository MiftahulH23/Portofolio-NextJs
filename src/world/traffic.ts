import type { Vec2 } from "./city";
import { chooseNext, linePiece, neighbors, samplePiece, turnPiece, type NodeId, type Piece } from "./graph";
import { between, pick, type Rand } from "./random";

export interface Car {
  from: NodeId; to: NodeId; piece: Piece; d: number; v: number; cruise: number;
  wait: number; ignore: number; honk: number; pos: Vec2; tan: Vec2; color: number; taxi: boolean;
}

export const CAR_COLORS = [0xe23d6b, 0x2fb5ff, 0xf4f1ff, 0xffc93d, 0x7b5cff, 0x22d39a, 0x1d1b2c, 0xff8a3d] as const;
export const CAR_RADIUS = 2.4;
const MAX_DT = 1 / 30;

export function spawnCars(n: number, r: Rand): Car[] {
  const cars: Car[] = [];
  for (let k = 0; k < n; k++) {
    let from: NodeId;
    do from = [Math.floor(r() * 5), Math.floor(r() * 5)] as const;
    while (from[0] === 2 && from[1] === 2);
    const to = pick(r, neighbors(from));
    const piece = linePiece(from, to);
    const d = Math.min(between(r, 0, 40), piece.len - 1);
    const s = samplePiece(piece, d);
    const cruise = between(r, 9, 13);
    cars.push({ from, to, piece, d, v: cruise, cruise, wait: 0, ignore: 0, honk: 0, pos: s.pos, tan: s.tan, color: pick(r, CAR_COLORS), taxi: r() < 0.25 });
  }
  return cars;
}

function ahead(pos: Vec2, tan: Vec2, other: Vec2) {
  const rx = other.x - pos.x, rz = other.z - pos.z;
  return { along: rx * tan.x + rz * tan.z, lateral: Math.abs(rx * tan.z - rz * tan.x) };
}

export function stepTraffic(cars: Car[], bike: Vec2, rawDt: number, r: Rand): { honked: boolean } {
  const dt = Math.min(Math.max(rawDt, 0), MAX_DT);
  let honked = false;
  for (const c of cars) {
    let blocked = false;
    const b = ahead(c.pos, c.tan, bike);
    if (b.along > 0 && b.along < 10 && b.lateral < 2.6) {
      blocked = true;
      c.honk += dt;
      if (c.honk > 1.2) {
        c.honk = -3;
        honked = true;
      }
    } else c.honk = Math.min(c.honk, 0);

    if (c.ignore > 0) c.ignore -= dt;
    else
      for (const o of cars) {
        if (o === c) continue;
        const a = ahead(c.pos, c.tan, o.pos);
        if (a.along > 0 && a.along < 7.5 && a.lateral < 1.8) {
          blocked = true;
          break;
        }
      }

    c.wait = blocked && c.v < 0.3 ? c.wait + dt : 0;
    if (c.wait > 3) {
      c.ignore = 1.5;
      c.wait = 0;
    }
    const want = blocked && c.ignore <= 0 ? 0 : c.cruise * (c.piece.kind === "line" ? 1 : 0.6);
    c.v += (want - c.v) * Math.min(1, dt * (want === 0 ? 5 : 1.5));
    c.d += c.v * dt;
    while (c.d >= c.piece.len) {
      c.d -= c.piece.len;
      if (c.piece.kind === "line") c.piece = turnPiece(c.from, c.to, chooseNext(c.from, c.to, r));
      else {
        const next = c.piece.next;
        c.from = c.to;
        c.to = next;
        c.piece = linePiece(c.from, c.to);
      }
    }
    const s = samplePiece(c.piece, c.d);
    c.pos = s.pos;
    c.tan = s.tan;
  }
  return { honked };
}

export function pushBikeFromCars(x: number, z: number, cars: readonly Car[]): { x: number; z: number; hit: boolean } {
  let hit = false;
  for (const c of cars) {
    const dx = x - c.pos.x, dz = z - c.pos.z, d = Math.hypot(dx, dz);
    if (d < CAR_RADIUS) {
      const nx = d > 1e-6 ? dx / d : 1, nz = d > 1e-6 ? dz / d : 0;
      x = c.pos.x + nx * CAR_RADIUS;
      z = c.pos.z + nz * CAR_RADIUS;
      hit = true;
    }
  }
  return { x, z, hit };
}

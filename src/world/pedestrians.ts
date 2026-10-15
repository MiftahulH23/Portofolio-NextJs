import { BLOCKS, SIDEWALK, type Block, type Vec2 } from "./city";
import { between, pick, type Rand } from "./random";

export interface Ped {
  block: number; u: number; speed: number; pause: number; phase: number;
  x: number; z: number; facing: number; shirt: number; skin: number; phone: boolean;
}

const SHIRTS = [0xff6b9a, 0x5fd3ff, 0xffd166, 0xb6f23a, 0xc4a7ff, 0xf4f1ff, 0xff8a3d] as const;
const SKINS = [0xc98f6b, 0xa8704f, 0xe0b08e] as const;
const MAX_DT = 1 / 30;

function inner(b: Block) {
  return { x0: b.x0 + SIDEWALK / 2, x1: b.x1 - SIDEWALK / 2, z0: b.z0 + SIDEWALK / 2, z1: b.z1 - SIDEWALK / 2 };
}

export function perimeter(b: Block): number {
  const r = inner(b);
  return 2 * (r.x1 - r.x0 + (r.z1 - r.z0));
}

export function perimeterPoint(b: Block, u: number): { x: number; z: number; dx: number; dz: number } {
  const r = inner(b), w = r.x1 - r.x0, h = r.z1 - r.z0, P = 2 * (w + h);
  u = ((u % P) + P) % P;
  if (u < w) return { x: r.x0 + u, z: r.z0, dx: 1, dz: 0 };
  if (u < w + h) return { x: r.x1, z: r.z0 + (u - w), dx: 0, dz: 1 };
  if (u < 2 * w + h) return { x: r.x1 - (u - w - h), z: r.z1, dx: -1, dz: 0 };
  return { x: r.x0, z: r.z1 - (u - 2 * w - h), dx: 0, dz: -1 };
}

function place(p: Ped) {
  const pt = perimeterPoint(BLOCKS[p.block], p.u);
  const s = Math.sign(p.speed) || 1;
  p.x = pt.x;
  p.z = pt.z;
  p.facing = Math.atan2(pt.dx * s, pt.dz * s);
}

export function spawnPeds(n: number, r: Rand): Ped[] {
  return Array.from({ length: n }, () => {
    const p: Ped = {
      block: Math.floor(r() * BLOCKS.length), u: between(r, 0, 220), speed: between(r, 1, 1.6) * (r() < 0.5 ? 1 : -1),
      pause: 0, phase: between(r, 0, 6), x: 0, z: 0, facing: 0, shirt: pick(r, SHIRTS), skin: pick(r, SKINS), phone: r() < 0.35,
    };
    place(p);
    return p;
  });
}

export function stepPeds(peds: Ped[], bike: Vec2, bikeSpeed: number, rawDt: number): { nearMiss: boolean } {
  const dt = Math.min(Math.max(rawDt, 0), MAX_DT);
  let nearMiss = false;
  for (const p of peds) {
    const d = Math.hypot(bike.x - p.x, bike.z - p.z);
    if (d < 1.4) {
      p.pause = Math.max(p.pause, 1.2);
      if (Math.abs(bikeSpeed) > 3) nearMiss = true;
    }
    if (p.pause > 0) p.pause -= dt;
    else p.u += p.speed * dt;
    place(p);
  }
  return { nearMiss };
}

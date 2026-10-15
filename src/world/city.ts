import { NEON_LIST } from "./palette";
import { between, mulberry32, pick, type Rand } from "./random";

export const GRID = [0, 70, 140, 210, 280] as const;
export const N = GRID.length;
export const ROAD_HALF = 6;
export const SIDEWALK = 3.2;
export const CORNER_INSET = 9;
export const LANE_OFFSET = 3;
export const START = { x: 140, z: 128, heading: 0 } as const;
export const PARK = { i: 1, j: 2 } as const;

export interface Vec2 { x: number; z: number }
export interface Rect { x0: number; x1: number; z0: number; z1: number }
export interface Circle { x: number; z: number; r: number }
export interface Block extends Rect { i: number; j: number; park: boolean; lot: Rect }
export interface Segment { a: Vec2; b: Vec2; horizontal: boolean }
export interface Building {
  x: number; z: number; w: number; d: number; h: number; mat: number;
  roofTrim: boolean; bandTrim: boolean; trimColor: number; bandColor: number;
  sign: { text: number; color: number; rotated: boolean; flicker: boolean } | null;
}
export interface ParkLayout { fountain: Circle; trees: { x: number; z: number; size: number; rot: number }[] }
export interface SkylineBox { x: number; z: number; w: number; d: number; h: number; trim: boolean; trimColor: number }
export interface CityLayout {
  buildings: Building[]; park: ParkLayout; lamps: Vec2[]; skyline: SkylineBox[]; rects: Rect[]; circles: Circle[];
}

export const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  for (let i = 0; i < N - 1; i++)
    for (let j = 0; j < N - 1; j++) {
      const x0 = GRID[i] + ROAD_HALF, x1 = GRID[i + 1] - ROAD_HALF, z0 = GRID[j] + ROAD_HALF, z1 = GRID[j + 1] - ROAD_HALF;
      out.push({ i, j, x0, x1, z0, z1, park: i === PARK.i && j === PARK.j, lot: { x0: x0 + SIDEWALK, x1: x1 - SIDEWALK, z0: z0 + SIDEWALK, z1: z1 - SIDEWALK } });
    }
  return out;
})();

export const SEGMENTS: Segment[] = (() => {
  const out: Segment[] = [];
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N - 1; j++) {
      out.push({ a: { x: GRID[i], z: GRID[j] }, b: { x: GRID[i], z: GRID[j + 1] }, horizontal: false });
      out.push({ a: { x: GRID[j], z: GRID[i] }, b: { x: GRID[j + 1], z: GRID[i] }, horizontal: true });
    }
  return out;
})();

export const BOUNDS = { lo: -ROAD_HALF - SIDEWALK, hi: GRID[N - 1] + ROAD_HALF + SIDEWALK };

const ROOF_SIGN_COUNT = 12;

function buildingsFor(b: Block, r: Rand): Building[] {
  if (b.park) return [];
  const gap = 2, nx = 2, nz = 2;
  const w = (b.lot.x1 - b.lot.x0 - gap) / nx, d = (b.lot.z1 - b.lot.z0 - gap) / nz;
  const central = Math.max(Math.abs(b.i - 1.5), Math.abs(b.j - 1.5)) < 1;
  const out: Building[] = [];
  for (let a = 0; a < nx; a++)
    for (let c = 0; c < nz; c++) {
      const bw = w * between(r, 0.82, 1), bd = d * between(r, 0.82, 1);
      const h = central ? between(r, 28, 70) : between(r, 10, 40);
      const hasSign = r() < 0.3;
      out.push({
        x: b.lot.x0 + w / 2 + a * (w + gap), z: b.lot.z0 + d / 2 + c * (d + gap), w: bw, d: bd, h,
        mat: (b.i * 7 + b.j * 3 + a + c) % 4,
        roofTrim: r() < 0.55, bandTrim: r() < 0.6, trimColor: pick(r, NEON_LIST), bandColor: pick(r, NEON_LIST),
        sign: hasSign ? { text: Math.floor(r() * ROOF_SIGN_COUNT), color: pick(r, NEON_LIST), rotated: r() < 0.5, flicker: r() < 0.4 } : null,
      });
    }
  return out;
}

function parkLayout(r: Rand): ParkLayout {
  const b = BLOCKS.find((k) => k.park)!;
  const cx = (b.lot.x0 + b.lot.x1) / 2, cz = (b.lot.z0 + b.lot.z1) / 2;
  const trees = Array.from({ length: 16 }, (_, k) => {
    const a = (k / 16) * Math.PI * 2, rr = between(r, 11, 22);
    return { x: cx + Math.cos(a) * rr, z: cz + Math.sin(a) * rr, size: between(r, 1.6, 2.4), rot: between(r, 0, 3) };
  });
  return { fountain: { x: cx, z: cz, r: 4.6 }, trees };
}

function lampSpots(): Vec2[] {
  return BLOCKS.flatMap((b) => [
    { x: b.x0 + 1, z: b.z0 + 1 }, { x: b.x1 - 1, z: b.z0 + 1 }, { x: b.x0 + 1, z: b.z1 - 1 }, { x: b.x1 - 1, z: b.z1 - 1 },
    { x: (b.x0 + b.x1) / 2, z: b.z0 + 1 }, { x: (b.x0 + b.x1) / 2, z: b.z1 - 1 },
  ]);
}

function skyline(r: Rand): SkylineBox[] {
  const out: SkylineBox[] = [];
  while (out.length < 110) {
    const x = between(r, -140, 420), z = between(r, -140, 420);
    if (Math.max(Math.abs(x - 140), Math.abs(z - 140)) < 166) continue;
    const w = between(r, 10, 22);
    out.push({ x, z, w, d: w * between(r, 0.7, 1.2), h: between(r, 25, 110), trim: r() < 0.5, trimColor: pick(r, NEON_LIST) });
  }
  return out;
}

export function buildCity(seed = 7): CityLayout {
  const r = mulberry32(seed);
  const buildings = BLOCKS.flatMap((b) => buildingsFor(b, r));
  const park = parkLayout(r);
  const lamps = lampSpots();
  const rects = BLOCKS.filter((b) => !b.park).map((b) => ({ ...b.lot }));
  const circles: Circle[] = [park.fountain, ...park.trees.map((t) => ({ x: t.x, z: t.z, r: 0.6 })), ...lamps.map((l) => ({ ...l, r: 0.35 }))];
  return { buildings, park, lamps, skyline: skyline(r), rects, circles };
}

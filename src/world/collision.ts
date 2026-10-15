import type { Circle, Rect } from "./city";

export const BIKE_RADIUS = 0.6;

/** Pushes a point (with radius r) out of boxes and circles and keeps it inside the city. */
export function resolveCollisions(
  x: number, z: number, rects: readonly Rect[], circles: readonly Circle[], bounds: { lo: number; hi: number }, r = BIKE_RADIUS,
): { x: number; z: number; hit: boolean } {
  let hit = false;
  for (const b of rects) {
    if (x > b.x0 - r && x < b.x1 + r && z > b.z0 - r && z < b.z1 + r) {
      const pen = [x - (b.x0 - r), b.x1 + r - x, z - (b.z0 - r), b.z1 + r - z];
      const k = pen.indexOf(Math.min(...pen));
      if (k === 0) x = b.x0 - r;
      else if (k === 1) x = b.x1 + r;
      else if (k === 2) z = b.z0 - r;
      else z = b.z1 + r;
      hit = true;
    }
  }
  for (const c of circles) {
    const dx = x - c.x, dz = z - c.z, d = Math.hypot(dx, dz), min = c.r + r;
    if (d < min && d > 1e-6) {
      x = c.x + (dx / d) * min;
      z = c.z + (dz / d) * min;
      hit = true;
    }
  }
  const lo = bounds.lo + r, hi = bounds.hi - r;
  if (x < lo || x > hi || z < lo || z > hi) {
    x = Math.min(hi, Math.max(lo, x));
    z = Math.min(hi, Math.max(lo, z));
    hit = true;
  }
  return { x: Math.round(x * 1e9) / 1e9, z: Math.round(z * 1e9) / 1e9, hit };
}

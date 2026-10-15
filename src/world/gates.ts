import { ROAD_HALF, type Circle } from "./city";
import { NEON } from "./palette";

export type GateKey = "profile" | "skills" | "experience" | "projects" | "education" | "contact";
export const GATE_KEYS: GateKey[] = ["profile", "skills", "experience", "projects", "education", "contact"];

export interface Gate { key: GateKey; index: number; x: number; z: number; dx: number; dz: number; color: number }

export const GATES: Gate[] = [
  { key: "profile", index: 0, x: 140, z: 175, dx: 0, dz: 1, color: NEON.lime },
  { key: "skills", index: 1, x: 175, z: 210, dx: 1, dz: 0, color: NEON.cyan },
  { key: "experience", index: 2, x: 280, z: 105, dx: 0, dz: 1, color: NEON.magenta },
  { key: "projects", index: 3, x: 105, z: 0, dx: 1, dz: 0, color: NEON.violet },
  { key: "education", index: 4, x: 0, z: 175, dx: 0, dz: 1, color: NEON.amber },
  { key: "contact", index: 5, x: 175, z: 280, dx: 1, dz: 0, color: NEON.lime },
];

const ENTER_ALONG = 1.6, ENTER_ACROSS = ROAD_HALF + 0.5;
const EXIT_ALONG = 2.6, EXIT_ACROSS = ROAD_HALF + 1.5;

export function gateLocal(g: Gate, x: number, z: number) {
  const rx = x - g.x, rz = z - g.z;
  return { along: rx * g.dx + rz * g.dz, across: Math.abs(rx * g.dz - rz * g.dx) };
}

export const gateYaw = (g: Gate) => Math.atan2(g.dx, g.dz);

export function gatePillars(g: Gate): Circle[] {
  const yaw = gateYaw(g), ax = Math.cos(yaw), az = -Math.sin(yaw), off = ROAD_HALF + 1;
  return [-off, off].map((o) => ({ x: g.x + ax * o, z: g.z + az * o, r: 0.7 }));
}

/** Edge-triggered: reports a gate once when the rider enters it, again only after they have clearly left. */
export class GateTracker {
  private inside = new Set<GateKey>();

  update(x: number, z: number): GateKey[] {
    const entered: GateKey[] = [];
    for (const g of GATES) {
      const { along, across } = gateLocal(g, x, z);
      if (!this.inside.has(g.key)) {
        if (Math.abs(along) < ENTER_ALONG && across < ENTER_ACROSS) {
          this.inside.add(g.key);
          entered.push(g.key);
        }
      } else if (Math.abs(along) > EXIT_ALONG || across > EXIT_ACROSS) this.inside.delete(g.key);
    }
    return entered;
  }

  reset() {
    this.inside.clear();
  }
}

export function nearestUnvisited(x: number, z: number, visited: readonly GateKey[]): { gate: Gate; distance: number } | null {
  let best: { gate: Gate; distance: number } | null = null;
  for (const g of GATES) {
    if (visited.includes(g.key)) continue;
    const distance = Math.hypot(x - g.x, z - g.z);
    if (!best || distance < best.distance) best = { gate: g, distance };
  }
  return best;
}

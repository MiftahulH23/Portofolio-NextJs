import type { PortfolioContent } from "@/content/types";
import { ROAD_HALF, SIDEWALK, type Circle, type Vec2 } from "./city";
import { NEON } from "./palette";

export type BoardDesign = "profile" | "values" | "stack" | "terminal" | "stat" | "contact" | "timeline" | "process" | "browser" | "projects";
export interface BoardFace { design: BoardDesign; project?: string }
export interface BoardSpec { at: Vec2; dir: Vec2; form: "wide" | "tall"; color: number; front: BoardFace; back: BoardFace }

/** Placement and face pairing from the approved prototype v3. */
export const BOARDS: BoardSpec[] = [
  { at: { x: 140, z: 152 }, dir: { x: 0, z: 1 }, form: "wide", color: NEON.lime, front: { design: "profile" }, back: { design: "values" } },
  { at: { x: 175, z: 140 }, dir: { x: 1, z: 0 }, form: "tall", color: NEON.cyan, front: { design: "stack" }, back: { design: "terminal" } },
  { at: { x: 105, z: 140 }, dir: { x: -1, z: 0 }, form: "tall", color: NEON.amber, front: { design: "stat" }, back: { design: "contact" } },
  { at: { x: 140, z: 105 }, dir: { x: 0, z: -1 }, form: "wide", color: NEON.magenta, front: { design: "timeline" }, back: { design: "process" } },
  { at: { x: 210, z: 245 }, dir: { x: 0, z: 1 }, form: "wide", color: NEON.violet, front: { design: "browser", project: "sipresma" }, back: { design: "browser", project: "lps" } },
  { at: { x: 70, z: 105 }, dir: { x: 0, z: -1 }, form: "tall", color: NEON.cyan, front: { design: "projects" }, back: { design: "terminal" } },
  { at: { x: 245, z: 70 }, dir: { x: 1, z: 0 }, form: "wide", color: NEON.lime, front: { design: "process" }, back: { design: "profile" } },
  { at: { x: 35, z: 210 }, dir: { x: -1, z: 0 }, form: "tall", color: NEON.magenta, front: { design: "contact" }, back: { design: "stack" } },
];

/** Pole on the left sidewalk; the face looks at oncoming riders, angled toward the lane. */
export function placeBoard(spec: BoardSpec): { x: number; z: number; yaw: number } {
  const off = ROAD_HALF + SIDEWALK / 2;
  return {
    x: spec.at.x + spec.dir.z * off,
    z: spec.at.z - spec.dir.x * off,
    // `0 - x` (not `-x`) avoids -0, which would make atan2 return -π instead of π.
    yaw: Math.atan2(0 - spec.dir.x, 0 - spec.dir.z) + (spec.form === "tall" ? 0.6 : 0.35),
  };
}

export function boardPole(spec: BoardSpec): Circle {
  const p = placeBoard(spec);
  return { x: p.x, z: p.z, r: spec.form === "tall" ? 1.3 : 0.7 };
}

export interface TimelineEntry { year: string; title: string; org: string; graduated?: boolean }

const firstYear = (s: string) => s.match(/\d{4}/)?.[0] ?? "";
const lastYear = (s: string) => s.match(/\d{4}/g)?.at(-1) ?? "";

export function yearsOf(duration: string): string {
  const a = firstYear(duration), b = lastYear(duration);
  return a && b && a !== b ? `${a} — ${b}` : a;
}

export function timelineEntries(c: PortfolioContent): TimelineEntry[] {
  const items: TimelineEntry[] = c.experience.map((e) => ({ year: firstYear(e.duration), title: e.position, org: e.company }));
  if (c.education.duration) items.push({ year: lastYear(c.education.duration), title: c.education.degree, org: c.education.institution, graduated: true });
  return items.filter((i) => i.year).sort((a, b) => a.year.localeCompare(b.year)).slice(-3);
}

export function resolveFace(face: BoardFace, c: PortfolioContent): BoardFace {
  switch (face.design) {
    case "browser": {
      const p = c.projects.find((x) => x.slug === face.project);
      return p?.github ? face : { design: "profile" };
    }
    case "stat":
      return c.education.gpa ? face : { design: "values" };
    case "timeline":
      return timelineEntries(c).length ? face : { design: "values" };
    case "projects":
      return c.projects.length ? face : { design: "values" };
    default:
      return face;
  }
}

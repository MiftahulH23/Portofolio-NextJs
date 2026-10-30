// @vitest-environment node
import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { BOARDS, boardPole, placeBoard, resolveFace, timelineEntries, yearsOf } from "./billboards";
import { ROAD_HALF, SIDEWALK } from "./city";

describe("billboards", () => {
  it("has 8 boards, half wide and half tall", () => {
    expect(BOARDS).toHaveLength(8);
    expect(BOARDS.filter((b) => b.form === "tall")).toHaveLength(4);
  });

  it("stands on the left sidewalk facing oncoming riders", () => {
    const spec = BOARDS[0]; // at (140,152) heading +z
    const p = placeBoard(spec);
    expect(p.x).toBeCloseTo(140 + ROAD_HALF + SIDEWALK / 2);
    expect(p.z).toBeCloseTo(152);
    expect(p.yaw).toBeCloseTo(Math.PI + 0.35);
    expect(boardPole(spec).r).toBeCloseTo(0.7);
  });

  it("uses every design at least once", () => {
    const used = new Set(BOARDS.flatMap((b) => [b.front.design, b.back.design]));
    expect(used.size).toBe(10);
  });

  it("falls back when a face has no data", () => {
    expect(resolveFace({ design: "browser", project: "nope" }, en)).toEqual({ design: "profile" });
    const noGithub = { ...en, projects: en.projects.map((p) => ({ ...p, github: undefined })) };
    expect(resolveFace({ design: "browser", project: "sipresma" }, noGithub)).toEqual({ design: "profile" });
    expect(resolveFace({ design: "stat" }, { ...en, education: { ...en.education, gpa: 0 } })).toEqual({ design: "values" });
    expect(resolveFace({ design: "projects" }, { ...en, projects: [] })).toEqual({ design: "values" });
    expect(resolveFace({ design: "stack" }, en)).toEqual({ design: "stack" });
  });

  it("builds the timeline from experience and graduation", () => {
    expect(timelineEntries(en).map((e) => e.year)).toEqual(["2025", "2026", "2026"]);
    expect(timelineEntries(en)[0].graduated).toBe(true);
    // Same-year roles stay in the order they happened: the current one comes last.
    expect(timelineEntries(en).map((e) => e.title).slice(1)).toEqual(["Laboratory Teaching Assistant", "Programmer"]);
    expect(yearsOf("Sep 2021 — Oct 2025")).toBe("2021 — 2025");
  });
});

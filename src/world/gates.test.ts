// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ROAD_HALF } from "./city";
import { GATES, GateTracker, gatePillars, nearestUnvisited } from "./gates";


describe("gates", () => {
  it("defines six gates in the spec's order", () => {
    expect(GATES.map((g) => g.key)).toEqual(["profile", "skills", "experience", "projects", "education", "contact"]);
  });

  it("fires once per pass from either direction", () => {
    const t = new GateTracker();
    const hits: string[] = [];
    for (let z = 165; z <= 185; z += 0.5) hits.push(...t.update(140, z));
    for (let z = 185; z >= 165; z -= 0.5) hits.push(...t.update(141, z));
    expect(hits).toEqual(["profile", "profile"]);
  });

  it("hysteresis: jitter on the edge does not re-fire", () => {
    const t = new GateTracker();
    const hits: string[] = [];
    for (let k = 0; k < 40; k++) hits.push(...t.update(140, 175 + (k % 2 ? 1.5 : 2.2)));
    expect(hits).toEqual(["profile"]);
  });

  it("ignores riders beside the gate", () => {
    const t = new GateTracker();
    expect(t.update(140 + ROAD_HALF + 3, 175)).toEqual([]);
  });

  it("pillars stand just outside the road", () => {
    for (const g of GATES)
      for (const p of gatePillars(g)) expect(Math.hypot(p.x - g.x, p.z - g.z)).toBeCloseTo(ROAD_HALF + 1);
  });

  it("points to the nearest unvisited gate", () => {
    expect(nearestUnvisited(140, 128, [])!.gate.key).toBe("profile");
    expect(nearestUnvisited(140, 128, ["profile"])!.gate.key).toBe("skills");
    expect(nearestUnvisited(0, 0, ["profile", "skills", "experience", "projects", "education", "contact"])).toBeNull();
  });
});

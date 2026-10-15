// @vitest-environment node
import { describe, expect, it } from "vitest";
import { MINIMAP_PX, minimapRotation, toMinimap } from "./minimap";

describe("minimap", () => {
  it("maps the world corners (mirrored so screen-left stays left)", () => {
    expect(toMinimap(300, 300)).toEqual({ mx: 0, my: 0 });
    const far = toMinimap(-40, -40);
    expect(far.mx).toBeCloseTo(MINIMAP_PX);
    expect(far.my).toBeCloseTo(MINIMAP_PX);
  });
  it("rotates the arrow opposite to the heading", () => {
    expect(minimapRotation(1)).toBeCloseTo(-1);
  });
});

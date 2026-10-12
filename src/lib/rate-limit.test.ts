// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows `limit` hits per window per key, then blocks until the window passes", () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t });
    expect([rl.check("a"), rl.check("a"), rl.check("a"), rl.check("a")]).toEqual([true, true, true, false]);
    expect(rl.check("b")).toBe(true);
    t = 1001;
    expect(rl.check("a")).toBe(true);
  });
});

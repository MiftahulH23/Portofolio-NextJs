// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { fallbackContributions, getContributions, levelFor, parseCalendar } from "./github";

function sample(weeks: number) {
  return {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: 401,
            weeks: Array.from({ length: weeks }, (_, w) => ({
              contributionDays: Array.from({ length: 7 }, (_, d) => ({
                date: `2026-01-${String(((w * 7 + d) % 28) + 1).padStart(2, "0")}`,
                contributionCount: (w + d) % 5,
              })),
            })),
          },
        },
      },
    },
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("levelFor", () => {
  it("maps counts to 0..4 relative to max", () => {
    expect(levelFor(0, 10)).toBe(0);
    expect(levelFor(1, 10)).toBe(1);
    expect(levelFor(5, 10)).toBe(2);
    expect(levelFor(7, 10)).toBe(3);
    expect(levelFor(10, 10)).toBe(4);
    expect(levelFor(3, 0)).toBe(0);
  });
});

describe("parseCalendar", () => {
  it("keeps the last N weeks and the yearly total", () => {
    const r = parseCalendar(sample(53), 20);
    expect(r?.total).toBe(401);
    expect(r?.days).toHaveLength(140);
    expect(r?.source).toBe("github");
  });

  it("returns null for error payloads", () => {
    expect(parseCalendar({ errors: [{ message: "Bad credentials" }] })).toBeNull();
    expect(parseCalendar(null)).toBeNull();
  });
});

describe("fallbackContributions", () => {
  it("is deterministic with 140 days", () => {
    const a = fallbackContributions();
    expect(a.days).toHaveLength(140);
    expect(a.source).toBe("fallback");
    expect(fallbackContributions()).toEqual(a);
  });
});

describe("getContributions", () => {
  it("falls back without a token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect((await getContributions("x")).source).toBe("fallback");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("falls back when fetch rejects", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await getContributions("x")).source).toBe("fallback");
  });

  it("parses a successful response", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => sample(30) }));
    const r = await getContributions("x");
    expect(r.source).toBe("github");
    expect(r.total).toBe(401);
  });
});

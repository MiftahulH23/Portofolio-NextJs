import { describe, expect, it } from "vitest";
import { formatTime } from "./useLocalTime";

describe("formatTime", () => {
  it("formats 24h time in the given zone", () => {
    expect(formatTime(new Date("2026-10-12T03:05:00Z"), "Asia/Jakarta")).toBe("10:05");
    expect(formatTime(new Date("2026-10-12T17:30:00Z"), "Asia/Jakarta")).toBe("00:30");
  });
});

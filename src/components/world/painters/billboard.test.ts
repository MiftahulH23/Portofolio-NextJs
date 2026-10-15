// @vitest-environment node
import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { initials, splitWords, terminalLines } from "./billboard";

describe("billboard text helpers", () => {
  it("initials from the name", () => {
    expect(initials("Miftahul Huda")).toBe("MH");
  });
  it("splits text into short lines without breaking words", () => {
    expect(splitWords("full-stack web developer", 16)).toEqual(["full-stack web", "developer"]);
  });
  it("terminal lines come from content only", () => {
    const lines = terminalLines(en);
    expect(lines[0]).toEqual({ text: "$ whoami", tone: "cmd" });
    expect(lines[1]).toEqual({ text: "miftahul-huda", tone: "out" });
    const joined = lines.map((l) => l.text).join(" ");
    expect(joined).toContain(en.personal.headline.toLowerCase().split(" ")[0]);
    expect(joined).toContain(en.highlightStack[0].toLowerCase());
    expect(lines.at(-1)).toEqual({ text: "available: true", tone: "ok" });
  });
});

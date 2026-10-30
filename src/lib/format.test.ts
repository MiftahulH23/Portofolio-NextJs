import { describe, expect, it } from "vitest";
import { distance, fmt, hostOf, pad } from "./format";

describe("fmt", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(fmt("Hi {name}, {n} new", { name: "Ana", n: 3 })).toBe("Hi Ana, 3 new");
    expect(fmt("{missing}", {})).toBe("{missing}");
  });
});
describe("distance", () => {
  it("uses metres under a kilometre and localised kilometres above", () => {
    expect(distance(847.6, "en-US")).toBe("848 m");
    expect(distance(1234, "en-US")).toBe("1.23 km");
    expect(distance(1234, "id-ID")).toBe("1,23 km");
  });
});
describe("pad", () => {
  it("pads to two digits", () => {
    expect(pad(1)).toBe("01");
    expect(pad(12)).toBe("12");
  });
});
describe("hostOf", () => {
  it("returns the host or empty string", () => {
    expect(hostOf("https://sipresma.pocari.id/")).toBe("sipresma.pocari.id");
    expect(hostOf(undefined)).toBe("");
    expect(hostOf("not a url")).toBe("");
  });
});

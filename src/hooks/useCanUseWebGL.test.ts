import { afterEach, describe, expect, it, vi } from "vitest";
import { detectWebGL } from "./useCanUseWebGL";

afterEach(() => vi.restoreAllMocks());

describe("detectWebGL", () => {
  it("is false when no context can be created", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(detectWebGL()).toBe(false);
  });

  it("is false when context creation throws", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("GPU blocked");
    });
    expect(detectWebGL()).toBe(false);
  });

  it("is true when a webgl context exists", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as RenderingContext);
    expect(detectWebGL()).toBe(true);
  });
});

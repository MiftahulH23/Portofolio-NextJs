import { afterEach, describe, expect, it, vi } from "vitest";
import { createWorldStore } from "./store";

afterEach(() => vi.restoreAllMocks());

describe("world store", () => {
  it("opens the card on every entry but counts a visit once", () => {
    const s = createWorldStore();
    expect(s.enterGate("profile")).toEqual({ first: true });
    s.closeCard();
    expect(s.enterGate("profile")).toEqual({ first: false });
    expect(s.getState().card).toBe("profile");
    expect(s.getState().visited).toEqual(["profile"]);
  });

  it("finishes after six gates, unless the rider chose to keep exploring", () => {
    const s = createWorldStore();
    for (const k of ["profile", "skills", "experience", "projects", "education"] as const) s.enterGate(k);
    expect(s.getState().finished).toBe(false);
    s.enterGate("contact");
    expect(s.getState().finished).toBe(true);
    s.stayFree();
    expect(s.getState().finished).toBe(false);
    s.enterGate("contact");
    expect(s.getState().finished).toBe(false);
  });

  it("rate-limits toasts", () => {
    const s = createWorldStore();
    s.toast("a", 1000);
    s.toast("b", 2000);
    expect(s.getState().toast).toBe("a");
    s.toast("c", 4000);
    expect(s.getState().toast).toBe("c");
  });

  it("only notifies when nav or speed really change", () => {
    const s = createWorldStore();
    const fn = vi.fn();
    s.subscribe(fn);
    s.setNav({ key: "profile", distance: 47 });
    s.setNav({ key: "profile", distance: 47 });
    s.setKmh(10);
    s.setKmh(10);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("storage throws: mute still toggles in memory", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const s = createWorldStore();
    expect(s.getState().muted).toBe(false);
    expect(() => s.toggleMute()).not.toThrow();
    expect(s.getState().muted).toBe(true);
  });

  it("start() moves to loading and counts attempts", () => {
    const s = createWorldStore();
    s.start();
    expect(s.getState()).toMatchObject({ phase: "loading", attempts: 1 });
    s.setPhase("failed");
    s.start();
    expect(s.getState().attempts).toBe(2);
  });

  it("reset clears progress", () => {
    const s = createWorldStore();
    s.enterGate("skills");
    s.reset();
    expect(s.getState()).toMatchObject({ visited: [], card: null, finished: false, freeRide: false });
  });
});

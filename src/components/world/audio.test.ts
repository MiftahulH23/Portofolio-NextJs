import { afterEach, describe, expect, it, vi } from "vitest";
import { worldStore } from "@/world/store";
import { createAudio } from "./audio";

let oscillators = 0;
class FakeCtx {
  currentTime = 0;
  destination = {};
  state = "running";
  resume = vi.fn();
  createOscillator() {
    oscillators++;
    return { type: "", frequency: { setValueAtTime: vi.fn() }, connect: () => ({ connect: vi.fn() }), start: vi.fn(), stop: vi.fn() };
  }
  createGain() {
    return { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(() => ({})) };
  }
}

afterEach(() => {
  oscillators = 0;
  if (worldStore.getState().muted) worldStore.toggleMute();
});

describe("audio", () => {
  it("is silent until unlocked, plays after, and respects mute", () => {
    vi.stubGlobal("AudioContext", FakeCtx);
    const a = createAudio();
    a.bell();
    expect(oscillators).toBe(0);
    a.unlock();
    a.bell();
    expect(oscillators).toBeGreaterThan(0);
    const before = oscillators;
    worldStore.toggleMute();
    a.chime();
    expect(oscillators).toBe(before);
    vi.unstubAllGlobals();
  });

  it("does not throw when AudioContext is unavailable", () => {
    vi.stubGlobal("AudioContext", undefined);
    const a = createAudio();
    expect(() => {
      a.unlock();
      a.horn();
    }).not.toThrow();
    vi.unstubAllGlobals();
  });
});

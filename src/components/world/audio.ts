import { worldStore } from "@/world/store";

type Wave = OscillatorType;

/** Synthesised UI sounds; nothing plays before a user gesture or while muted. */
export function createAudio() {
  let ctx: AudioContext | null = null;
  function tone(freq: number, dur: number, type: Wave = "sine", vol = 0.15, delay = 0) {
    if (!ctx || worldStore.getState().muted) return;
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }
  return {
    unlock() {
      try {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!ctx && Ctor) ctx = new Ctor();
        void ctx?.resume?.();
      } catch {
        ctx = null;
      }
    },
    bell: () => (tone(2093, 0.5, "triangle", 0.12), tone(2637, 0.45, "triangle", 0.08, 0.08), tone(2093, 0.5, "triangle", 0.1, 0.22)),
    chime: () => (tone(660, 0.4, "sine", 0.12), tone(880, 0.4, "sine", 0.1, 0.1), tone(1320, 0.6, "sine", 0.08, 0.2)),
    horn: () => (tone(392, 0.35, "square", 0.05), tone(494, 0.35, "square", 0.04)),
    bump: () => tone(110, 0.18, "sine", 0.2),
  };
}

export type WorldAudio = ReturnType<typeof createAudio>;

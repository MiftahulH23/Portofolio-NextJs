import { GATE_KEYS, type GateKey } from "./gates";

export type Tier = "high" | "low";
export type Phase = "intro" | "loading" | "running" | "failed";
export interface Nav { key: GateKey; distance: number }
export interface WorldState {
  phase: Phase; attempts: number; visited: GateKey[]; card: GateKey | null; finished: boolean; freeRide: boolean;
  muted: boolean; tier: Tier; nav: Nav | null; kmh: number; toast: string | null; contextLost: boolean;
}

const MUTE_KEY = "kota-neon:muted";
const TOAST_GAP_MS = 2500;

export const INITIAL_STATE: WorldState = {
  phase: "intro", attempts: 0, visited: [], card: null, finished: false, freeRide: false,
  muted: false, tier: "high", nav: null, kmh: 0, toast: null, contextLost: false,
};

export function createWorldStore() {
  let memoryMuted: boolean | null = null;
  const readMuted = () => {
    try {
      return window.localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      return memoryMuted ?? false;
    }
  };
  let state: WorldState = { ...INITIAL_STATE, muted: typeof window === "undefined" ? false : readMuted() };
  let lastToast = -Infinity;
  const listeners = new Set<() => void>();

  function set(patch: Partial<WorldState>) {
    const next = { ...state, ...patch };
    if ((Object.keys(patch) as (keyof WorldState)[]).every((k) => Object.is(state[k], next[k]))) return;
    state = next;
    listeners.forEach((l) => l());
  }

  return {
    getState: () => state,
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    setPhase: (phase: Phase) => set({ phase }),
    /** Start (or retry) loading the world; `attempts` keys the error boundary so a retry remounts it. */
    start: () => set({ phase: "loading", attempts: state.attempts + 1 }),
    enterGate(key: GateKey) {
      const first = !state.visited.includes(key);
      const visited = first ? [...state.visited, key] : state.visited;
      const finished = state.finished || (first && visited.length === GATE_KEYS.length && !state.freeRide);
      set({ visited, card: key, finished });
      return { first };
    },
    openCard: (key: GateKey) => set({ card: key }),
    closeCard: () => set({ card: null }),
    stayFree: () => set({ finished: false, freeRide: true }),
    reset: () => set({ visited: [], card: null, finished: false, freeRide: false, nav: null }),
    toggleMute() {
      const muted = !state.muted;
      try {
        window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
      } catch {
        memoryMuted = muted;
      }
      set({ muted });
    },
    setTier: (tier: Tier) => set({ tier }),
    setNav(nav: Nav | null) {
      if (nav && state.nav && nav.key === state.nav.key && nav.distance === state.nav.distance) return;
      if (!nav && !state.nav) return;
      set({ nav });
    },
    setKmh: (kmh: number) => set({ kmh }),
    toast(message: string, now = Date.now()) {
      if (now - lastToast < TOAST_GAP_MS) return;
      lastToast = now;
      set({ toast: message });
    },
    clearToast: () => set({ toast: null }),
    setContextLost: (contextLost: boolean) => set({ contextLost }),
  };
}

export type WorldStore = ReturnType<typeof createWorldStore>;
export const worldStore = createWorldStore();

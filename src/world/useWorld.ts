"use client";

import { useSyncExternalStore } from "react";
import { INITIAL_STATE, worldStore, type WorldState } from "./store";

/** Selector must return a primitive or a reference already stored in the state (never a fresh object). */
export function useWorld<T>(select: (s: WorldState) => T): T {
  return useSyncExternalStore(worldStore.subscribe, () => select(worldStore.getState()), () => select(INITIAL_STATE));
}

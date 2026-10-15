"use client";

import { useSyncExternalStore } from "react";
import { detectWebGL } from "./useCanUseWebGL";

let cached: boolean | null = null;
const noop = () => () => {};

/** WebGL availability without the width/motion limits of useCanUseWebGL. Assumes support during SSR. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noop, () => (cached ??= detectWebGL()), () => true);
}

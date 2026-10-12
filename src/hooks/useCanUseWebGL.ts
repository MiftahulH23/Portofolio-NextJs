"use client";

import { useSyncExternalStore } from "react";

const WIDE = "(min-width: 900px)";
const REDUCE = "(prefers-reduced-motion: reduce)";
let cachedWebGL: boolean | null = null;

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function snapshot(): boolean {
  if (!window.matchMedia(WIDE).matches || window.matchMedia(REDUCE).matches) return false;
  if (cachedWebGL === null) cachedWebGL = detectWebGL();
  return cachedWebGL;
}

function subscribe(callback: () => void) {
  const wide = window.matchMedia(WIDE);
  const reduce = window.matchMedia(REDUCE);
  wide.addEventListener("change", callback);
  reduce.addEventListener("change", callback);
  return () => {
    wide.removeEventListener("change", callback);
    reduce.removeEventListener("change", callback);
  };
}

export function useCanUseWebGL(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

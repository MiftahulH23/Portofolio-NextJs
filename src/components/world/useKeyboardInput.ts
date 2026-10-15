"use client";

import { useEffect } from "react";
import type { BikeInput } from "@/world/bike";

const MAP: Record<string, keyof BikeInput> = {
  KeyW: "gas", ArrowUp: "gas", KeyS: "brake", ArrowDown: "brake", KeyA: "left", ArrowLeft: "left",
  KeyD: "right", ArrowRight: "right", ShiftLeft: "boost", ShiftRight: "boost",
};

export function useKeyboardInput(input: BikeInput, handlers: { onBell(): void; onEscape(): void }, enabled: boolean) {
  useEffect(() => {
    const release = () => {
      (Object.keys(input) as (keyof BikeInput)[]).forEach((k) => (input[k] = false));
    };
    if (!enabled) {
      release();
      return;
    }
    const down = (e: KeyboardEvent) => {
      const k = MAP[e.code];
      if (k) {
        input[k] = true;
        e.preventDefault();
      } else if (e.code === "Space") {
        // A focused control keeps its own Space activation (buttons, links, form fields).
        if (e.target instanceof Element && e.target.closest("button, a, input, textarea, select, [role='button']")) return;
        e.preventDefault();
        if (!e.repeat) handlers.onBell();
      } else if (e.code === "Escape") handlers.onEscape();
    };
    const up = (e: KeyboardEvent) => {
      const k = MAP[e.code];
      if (k) input[k] = false;
    };
    const vis = () => {
      if (document.visibilityState === "hidden") release();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", vis);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", vis);
      release();
    };
  }, [input, handlers, enabled]);
}

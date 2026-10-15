"use client";

import { useEffect, useState } from "react";

/** Canvas 2D needs real family names; next/font exposes them through CSS variables. */
export function canvasFonts(): { display: string; mono: string } {
  if (typeof document === "undefined") return { display: "system-ui, sans-serif", mono: "ui-monospace, monospace" };
  const cs = getComputedStyle(document.documentElement);
  const display = cs.getPropertyValue("--font-bricolage").trim();
  const mono = cs.getPropertyValue("--font-geist-mono").trim();
  return { display: `${display ? display + ", " : ""}system-ui, sans-serif`, mono: `${mono ? mono + ", " : ""}ui-monospace, monospace` };
}

export function useFontsReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const done = () => alive && setReady(true);
    if (document.fonts?.ready) document.fonts.ready.then(done, done);
    else done();
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

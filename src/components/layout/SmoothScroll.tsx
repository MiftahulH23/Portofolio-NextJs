"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -96 } }}>
      {children}
    </ReactLenis>
  );
}

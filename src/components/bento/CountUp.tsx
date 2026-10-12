"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  value: number;
  decimals?: number;
  duration?: number;
}

/** Renders the final value (SSR/no-JS safe), then counts up from 0 once visible. */
export function CountUp({ value, decimals = 0, duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, decimals, duration]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}

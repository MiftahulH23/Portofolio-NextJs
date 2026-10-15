"use client";

import { useEffect, useRef } from "react";
import { HOMES, ICONS } from "./icon-paths";

/** Flat SVG version of the floating icons: CSS float + pointer parallax; static under reduced motion. */
export function FloatingIconsCss() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function move(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el!.style.setProperty("--px", String(px));
      el!.style.setProperty("--py", String(py));
    }
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="relative size-full">
      {ICONS.map((icon, i) => {
        const [x, y, z] = HOMES[i];
        const depth = 1 + z * 0.4;
        return (
          <span
            key={icon.name}
            data-testid="float-icon"
            className="absolute flex size-16 items-center justify-center rounded-2xl border border-ink-600 bg-ink-850/80 text-lime shadow-[0_0_24px_rgba(163,230,53,.18)] motion-safe:animate-float"
            style={{
              left: `${50 + x * 14}%`,
              top: `${50 - y * 15}%`,
              animationDelay: `${i * -0.9}s`,
              transform: `translate(calc(-50% + var(--px, 0) * ${18 * depth}px), calc(-50% + var(--py, 0) * ${18 * depth}px))`,
            }}
          >
            <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              {icon.paths.map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
          </span>
        );
      })}
    </div>
  );
}

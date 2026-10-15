import { Layers, Monitor, Server, Smartphone, type LucideIcon } from "lucide-react";
import type { ServiceIcon } from "@/content";

const ICONS: Record<ServiceIcon, LucideIcon> = { frontend: Monitor, backend: Server, fullstack: Layers, mobile: Smartphone };
const DEPTH = 7;

/**
 * A neon glyph given depth by stacking copies along Z (pure CSS, no WebGL).
 * It sways slowly, and turns toward the viewer and lights up while its card (a `group`) is hovered.
 */
export function ServiceIcon3D({ icon, delay = 0 }: { icon: ServiceIcon; delay?: number }) {
  const Icon = ICONS[icon];
  return (
    <div data-service-icon={icon} aria-hidden="true" className="relative size-14 [perspective:420px]">
      <div className="absolute -inset-3 rounded-full bg-lime/0 blur-xl transition-colors duration-500 group-hover:bg-lime/15" />
      <div
        className="relative size-full [transform-style:preserve-3d] motion-safe:animate-sway group-hover:[animation-play-state:paused]"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="relative size-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(-8deg)_rotateY(-18deg)_scale(1.12)]">
          {Array.from({ length: DEPTH }, (_, i) => {
            const front = i === DEPTH - 1;
            return (
              <Icon
                key={i}
                strokeWidth={1.7}
                className={front ? "absolute inset-0 size-full text-lime transition-[filter] duration-500 group-hover:drop-shadow-[0_0_10px_rgba(163,230,53,.9)]" : "absolute inset-0 size-full text-lime"}
                style={{ transform: `translateZ(${(i - (DEPTH - 1)) * 1.4}px)`, opacity: front ? 1 : 0.12 + (i / DEPTH) * 0.35 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

interface GridBackgroundProps {
  /** "dots" renders a dot grid, "lines" renders crossing lines */
  variant?: "dots" | "lines";
  /** Opacity of the grid pattern (0–1) */
  opacity?: number;
  /** Fade strength — how aggressively the edges fade out */
  fade?: "soft" | "hard";
  className?: string;
}

/**
 * Aceternity-style background grid.
 * Drop inside any `relative overflow-hidden` section as the first child.
 */
export default function GridBackground({
  variant = "lines",
  opacity = 1,
  fade = "soft",
  className = "",
}: GridBackgroundProps) {
  const maskSoft =
    "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)";
  const maskHard =
    "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)";

  const mask = fade === "soft" ? maskSoft : maskHard;

  if (variant === "dots") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 ${className}`}
        style={{ opacity, WebkitMaskImage: mask, maskImage: mask }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="dot-grid"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>
    );
  }

  // Lines variant
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{ opacity, WebkitMaskImage: mask, maskImage: mask }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="line-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            {/* Vertical line */}
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.055)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#line-grid)" />
      </svg>
    </div>
  );
}

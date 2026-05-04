import { Variants } from "framer-motion";

// Cubic bezier easing — typed as const tuple to satisfy framer-motion's Easing type
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Staggered fade-up variant.
 * Usage: custom={index}, variants={fadeUp}
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: EASE_OUT_EXPO,
    },
  }),
};

/**
 * Faster stagger (for skills/dense grids).
 */
export const fadeUpFast: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.05,
      ease: EASE_OUT_EXPO,
    },
  }),
};

/**
 * Simple fade (no translate).
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: "easeOut",
    },
  }),
};

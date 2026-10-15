/** Developer glyphs as 24×24 stroke paths (lucide geometry), drawn as neon tubes in 3D and as SVG in the CSS fallback. */
export const ICONS: { name: string; paths: string[] }[] = [
  { name: "code", paths: ["M16 18L22 12L16 6", "M8 6L2 12L8 18"] },
  { name: "braces", paths: ["M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1", "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"] },
  { name: "terminal", paths: ["M4 17L10 11L4 5", "M12 19H20"] },
  { name: "git", paths: ["M6 3V15", "M15 6a3 3 0 1 0 6 0a3 3 0 1 0-6 0", "M3 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0", "M18 9a9 9 0 0 1-9 9"] },
  { name: "database", paths: ["M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0", "M3 5V19A9 3 0 0 0 21 19V5", "M3 12A9 3 0 0 0 21 12"] },
  { name: "zap", paths: ["M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"] },
];

/** Resting layout inside the card, in world units (camera at z=9 looking at the origin). */
export const HOMES: [number, number, number][] = [
  [-1.9, 1.5, 0], [1.7, 1.8, -0.6], [0.1, 0.2, 0.6], [-1.6, -1.6, -0.4], [1.9, -1.2, 0.2], [0.2, 2.6, -1.2],
];

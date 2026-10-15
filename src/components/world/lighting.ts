/**
 * three r180 uses physically based light units (the prototype ran r128 legacy lights),
 * so intensities here are scaled up from the prototype. Tune only in this file.
 */
export const LIGHT = {
  hemi: { sky: 0x6a5ae6, ground: 0x140c22, intensity: 2.2 },
  moon: { color: 0x9fb4ff, intensity: 1.1, position: [-80, 140, -40] as [number, number, number] },
  gate: { intensity: 60, distance: 24, decay: 2 },
  headlight: { intensity: 140, distance: 36, angle: 0.5, penumbra: 0.55, decay: 1.3 },
  windows: 0.75,
  bloom: { intensity: 0.85, threshold: 0.62, smoothing: 0.2 },
  fog: { high: 0.0085, low: 0.011 },
} as const;

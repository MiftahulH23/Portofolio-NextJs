export const MINIMAP_PX = 336;
const SPAN = 340;
const MAX = 300;
export const MINIMAP_SCALE = MINIMAP_PX / SPAN;

/** Mirrored on x so that a left turn in the world is a left turn on the map. */
export const toMinimap = (x: number, z: number) => ({ mx: (MAX - x) * MINIMAP_SCALE, my: (MAX - z) * MINIMAP_SCALE });
export const minimapRotation = (heading: number) => -heading;

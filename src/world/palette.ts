export const NEON = { lime: 0xb6f23a, cyan: 0x38e1ff, magenta: 0xff3da8, violet: 0x8b5cff, amber: 0xffb020 } as const;
export const NEON_LIST = [NEON.cyan, NEON.magenta, NEON.lime, NEON.violet, NEON.amber] as const;
export const SKY = 0x08071a;
export const FOG = 0x0b0920;
export const hex = (c: number) => "#" + c.toString(16).padStart(6, "0");

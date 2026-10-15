import { CanvasTexture, NearestFilter, RepeatWrapping, SRGBColorSpace } from "three";
import { mulberry32 } from "@/world/random";

const TINTS = ["#ffd58a", "#9fe8ff", "#ff9bd2", "#e8e4ff"];

/** Lit-window pattern; tiles every 14×28 world units (see buildingGeometry UVs). */
export function windowTexture(seed: number): CanvasTexture {
  const r = mulberry32(100 + seed);
  const cv = document.createElement("canvas");
  cv.width = 64;
  cv.height = 128;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 64, 128);
  for (let y = 4; y < 124; y += 8)
    for (let x = 4; x < 60; x += 8)
      if (r() < 0.4) {
        g.fillStyle = TINTS[(seed + x + y) % TINTS.length];
        g.globalAlpha = 0.45 + r() * 0.55;
        g.fillRect(x, y, 4, 5);
      }
  const t = new CanvasTexture(cv);
  t.magFilter = NearestFilter;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = SRGBColorSpace;
  return t;
}

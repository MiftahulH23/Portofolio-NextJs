import { AdditiveBlending, CanvasTexture, PointsMaterial, SRGBColorSpace } from "three";
import { hex } from "@/world/palette";
import { fit } from "./draw";

/** Neon text panel (roof signs, gate plates). */
export function signTexture(text: string, color: number, family: string, w = 512, h = 128): CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d")!;
  const c = hex(color);
  g.fillStyle = "rgba(6,5,16,.95)";
  g.fillRect(0, 0, w, h);
  g.strokeStyle = c;
  g.lineWidth = 6;
  g.strokeRect(5, 5, w - 10, h - 10);
  fit(g, text, w - 40, Math.floor(h * 0.42), 800, family);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = c;
  g.shadowBlur = 18;
  g.fillStyle = c;
  g.fillText(text, w / 2, h / 2 + 3);
  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

let glow: CanvasTexture | null = null;
export function glowTexture(): CanvasTexture {
  if (glow) return glow;
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const g = cv.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.3, "rgba(255,255,255,.35)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  glow = new CanvasTexture(cv);
  return glow;
}

/** One draw call for many soft light halos. */
export function glowPointsMaterial(color: number, size: number): PointsMaterial {
  return new PointsMaterial({ map: glowTexture(), color, size, sizeAttenuation: true, transparent: true, depthWrite: false, blending: AdditiveBlending });
}

export type Ctx = CanvasRenderingContext2D;

export function rr(g: Ctx, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export const setFont = (g: Ctx, weight: number, size: number, family: string) => {
  g.font = `${weight} ${size}px ${family}`;
};

/** Shrinks the font until `text` fits `maxW`; returns the size used. */
export function fit(g: Ctx, text: string, maxW: number, size: number, weight: number, family: string): number {
  setFont(g, weight, size, family);
  while (g.measureText(text).width > maxW && size > 12) {
    size -= 2;
    setFont(g, weight, size, family);
  }
  return size;
}

/** Word-wraps with the current font; returns the y after the last line. */
export function wrap(g: Ctx, text: string, x: number, y: number, maxW: number, lineH: number, maxLines = 3): number {
  const words = text.split(" ");
  let line = "", lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (g.measureText(test).width > maxW && line) {
      if (lines === maxLines - 1) {
        g.fillText(line + "…", x, y);
        return y + lineH;
      }
      g.fillText(line, x, y);
      y += lineH;
      lines++;
      line = word;
    } else line = test;
  }
  if (line) g.fillText(line, x, y);
  return y + lineH;
}

export function label(g: Ctx, text: string, x: number, y: number, color: string, mono: string) {
  setFont(g, 700, 22, mono);
  g.fillStyle = color;
  g.fillText(text.split("").join(String.fromCharCode(8202)), x, y);
}

export function chip(g: Ctx, text: string, x: number, y: number, color: string, mono: string, size = 24): number {
  setFont(g, 600, size, mono);
  const w = g.measureText(text).width + size * 1.3, h = size * 1.9;
  rr(g, x, y - h * 0.68, w, h, h / 2);
  g.strokeStyle = color;
  g.lineWidth = 2.5;
  g.stroke();
  g.fillStyle = color;
  g.fillText(text, x + size * 0.65, y + 2);
  return w;
}

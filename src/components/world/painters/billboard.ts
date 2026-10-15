import { CanvasTexture, SRGBColorSpace } from "three";
import type { PortfolioContent, UiStrings } from "@/content";
import { resolveFace, timelineEntries, yearsOf, type BoardFace, type BoardSpec } from "@/world/billboards";
import { hex } from "@/world/palette";
import { chip, fit, label, rr, setFont, wrap, type Ctx } from "./draw";

const INK = "#eceaff", MUTE = "#a6a3c8", DARK = "#0b0a18", LIME = "#b6f23a";
type Fonts = { display: string; mono: string };
interface P { g: Ctx; w: number; h: number; c: string; f: Fonts; content: PortfolioContent; ui: UiStrings; face: BoardFace }

export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export function splitWords(text: string, max: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const t = line ? `${line} ${word}` : word;
    if (t.length > max && line) {
      out.push(line);
      line = word;
    } else line = t;
  }
  if (line) out.push(line);
  return out;
}

export function terminalLines(c: PortfolioContent): { text: string; tone: "cmd" | "out" | "ok" | "gap" }[] {
  const stack = c.highlightStack.slice(0, 4).map((s) => s.toLowerCase());
  return [
    { text: "$ whoami", tone: "cmd" },
    { text: c.personal.name.toLowerCase().replace(/\s+/g, "-"), tone: "out" },
    { text: "", tone: "gap" },
    { text: "$ cat role.txt", tone: "cmd" },
    ...splitWords(c.personal.headline.toLowerCase(), 16).map((t) => ({ text: t, tone: "out" as const })),
    { text: "", tone: "gap" },
    { text: "$ ls stack/", tone: "cmd" },
    { text: `${stack[0]}  ${stack[1]}`, tone: "out" },
    { text: `${stack[2]}  ${stack[3]}`, tone: "out" },
    { text: "", tone: "gap" },
    { text: "$ status --work", tone: "cmd" },
    { text: "available: true", tone: "ok" },
  ];
}

const PAINT: Record<BoardFace["design"], (p: P) => void> = {
  profile({ g, c, f, content, ui }) {
    const cx = 220, cy = 256, r = 132;
    const gr = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    gr.addColorStop(0, c);
    gr.addColorStop(1, "#38e1ff");
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fillStyle = gr;
    g.fill();
    g.beginPath();
    g.arc(cx, cy, r + 14, 0, Math.PI * 2);
    g.strokeStyle = c;
    g.globalAlpha = 0.4;
    g.lineWidth = 3;
    g.stroke();
    g.globalAlpha = 1;
    setFont(g, 800, 104, f.display);
    g.fillStyle = DARK;
    g.textAlign = "center";
    g.fillText(initials(content.personal.name), cx, cy + 38);
    g.textAlign = "left";
    label(g, content.personal.headline.toUpperCase(), 410, 170, c, f.mono);
    const name = content.personal.name.toUpperCase();
    fit(g, name, 560, 78, 800, f.display);
    g.fillStyle = INK;
    g.fillText(name, 408, 262);
    g.fillStyle = c;
    g.fillRect(410, 292, 72, 6);
    setFont(g, 500, 30, f.display);
    g.fillStyle = MUTE;
    g.fillText(content.personal.location, 410, 352);
    chip(g, ui.world.boards.available, 410, 420, c, f.mono, 22);
  },
  values({ g, w, c, f, ui }) {
    const b = ui.world.boards;
    label(g, b.valuesLabel, 64, 96, c, f.mono);
    const cw = (w - 128) / 3;
    b.values.forEach(([t, d], i) => {
      const x = 64 + i * cw + (i ? 28 : 0);
      if (i) {
        g.fillStyle = "rgba(160,150,255,.25)";
        g.fillRect(64 + i * cw - 2, 170, 2, 240);
      }
      fit(g, t, cw - 56, 70, 800, f.display);
      g.fillStyle = i === 1 ? INK : c;
      g.fillText(t, x, 280);
      setFont(g, 500, 26, f.display);
      g.fillStyle = MUTE;
      wrap(g, d, x, 336, cw - 56, 36, 2);
    });
    setFont(g, 600, 22, f.mono);
    g.fillStyle = MUTE;
    g.fillText(b.valuesFooter, 64, 456);
  },
  stack({ g, w, c, f, content, ui }) {
    label(g, ui.world.boards.stackLabel, 44, 86, c, f.mono);
    fit(g, ui.world.boards.stackHeading, w - 88, 40, 800, f.display);
    g.fillStyle = INK;
    g.fillText(ui.world.boards.stackHeading, 44, 146);
    const tw = (w - 88 - 16) / 2, th = 104;
    content.highlightStack.slice(0, 8).forEach((t, i) => {
      const x = 44 + (i % 2) * (tw + 16), y = 196 + Math.floor(i / 2) * (th + 16);
      rr(g, x, y, tw, th, 18);
      g.fillStyle = "rgba(255,255,255,.04)";
      g.fill();
      g.strokeStyle = c;
      g.globalAlpha = 0.55;
      g.lineWidth = 2;
      g.stroke();
      g.globalAlpha = 1;
      g.fillStyle = c;
      g.fillRect(x + 22, y + 26, 10, 10);
      fit(g, t, tw - 44, 30, 700, f.display);
      g.fillStyle = INK;
      g.fillText(t, x + 22, y + 78);
    });
  },
  terminal({ g, w, h, c, f, content }) {
    g.fillStyle = "#04050a";
    g.fillRect(16, 16, w - 32, h - 32);
    g.fillStyle = "#16142a";
    g.fillRect(16, 16, w - 32, 56);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((d, i) => {
      g.beginPath();
      g.arc(50 + i * 30, 44, 9, 0, Math.PI * 2);
      g.fillStyle = d;
      g.fill();
    });
    setFont(g, 600, 20, f.mono);
    g.fillStyle = MUTE;
    g.fillText(`~/${content.personal.githubLogin.toLowerCase()}`, 160, 51);
    let y = 130;
    setFont(g, 600, 27, f.mono);
    for (const l of terminalLines(content)) {
      if (l.tone !== "gap") {
        g.fillStyle = l.tone === "cmd" ? c : l.tone === "ok" ? LIME : INK;
        g.fillText(l.text, 44, y);
      }
      y += l.tone === "gap" ? 18 : 40;
    }
    g.fillStyle = c;
    g.fillRect(44, y - 26, 16, 30);
  },
  stat({ g, w, c, f, content, ui }) {
    const e = content.education;
    label(g, ui.world.boards.gpaLabel, 44, 90, c, f.mono);
    setFont(g, 800, 150, f.display);
    g.fillStyle = c;
    g.fillText(e.gpa.toFixed(2), 36, 290);
    setFont(g, 700, 44, f.display);
    g.fillStyle = MUTE;
    g.fillText(`/ ${e.gpaMax.toFixed(2)}`, 44, 360);
    g.fillStyle = "rgba(160,150,255,.3)";
    g.fillRect(44, 410, w - 88, 2);
    setFont(g, 800, 34, f.display);
    g.fillStyle = INK;
    const after = wrap(g, e.degree, 44, 476, w - 88, 44, 2);
    setFont(g, 500, 26, f.display);
    g.fillStyle = MUTE;
    wrap(g, e.institution, 44, after + 26, w - 88, 34, 2);
    chip(g, yearsOf(e.duration), 44, 690, c, f.mono, 22);
  },
  contact({ g, w, c, f, content, ui }) {
    const b = ui.world.boards, p = content.personal;
    label(g, b.contactLabel, 44, 90, c, f.mono);
    fit(g, b.contactHeading, w - 88, 46, 800, f.display);
    g.fillStyle = INK;
    g.fillText(b.contactHeading, 44, 154);
    const rows: [string, string][] = [["EMAIL", p.email], ["GITHUB", strip(p.socials.github)], ["LINKEDIN", strip(p.socials.linkedin)]];
    rows.forEach(([k, v], i) => {
      const y = 230 + i * 128;
      rr(g, 44, y, w - 88, 104, 16);
      g.fillStyle = "rgba(255,255,255,.04)";
      g.fill();
      g.strokeStyle = "rgba(160,150,255,.28)";
      g.lineWidth = 2;
      g.stroke();
      setFont(g, 700, 18, f.mono);
      g.fillStyle = c;
      g.fillText(k, 66, y + 38);
      fit(g, v, w - 132, 28, 700, f.display);
      g.fillStyle = INK;
      g.fillText(v, 66, y + 80);
    });
    setFont(g, 500, 22, f.display);
    g.fillStyle = MUTE;
    g.fillText(b.contactFooter, 44, 660);
  },
  timeline({ g, w, c, f, content, ui }) {
    label(g, ui.world.boards.timelineLabel, 64, 96, c, f.mono);
    const y = 270, x0 = 110, x1 = w - 110;
    g.fillStyle = "rgba(160,150,255,.35)";
    g.fillRect(x0, y - 2, x1 - x0, 4);
    const items = timelineEntries(content);
    items.forEach((e, i) => {
      const x = items.length === 1 ? (x0 + x1) / 2 : x0 + (i * (x1 - x0)) / (items.length - 1);
      const last = i === items.length - 1;
      g.beginPath();
      g.arc(x, y, 16, 0, Math.PI * 2);
      g.fillStyle = last ? c : DARK;
      g.fill();
      g.strokeStyle = c;
      g.lineWidth = 5;
      g.stroke();
      g.textAlign = "center";
      setFont(g, 800, 50, f.display);
      g.fillStyle = c;
      g.fillText(e.year, x, y - 46);
      const title = e.graduated ? ui.world.boards.graduated : e.title;
      fit(g, title, 280, 28, 800, f.display);
      g.fillStyle = INK;
      g.fillText(title, x, y + 72);
      fit(g, e.org, 280, 22, 500, f.display);
      g.fillStyle = MUTE;
      g.fillText(e.org, x, y + 110);
      g.textAlign = "left";
    });
  },
  process({ g, w, c, f, content, ui }) {
    label(g, ui.world.boards.processLabel, 64, 96, c, f.mono);
    const steps = content.process.slice(0, 4), sw = (w - 128) / steps.length;
    steps.forEach((s, i) => {
      const cx = 64 + sw * i + sw / 2, cy = 230, last = i === steps.length - 1;
      if (!last) {
        g.strokeStyle = "rgba(160,150,255,.45)";
        g.lineWidth = 3;
        g.setLineDash([10, 10]);
        g.beginPath();
        g.moveTo(cx + 52, cy);
        g.lineTo(cx + sw - 52, cy);
        g.stroke();
        g.setLineDash([]);
      }
      g.beginPath();
      g.arc(cx, cy, 42, 0, Math.PI * 2);
      g.fillStyle = last ? c : DARK;
      g.fill();
      g.strokeStyle = c;
      g.lineWidth = 4;
      g.stroke();
      g.textAlign = "center";
      setFont(g, 800, 34, f.display);
      g.fillStyle = last ? DARK : c;
      g.fillText(String(i + 1), cx, cy + 12);
      fit(g, s.title, sw - 20, 34, 800, f.display);
      g.fillStyle = INK;
      g.fillText(s.title, cx, cy + 106);
      setFont(g, 500, 20, f.display);
      g.fillStyle = MUTE;
      wrap(g, s.description, cx, cy + 142, sw - 24, 26, 2);
      g.textAlign = "left";
    });
  },
  browser({ g, w, h, c, f, content, ui, face }) {
    const p = content.projects.find((x) => x.slug === face.project)!;
    rr(g, 40, 40, w - 80, h - 80, 22);
    g.fillStyle = "#0f0d22";
    g.fill();
    g.strokeStyle = "rgba(160,150,255,.35)";
    g.lineWidth = 2;
    g.stroke();
    ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
      g.beginPath();
      g.arc(80 + i * 28, 84, 9, 0, Math.PI * 2);
      g.fillStyle = col;
      g.fill();
    });
    rr(g, 190, 64, w - 270, 40, 20);
    g.fillStyle = "rgba(255,255,255,.06)";
    g.fill();
    const url = strip(p.github!);
    fit(g, url, w - 310, 20, 500, f.mono);
    g.fillStyle = MUTE;
    g.fillText(url, 212, 91);
    g.fillStyle = "rgba(160,150,255,.2)";
    g.fillRect(40, 126, w - 80, 2);
    label(g, ui.world.boards.featured, 84, 186, c, f.mono);
    fit(g, p.title, w - 168, 52, 800, f.display);
    g.fillStyle = INK;
    g.fillText(p.title, 82, 256);
    setFont(g, 500, 28, f.display);
    g.fillStyle = MUTE;
    wrap(g, p.description, 84, 312, w - 168, 38, 3);
    let x = 84;
    for (const t of p.technologies.slice(0, 4)) x += chip(g, t, x, 432, c, f.mono, 20) + 12;
  },
  projects({ g, w, c, f, content, ui }) {
    label(g, ui.world.boards.projectsLabel, 44, 90, c, f.mono);
    setFont(g, 800, 96, f.display);
    g.fillStyle = c;
    g.fillText(String(content.projects.length), 40, 210);
    setFont(g, 800, 34, f.display);
    g.fillStyle = INK;
    wrap(g, ui.world.boards.projectsHeading, 116 + (content.projects.length > 9 ? 40 : 0), 168, w - 160, 40, 2);
    content.projects.slice(0, 4).forEach((p, i) => {
      const y = 276 + i * 112;
      g.fillStyle = "rgba(160,150,255,.25)";
      g.fillRect(44, y - 34, w - 88, 2);
      g.fillStyle = c;
      g.fillRect(44, y + 2, 12, 12);
      setFont(g, 700, 26, f.display);
      g.fillStyle = INK;
      wrap(g, p.title, 74, y + 16, w - 124, 34, 2);
    });
  },
};

export function boardTexture(face: BoardFace, spec: BoardSpec, content: PortfolioContent, ui: UiStrings, f: Fonts): CanvasTexture {
  const tall = spec.form === "tall";
  const w = tall ? 512 : 1024, h = tall ? 768 : 512;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d")!;
  const c = hex(spec.color);
  const bg = g.createLinearGradient(0, 0, w * 0.4, h);
  bg.addColorStop(0, "#15123a");
  bg.addColorStop(1, "#08071a");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.globalAlpha = 0.07;
  g.fillStyle = c;
  for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 1);
  g.globalAlpha = 1;
  g.textBaseline = "alphabetic";
  g.textAlign = "left";
  const resolved = resolveFace(face, content);
  PAINT[resolved.design]({ g, w, h, c, f, content, ui, face: resolved });
  g.strokeStyle = c;
  g.lineWidth = 6;
  g.strokeRect(3, 3, w - 6, h - 6);
  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

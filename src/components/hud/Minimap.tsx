"use client";

import { useEffect, useRef } from "react";
import { BOARDS, placeBoard } from "@/world/billboards";
import { BLOCKS, ROAD_HALF, SEGMENTS } from "@/world/city";
import { GATES } from "@/world/gates";
import { MINIMAP_PX, MINIMAP_SCALE, minimapRotation, toMinimap } from "@/world/minimap";
import { hex, NEON } from "@/world/palette";
import { getRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";

export function Minimap() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const g = ref.current?.getContext("2d");
    if (!g) return;
    let raf = 0, last = 0;
    const park = BLOCKS.find((b) => b.park)!;
    const boards = BOARDS.map((b) => ({ ...placeBoard(b), color: b.color }));
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 1000 / 15) return;
      last = t;
      const rt = getRuntime();
      const visited = worldStore.getState().visited;
      g.clearRect(0, 0, MINIMAP_PX, MINIMAP_PX);
      g.strokeStyle = "rgba(160,150,255,.35)";
      g.lineWidth = ROAD_HALF * 2 * MINIMAP_SCALE;
      g.lineCap = "square";
      for (const s of SEGMENTS) {
        const a = toMinimap(s.a.x, s.a.z), b = toMinimap(s.b.x, s.b.z);
        g.beginPath();
        g.moveTo(a.mx, a.my);
        g.lineTo(b.mx, b.my);
        g.stroke();
      }
      const p0 = toMinimap(park.x1, park.z1);
      g.fillStyle = "rgba(34,211,154,.25)";
      g.fillRect(p0.mx, p0.my, (park.x1 - park.x0) * MINIMAP_SCALE, (park.z1 - park.z0) * MINIMAP_SCALE);
      g.fillStyle = "rgba(236,234,255,.55)";
      for (const c of rt.cars) {
        const m = toMinimap(c.pos.x, c.pos.z);
        g.fillRect(m.mx - 3, m.my - 3, 6, 6);
      }
      for (const b of boards) {
        const m = toMinimap(b.x, b.z);
        g.fillStyle = hex(b.color);
        g.fillRect(m.mx - 5, m.my - 5, 10, 10);
      }
      for (const gt of GATES) {
        const m = toMinimap(gt.x, gt.z), done = visited.includes(gt.key);
        // Visited gates keep their colour but turn into a ring, like a passed stop on a transit map.
        g.beginPath();
        g.arc(m.mx, m.my, done ? 8 : 10, 0, Math.PI * 2);
        if (done) {
          g.lineWidth = 4;
          g.strokeStyle = hex(gt.color);
          g.stroke();
        } else {
          g.fillStyle = hex(gt.color);
          g.fill();
        }
      }
      const me = toMinimap(rt.bike.x, rt.bike.z);
      g.save();
      g.translate(me.mx, me.my);
      g.rotate(minimapRotation(rt.bike.heading));
      g.beginPath();
      g.moveTo(0, -16);
      g.lineTo(10, 12);
      g.lineTo(0, 6);
      g.lineTo(-10, 12);
      g.closePath();
      g.fillStyle = "#fff";
      g.shadowColor = hex(NEON.lime);
      g.shadowBlur = 12;
      g.fill();
      g.restore();
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      width={MINIMAP_PX}
      height={MINIMAP_PX}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-[calc(52px+env(safe-area-inset-bottom))] left-[18px] z-20 size-[168px] rounded-[6px] bg-[#05050a]/85 [@media(pointer:coarse)]:bottom-auto [@media(pointer:coarse)]:left-auto [@media(pointer:coarse)]:right-4 [@media(pointer:coarse)]:top-[calc(68px+env(safe-area-inset-top))] [@media(pointer:coarse)]:size-20 [@media(pointer:coarse)]:rounded-xl [@media(pointer:coarse)]:opacity-85"
    />
  );
}

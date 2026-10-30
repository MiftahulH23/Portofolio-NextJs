"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { distance, fmt, pad } from "@/lib/format";
import { GATES } from "@/world/gates";
import { getRuntime, resetRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { gateStyle } from "@/lib/gate-color";

export function FinishDialog() {
  const { ui, content, lang } = useLanguage();
  const finished = useWorld((s) => s.finished);
  const visited = useWorld((s) => s.visited);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!finished) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") worldStore.stayFree();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (previous?.isConnected) previous.focus();
    };
  }, [finished]);
  if (!finished) return null;
  const f = ui.world.finish;
  const trip = getRuntime().trip;
  const locale = lang === "id" ? "id-ID" : "en-US";
  const minutes = Math.floor(trip.seconds / 60);
  const stats = [
    [f.distance, distance(trip.meters, locale)],
    [f.time, `${minutes}:${pad(Math.floor(trip.seconds % 60))}`],
    [f.top, `${trip.topKmh} ${ui.world.hud.speed}`],
    [f.bells, String(trip.bells)],
  ] as const;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#07070f]/70 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="finish-title" className="w-full max-w-[440px] rounded-[6px] bg-[#05050a] text-left ring-1 ring-white/15">
        <div className="p-7 pb-6">
          <h2 id="finish-title" className="text-3xl font-extrabold leading-tight tracking-[-0.02em] text-balance">{f.title}</h2>
          <h3 className="mt-5 text-sm font-semibold text-ink-300">{f.route}</h3>
          <ol className="mt-2.5 flex items-center">
            {visited.map((key, i) => (
              <li key={key} style={gateStyle(key)} className="flex flex-1 items-center last:flex-none">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--gate)] text-[11px] font-bold text-ink-950" title={ui.world.gates[key]}>
                  {GATES.find((g) => g.key === key)!.index + 1}
                  <span className="sr-only"> {ui.world.gates[key]}</span>
                </span>
                {i < visited.length - 1 && <span aria-hidden="true" className="h-[3px] flex-1 bg-[var(--gate)]" />}
              </li>
            ))}
          </ol>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            {stats.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-ink-300">{label}</dt>
                <dd className="font-mono text-2xl font-semibold tabular-nums tracking-[-0.03em]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div aria-hidden="true" className="mx-7 border-t-2 border-dashed border-white/15" />
        <div className="p-7 pt-6">
          <p className="mb-5 leading-relaxed text-ink-200">{fmt(f.body, { email: content.personal.email })}</p>
          <div className="flex flex-wrap gap-3">
            <button
              ref={first}
              type="button"
              className="min-h-[52px] rounded-full bg-lime px-6 font-bold text-ink-950"
              onClick={() => {
                worldStore.reset();
                resetRuntime(getRuntime(), worldStore.getState().tier);
              }}
            >
              {f.again}
            </button>
            <button type="button" className="min-h-[52px] rounded-full px-5 font-bold underline decoration-white/30 underline-offset-[6px] hover:decoration-white" onClick={() => worldStore.stayFree()}>
              {f.stay}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

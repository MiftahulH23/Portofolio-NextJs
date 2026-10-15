"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { getRuntime, resetRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";

export function FinishDialog() {
  const { ui, content } = useLanguage();
  const finished = useWorld((s) => s.finished);
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
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#07070f]/60 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="finish-title" className="max-w-[420px] rounded-[20px] border border-white/15 bg-[#0d0c1a]/95 p-7 text-center">
        <h2 id="finish-title" className="mb-2.5 text-3xl font-extrabold">{f.title}</h2>
        <p className="mb-5 leading-relaxed text-ink-200">{fmt(f.body, { email: content.personal.email })}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            ref={first}
            type="button"
            className="min-h-[52px] rounded-[14px] bg-lime px-6 font-bold text-ink-950"
            onClick={() => {
              worldStore.reset();
              resetRuntime(getRuntime(), worldStore.getState().tier);
            }}
          >
            {f.again}
          </button>
          <button type="button" className="min-h-[52px] rounded-[14px] border border-white/15 px-6 font-bold" onClick={() => worldStore.stayFree()}>
            {f.stay}
          </button>
        </div>
      </div>
    </div>
  );
}

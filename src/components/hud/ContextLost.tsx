"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { RINGKAS } from "@/lib/site";

export function ContextLost() {
  const h = useLanguage().ui.world.hud;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#07070f]/80 p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="ctx-title" aria-describedby="ctx-body" className="max-w-[440px] rounded-[20px] border border-white/15 bg-[#0d0c1a] p-7 text-center">
        <h2 id="ctx-title" className="mb-2 text-2xl font-extrabold">{h.stoppedTitle}</h2>
        <p id="ctx-body" className="mb-5 text-ink-200">{h.stoppedBody}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" autoFocus onClick={() => window.location.reload()} className="min-h-[52px] rounded-[14px] bg-lime px-6 font-bold text-ink-950">{h.reload}</button>
          <Link href={RINGKAS} className="inline-flex min-h-[52px] items-center rounded-[14px] border border-white/15 px-6 font-bold">{h.compact}</Link>
        </div>
      </div>
    </div>
  );
}

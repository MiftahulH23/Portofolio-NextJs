"use client";

import { useEffect } from "react";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";

/** Warnings look like the city's amber road signs. */
export function Toast() {
  const toast = useWorld((s) => s.toast);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => worldStore.clearToast(), 1700);
    return () => window.clearTimeout(t);
  }, [toast]);
  return (
    <div role="status" className="pointer-events-none fixed left-1/2 top-[120px] z-30 -translate-x-1/2 whitespace-nowrap">
      {toast && <span className="rounded-[4px] border-2 border-ink-950 bg-[#ffb020] px-3.5 py-2 text-sm font-bold text-ink-950 outline-2 outline-[#ffb020]">{toast}</span>}
    </div>
  );
}

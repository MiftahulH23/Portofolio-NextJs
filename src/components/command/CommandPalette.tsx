"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { OPEN_PALETTE_EVENT } from "@/lib/events";

// The cmdk dialog (and its Radix dependencies) loads only after the first open, keeping it out of the initial bundle.
const CommandPaletteDialog = dynamic(() => import("./CommandPaletteDialog"), { ssr: false });

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      }
    }
    function onOpen() {
      setLoaded(true);
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  return loaded ? <CommandPaletteDialog open={open} setOpen={setOpen} /> : null;
}

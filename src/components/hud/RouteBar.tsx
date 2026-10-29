"use client";

import { Fragment } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { GATES } from "@/world/gates";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";

export function RouteBar() {
  const { ui } = useLanguage();
  const visited = useWorld((s) => s.visited);
  return (
    <nav aria-label={ui.world.hud.route} className="pointer-events-auto flex max-w-full items-center overflow-x-auto rounded-full border border-white/15 bg-[#0d0c1a]/85 px-3.5 py-2 backdrop-blur [@media(pointer:coarse)]:px-2 [@media(pointer:coarse)]:py-0">
      {GATES.map((g, i) => {
        const done = visited.includes(g.key);
        const name = ui.world.gates[g.key];
        return (
          <Fragment key={g.key}>
            {i > 0 && <span aria-hidden="true" className="h-0.5 w-3 shrink-0 bg-white/15 sm:w-[18px] [@media(pointer:coarse)]:w-1.5" />}
            <button
              type="button"
              disabled={!done}
              onClick={() => worldStore.openCard(g.key)}
              aria-label={fmt(ui.world.hud.gate, { n: i + 1, name })}
              className={cn("flex min-h-11 items-center gap-1.5 whitespace-nowrap px-1.5 [@media(pointer:coarse)]:px-1 font-mono text-[11px] font-semibold uppercase tracking-[.06em]", done ? "text-ink-50" : "text-ink-300")}
            >
              <i aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full border-2", done ? "border-lime bg-lime shadow-[0_0_10px_#a3e635]" : "border-ink-300")} />
              <span className="hidden sm:inline [@media(pointer:coarse)]:hidden">{name}</span>
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
}

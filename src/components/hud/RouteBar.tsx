"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { GATES } from "@/world/gates";
import { worldStore } from "@/world/store";
import { useWorld } from "@/world/useWorld";
import { gateStyle } from "@/lib/gate-color";

/** The six gates drawn as a transit line: visited stops fill with their own neon, the next one is ringed. */
export function RouteBar() {
  const { ui } = useLanguage();
  const visited = useWorld((s) => s.visited);
  const next = useWorld((s) => s.nav?.key);
  return (
    <nav aria-label={ui.world.hud.route} className="pointer-events-auto relative max-w-full overflow-x-auto rounded-full bg-[#05050a]/85 px-4 py-1 [@media(pointer:coarse)]:px-2 [@media(pointer:coarse)]:py-0">
      <span aria-hidden="true" className="absolute inset-x-6 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/12 [@media(pointer:coarse)]:inset-x-3" />
      <ol className="relative flex items-center">
        {GATES.map((g, i) => {
          const done = visited.includes(g.key);
          const name = ui.world.gates[g.key];
          return (
            <li key={g.key} style={gateStyle(g.key)} className="relative flex items-center">
              {i > 0 && (
                <span aria-hidden="true" className={cn("h-[3px] w-4 shrink-0 sm:w-5 [@media(pointer:coarse)]:w-1.5", done ? "bg-[var(--gate)]" : "bg-transparent")} />
              )}
              <button
                type="button"
                disabled={!done}
                onClick={() => worldStore.openCard(g.key)}
                aria-label={fmt(ui.world.hud.gate, { n: i + 1, name })}
                className={cn(
                  "relative flex min-h-11 items-center gap-2 whitespace-nowrap px-1.5 text-[13px] font-semibold [@media(pointer:coarse)]:px-1",
                  done ? "text-ink-50 hover:text-[var(--gate)]" : next === g.key ? "text-ink-50" : "text-ink-300",
                )}
              >
                <i
                  aria-hidden="true"
                  className={cn(
                    "size-3 shrink-0 rounded-full border-[3px] bg-[#05050a]",
                    done ? "border-[var(--gate)] bg-[var(--gate)]" : next === g.key ? "border-[var(--gate)] outline-2 outline-offset-2 outline-[var(--gate)]/40" : "border-ink-500",
                  )}
                />
                <span className="hidden sm:inline [@media(pointer:coarse)]:hidden">{name}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

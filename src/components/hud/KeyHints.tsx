import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

/** Keyboard controls drawn as keycaps, grouped by action. */
export function KeyHints({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { ui } = useLanguage();
  const controls = compact ? ui.world.intro.controls.slice(0, -1) : ui.world.intro.controls;
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-300", compact ? "text-xs" : "text-sm", className)}>
      {controls.map((c) => (
        <li key={c.label} className="flex items-center gap-1.5">
          <span className="flex gap-1">
            {c.keys.map((k) => (
              <kbd
                key={k}
                className={cn(
                  "grid min-w-6 place-items-center rounded-[5px] border border-b-[3px] border-white/20 bg-white/[.04] px-1.5 font-display font-semibold leading-none text-ink-50",
                  compact ? "h-6 text-[11px]" : "h-7 text-xs",
                )}
              >
                {k}
              </kbd>
            ))}
          </span>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

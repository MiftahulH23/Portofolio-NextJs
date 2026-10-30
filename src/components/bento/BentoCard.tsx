import { gateStyle } from "@/lib/gate-color";
import { cn } from "@/lib/utils";
import type { GateKey } from "@/world/gates";

const COLS = {
  3: "bento:col-span-3",
  4: "bento:col-span-4",
  5: "bento:col-span-5",
  6: "bento:col-span-6",
  7: "bento:col-span-7",
  8: "bento:col-span-8",
  12: "bento:col-span-12",
} as const;

const ROWS = {
  1: "bento:row-span-1",
  2: "bento:row-span-2",
  3: "bento:row-span-3",
  4: "bento:row-span-4",
} as const;

export type BentoCols = keyof typeof COLS;
export type BentoRows = keyof typeof ROWS;

export function bentoSpan(cols: BentoCols, rows: BentoRows): string {
  return `${COLS[cols]} ${ROWS[rows]}`;
}

interface BentoCardProps {
  cols: BentoCols;
  rows: BentoRows;
  /** Which city gate this card belongs to: its neon colours the label and accents, as in the 3D city. */
  gate?: GateKey;
  id?: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function BentoCard({ cols, rows, gate, id, className, children, ...rest }: BentoCardProps) {
  return (
    <section
      id={id}
      aria-label={rest["aria-label"]}
      style={gate ? gateStyle(gate) : undefined}
      className={cn("relative min-h-[220px] scroll-mt-24 overflow-hidden rounded-xl bg-ink-850 p-7 bento:min-h-0", bentoSpan(cols, rows), className)}
    >
      {children}
    </section>
  );
}

/** The small heading that names a card, in its gate colour. */
export function CardLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("text-sm font-semibold text-[var(--gate,#a1a1aa)]", className)}>{children}</span>;
}

import { Fragment } from "react";
import type { ArchNode } from "@/content";
import { cn } from "@/lib/utils";

export function ArchitectureDiagram({ nodes }: { nodes: ArchNode[] }) {
  const middle = Math.floor((nodes.length - 1) / 2);
  return (
    <div className="flex flex-col items-stretch bento:flex-row bento:items-center">
      {nodes.map((n, i) => (
        <Fragment key={n.label + n.title}>
          {i > 0 && (
            <div
              aria-hidden="true"
              className="mx-auto h-10 w-0.5 animate-flow bg-[linear-gradient(180deg,#A3E635_50%,transparent_50%)] bg-[length:2px_12px] bento:mx-0 bento:h-0.5 bento:w-[90px] bento:shrink-0 bento:bg-[linear-gradient(90deg,#A3E635_50%,transparent_50%)] bento:bg-[length:12px_2px]"
            />
          )}
          <div className={cn("flex min-w-0 flex-1 flex-col gap-2 rounded-[18px] border bg-ink-800 p-6", i === middle ? "border-lime" : "border-ink-500")}>
            <span className="font-mono text-xs text-ink-300">{n.label}</span>
            <span className="text-[22px] font-extrabold">{n.title}</span>
            <span className="text-sm text-ink-300">{n.detail}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

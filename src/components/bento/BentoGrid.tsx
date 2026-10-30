import { cn } from "@/lib/utils";

/** `fit` drops the fixed 150px row track, so a row is exactly as tall as its tallest card. */
export function BentoGrid({ fit = false, children }: { fit?: boolean; children: React.ReactNode }) {
  return <div className={cn("grid grid-cols-1 gap-4 bento:grid-cols-12", !fit && "bento:auto-rows-[150px]")}>{children}</div>;
}

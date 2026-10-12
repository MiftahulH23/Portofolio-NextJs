export function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex h-[30px] shrink-0 items-center gap-1.5 border-b border-ink-500/60 px-3">
      <span className="size-[9px] rounded-full bg-ink-500" />
      <span className="size-[9px] rounded-full bg-ink-500" />
      <span className="size-[9px] rounded-full bg-ink-500" />
      {url && <span className="ml-2.5 font-mono text-[11px] text-ink-300">{url}</span>}
    </div>
  );
}

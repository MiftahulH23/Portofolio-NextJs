export function BentoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 bento:auto-rows-[150px] bento:grid-cols-12">{children}</div>;
}

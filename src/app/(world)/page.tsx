import Link from "next/link";
import { getContent, getUi } from "@/content";
import { RINGKAS } from "@/lib/site";

export default function Home() {
  const c = getContent("en");
  const w = getUi("en").world.intro;
  return (
    <main className="mx-auto flex min-h-dvh max-w-[720px] flex-col justify-center gap-6 px-4">
      <h1 className="text-5xl font-extrabold">
        {w.titleLead} <span className="text-lime">{c.personal.name}</span>
      </h1>
      <p className="text-lg text-ink-300">{w.summary}</p>
      <Link href={RINGKAS} className="text-lime underline">{w.compact}</Link>
    </main>
  );
}

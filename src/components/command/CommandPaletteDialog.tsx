"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";

const GROUP =
  "py-1.5 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[.08em] [&_[cmdk-group-heading]]:text-ink-300";

function Item({ icon, children, onSelect }: { icon: string; children: string; onSelect: () => void }) {
  return (
    <Command.Item
      value={children}
      onSelect={onSelect}
      className="flex min-h-12 cursor-pointer items-center gap-3.5 rounded-xl px-3 text-base font-semibold data-[selected=true]:bg-ink-800"
    >
      <span aria-hidden="true" className="flex size-[30px] items-center justify-center rounded-[9px] border border-ink-600 bg-ink-800 font-mono text-[13px] text-ink-200">
        {icon}
      </span>
      {children}
    </Command.Item>
  );
}

export default function CommandPaletteDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [toast, setToast] = useState<string | null>(null);
  const { content, ui, toggleLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const p = ui.palette;
  const personal = content.personal;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(t);
  }, [toast]);

  function run(fn: () => void) {
    setOpen(false);
    fn();
  }

  function goSection(id: string) {
    if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else router.push(`/#${id}`);
  }

  function copyEmail() {
    navigator.clipboard
      ?.writeText(personal.email)
      .then(() => setToast(p.copied))
      .catch(() => setToast(personal.email));
  }

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={p.label}
        overlayClassName="fixed inset-0 z-[90] bg-ink-950/60 backdrop-blur-sm"
        contentClassName="theme-d fixed left-1/2 top-[12vh] z-[100] w-[calc(100%-32px)] max-w-[640px] -translate-x-1/2 overflow-hidden rounded-[20px] border border-ink-600 bg-ink-850 font-display text-ink-50 shadow-[0_40px_120px_rgba(0,0,0,.7)]"
      >
        <div className="flex items-center gap-3 border-b border-ink-700 px-5 py-4">
          <Search className="size-5 text-ink-300" aria-hidden="true" />
          <Command.Input placeholder={p.placeholder} className="min-h-8 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-ink-400 focus-visible:outline-none" />
          <kbd className="rounded-md border border-ink-500 px-2 py-0.5 font-mono text-xs text-ink-300">ESC</kbd>
        </div>
        <Command.List data-lenis-prevent className="max-h-[460px] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-10 text-center text-[15px] text-ink-300">{p.empty}</Command.Empty>
          <Command.Group heading={p.groups.navigation} className={GROUP}>
            <Item icon="#" onSelect={() => run(() => goSection("work"))}>{p.goWork}</Item>
            <Item icon="#" onSelect={() => run(() => goSection("services"))}>{p.goServices}</Item>
            <Item icon="#" onSelect={() => run(() => goSection("about"))}>{p.goExperience}</Item>
            <Item icon="#" onSelect={() => run(() => goSection("contact"))}>{p.goContact}</Item>
          </Command.Group>
          <Command.Group heading={p.groups.projects} className={GROUP}>
            {content.projects.map((proj) => (
              <Item key={proj.slug} icon="›" onSelect={() => run(() => router.push(`/projects/${proj.slug}`))}>
                {fmt(p.caseStudy, { title: proj.title })}
              </Item>
            ))}
            {content.templates.map((t) => (
              <Item key={t.link} icon="◇" onSelect={() => run(() => router.push(t.link))}>
                {fmt(p.template, { name: t.title })}
              </Item>
            ))}
          </Command.Group>
          <Command.Group heading={p.groups.actions} className={GROUP}>
            <Item icon="@" onSelect={() => run(copyEmail)}>{p.copyEmail}</Item>
            {personal.cvUrl && (
              <Item icon="↓" onSelect={() => run(() => window.open(personal.cvUrl, "_blank", "noopener"))}>{p.downloadCv}</Item>
            )}
            <Item icon="A" onSelect={() => run(toggleLanguage)}>{p.switchLang}</Item>
            <Item icon="↗" onSelect={() => run(() => window.open(personal.socials.github, "_blank", "noopener"))}>{p.openGithub}</Item>
            <Item icon="↗" onSelect={() => run(() => window.open(personal.socials.linkedin, "_blank", "noopener"))}>{p.openLinkedin}</Item>
          </Command.Group>
        </Command.List>
        <div className="border-t border-ink-700 px-5 py-3 font-mono text-xs text-ink-300">{p.hint}</div>
      </Command.Dialog>
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-xl border border-ink-600 bg-ink-850 px-4 py-3 font-mono text-sm text-ink-50">
          {toast}
        </div>
      )}
    </>
  );
}

"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { sendContact } from "@/app/actions/contact";
import { useLanguage } from "@/context/LanguageContext";
import type { ContactErrorCode } from "@/lib/contact-schema";
import { TOPICS, type Topic } from "@/lib/contact-topics";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "success"; name: string; email: string } | { kind: "error"; code: ContactErrorCode };

const field =
  "min-h-[50px] rounded-xl border bg-ink-900 px-4 font-display text-base text-ink-50 placeholder:text-ink-400 outline-none focus-visible:border-lime";

export function ContactForm() {
  const { ui } = useLanguage();
  const f = ui.contact.form;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState<Topic>("freelance");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const inFlight = useRef(false);

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setTopic("freelance");
    setCompany("");
    setStatus({ kind: "idle" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    const payload = { name, email, topic, message, company };
    // Loaded on first submit so zod stays out of the initial page bundle.
    let validateContact: typeof import("@/lib/contact-schema").validateContact;
    try {
      ({ validateContact } = await import("@/lib/contact-schema"));
    } catch {
      inFlight.current = false;
      setStatus({ kind: "error", code: "send_failed" });
      return;
    }
    const local = validateContact(payload);
    if (!local.ok) {
      inFlight.current = false;
      setStatus({ kind: "error", code: local.error });
      return;
    }
    startTransition(async () => {
      try {
        const res = await sendContact(payload);
        setStatus(res.ok ? { kind: "success", name: local.data.name, email: local.data.email } : { kind: "error", code: res.error });
      } catch {
        setStatus({ kind: "error", code: "send_failed" });
      } finally {
        inFlight.current = false;
      }
    });
  }

  if (status.kind === "success") {
    return (
      <div role="status" className="flex flex-1 flex-col items-start justify-center gap-4">
        <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-lime text-ink-950">
          <Check className="size-[30px]" strokeWidth={2.6} />
        </span>
        <span className="text-[34px] font-extrabold tracking-[-0.03em]">{fmt(f.successTitle, { name: status.name.split(" ")[0] })}</span>
        <span className="max-w-[440px] text-[17px] leading-normal text-ink-300">{fmt(f.successBody, { email: status.email })}</span>
        <button type="button" onClick={reset} className="min-h-11 rounded-xl border border-ink-500 px-[18px] text-sm font-semibold">
          {f.again}
        </button>
      </div>
    );
  }

  const err = status.kind === "error" ? status.code : null;

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex h-full flex-col gap-4">
      <div className="flex flex-wrap gap-3.5">
        <label className="flex min-w-[200px] flex-1 flex-col gap-2 font-mono text-xs text-ink-200">
          {f.name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={f.namePh}
            autoComplete="name"
            aria-invalid={err === "name_invalid"}
            className={cn(field, err === "name_invalid" ? "border-danger" : "border-ink-600")}
          />
        </label>
        <label className="flex min-w-[200px] flex-1 flex-col gap-2 font-mono text-xs text-ink-200">
          {f.email}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={f.emailPh}
            autoComplete="email"
            aria-invalid={err === "email_invalid"}
            className={cn(field, err === "email_invalid" ? "border-danger" : "border-ink-600")}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-mono text-xs text-ink-200">{f.topicLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                topic === t ? "border-lime bg-lime text-ink-950" : "border-ink-500 text-ink-200 hover:border-ink-300",
              )}
            >
              {f.topics[t]}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-1 flex-col gap-2 font-mono text-xs text-ink-200">
        {f.message}
        <textarea
          data-lenis-prevent
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={f.messagePh}
          aria-invalid={err === "message_invalid"}
          className={cn(field, "min-h-[140px] flex-1 resize-y py-3.5 leading-normal", err === "message_invalid" ? "border-danger" : "border-ink-600")}
        />
      </label>

      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          {f.honeypot}
          <input name="hp_trap" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      {err && (
        <p role="alert" className="font-mono text-[13px] text-danger">
          {f.errors[err]}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-ink-300">{f.privacy}</span>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[52px] items-center gap-2.5 rounded-[14px] bg-lime px-[26px] text-base font-bold text-ink-950 disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="size-[18px] animate-spin" aria-hidden="true" />
              {f.sending}
            </>
          ) : (
            <>
              {f.send}
              <Send className="size-[18px]" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

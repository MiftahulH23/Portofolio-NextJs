import { validateContact, type ContactInput, type ContactResult, type Topic } from "./contact-schema";
import type { RateLimiter } from "./rate-limit";

export interface OutgoingEmail {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export interface ContactDeps {
  ip: string;
  limiter: RateLimiter;
  send: ((mail: OutgoingEmail) => Promise<void>) | null;
  toEmail: string;
}

const TOPIC_LABELS: Record<Topic, string> = {
  freelance: "Freelance project",
  fulltime: "Full-time role",
  collaboration: "Collaboration",
  hi: "Just saying hi",
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function buildEmail(data: ContactInput, to: string): OutgoingEmail {
  const topic = TOPIC_LABELS[data.topic];
  const text = `Name: ${data.name}\nEmail: ${data.email}\nTopic: ${topic}\n\n${data.message}`;
  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.5">
<p><strong>Name:</strong> ${escapeHtml(data.name)}<br><strong>Email:</strong> ${escapeHtml(data.email)}<br><strong>Topic:</strong> ${escapeHtml(topic)}</p>
<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
</div>`;
  return { to, replyTo: oneLine(data.email), subject: oneLine(`[Portfolio] ${topic} — ${data.name}`), text, html };
}

export async function handleContact(input: unknown, deps: ContactDeps): Promise<ContactResult> {
  const valid = validateContact(input);
  if (!valid.ok) return valid;
  if (valid.data.company && valid.data.company.trim() !== "") return { ok: true };
  if (!deps.limiter.check(deps.ip)) return { ok: false, error: "rate_limited" };
  if (!deps.send) return { ok: false, error: "not_configured" };
  try {
    await deps.send(buildEmail(valid.data, deps.toEmail));
    return { ok: true };
  } catch (error) {
    console.error("[contact] send failed", error);
    return { ok: false, error: "send_failed" };
  }
}

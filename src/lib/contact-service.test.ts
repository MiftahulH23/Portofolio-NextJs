// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { buildEmail, escapeHtml, handleContact } from "./contact-service";
import { createRateLimiter } from "./rate-limit";

const good = { name: "Ana Putri", email: "ana@example.com", topic: "freelance", message: "I need a dashboard built.", company: "" };
const deps = (over: Partial<Parameters<typeof handleContact>[1]> = {}) => ({
  ip: "1.1.1.1",
  limiter: createRateLimiter({ limit: 3, windowMs: 60_000 }),
  send: vi.fn().mockResolvedValue(undefined),
  toEmail: "owner@example.com",
  ...over,
});

describe("handleContact", () => {
  it("sends a valid message to the owner with reply-to set", async () => {
    const d = deps();
    expect(await handleContact(good, d)).toEqual({ ok: true });
    expect(d.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: "owner@example.com", replyTo: "ana@example.com", subject: "[Portfolio] Freelance project — Ana Putri" }),
    );
  });

  it("returns validation errors without sending", async () => {
    const d = deps();
    expect(await handleContact({ ...good, email: "x" }, d)).toEqual({ ok: false, error: "email_invalid" });
    expect(d.send).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const d = deps();
    expect(await handleContact({ ...good, company: "Spam Inc" }, d)).toEqual({ ok: true });
    expect(d.send).not.toHaveBeenCalled();
  });

  it("rate limits per ip", async () => {
    const d = deps({ limiter: createRateLimiter({ limit: 1, windowMs: 60_000 }) });
    await handleContact(good, d);
    expect(await handleContact(good, d)).toEqual({ ok: false, error: "rate_limited" });
  });

  it("reports not_configured when no sender exists", async () => {
    expect(await handleContact(good, deps({ send: null }))).toEqual({ ok: false, error: "not_configured" });
  });

  it("reports send_failed when the provider throws", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const d = deps({ send: vi.fn().mockRejectedValue(new Error("boom")) });
    expect(await handleContact(good, d)).toEqual({ ok: false, error: "send_failed" });
    spy.mockRestore();
  });
});

describe("buildEmail", () => {
  it("keeps the subject on one line and escapes html", () => {
    const mail = buildEmail(
      { name: "Eve\r\nBcc: x@y.z", email: "eve@example.com", topic: "hi", message: "<script>alert(1)</script> & more", company: "" },
      "owner@example.com",
    );
    expect(mail.subject).not.toMatch(/[\r\n]/);
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;");
    expect(mail.text).toContain("<script>alert(1)</script>");
  });

  it("escapeHtml covers the five special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});

// @vitest-environment node
import { describe, expect, it } from "vitest";
import { validateContact } from "./contact-schema";

const good = { name: "Ana Putri", email: "ana@example.com", topic: "freelance", message: "I need a dashboard built.", company: "" };

describe("validateContact", () => {
  it("accepts and trims a valid payload", () => {
    const r = validateContact({ ...good, name: "  Ana Putri  " });
    expect(r).toEqual({ ok: true, data: { ...good, name: "Ana Putri" } });
  });

  it.each([
    [{ name: "A" }, "name_invalid"],
    [{ email: "nope" }, "email_invalid"],
    [{ topic: "spam" }, "topic_invalid"],
    [{ message: "short" }, "message_invalid"],
    [{ message: "x".repeat(2001) }, "message_invalid"],
  ])("rejects %o with %s", (patch, code) => {
    expect(validateContact({ ...good, ...patch })).toEqual({ ok: false, error: code });
  });

  it("reports the first invalid field in form order", () => {
    expect(validateContact({ ...good, name: "", email: "bad" })).toEqual({ ok: false, error: "name_invalid" });
  });
});

// zod/mini: same validation, tree-shakable — this schema also ships to the browser for instant form feedback.
import * as z from "zod/mini";

import { TOPICS } from "./contact-topics";

export { TOPICS, type Topic } from "./contact-topics";

export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2), z.maxLength(80)),
  email: z.pipe(z.string().check(z.trim(), z.maxLength(200)), z.email()),
  topic: z.enum(TOPICS),
  message: z.string().check(z.trim(), z.minLength(10), z.maxLength(2000)),
  company: z.optional(z.string().check(z.maxLength(200))),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactErrorCode =
  | "name_invalid"
  | "email_invalid"
  | "topic_invalid"
  | "message_invalid"
  | "rate_limited"
  | "send_failed"
  | "not_configured";

export type ContactResult = { ok: true } | { ok: false; error: ContactErrorCode };

const FIELD_ORDER = ["name", "email", "topic", "message"] as const;
const FIELD_ERROR: Record<(typeof FIELD_ORDER)[number], ContactErrorCode> = {
  name: "name_invalid",
  email: "email_invalid",
  topic: "topic_invalid",
  message: "message_invalid",
};

export function validateContact(
  input: unknown,
): { ok: true; data: ContactInput } | { ok: false; error: ContactErrorCode } {
  const result = contactSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const bad = new Set(result.error.issues.map((i) => String(i.path[0])));
  const field = FIELD_ORDER.find((f) => bad.has(f)) ?? "message";
  return { ok: false, error: FIELD_ERROR[field] };
}

import { z } from "zod";

export const TOPICS = ["freelance", "fulltime", "collaboration", "hi"] as const;
export type Topic = (typeof TOPICS)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().max(200).pipe(z.email()),
  topic: z.enum(TOPICS),
  message: z.string().trim().min(10).max(2000),
  company: z.string().max(200).optional(),
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

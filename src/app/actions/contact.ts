"use server";

import { headers } from "next/headers";
import type { ContactResult } from "@/lib/contact-schema";
import { handleContact } from "@/lib/contact-service";
import { createRateLimiter } from "@/lib/rate-limit";
import { createResendSender } from "@/lib/resend-sender";

const limiter = createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });

export async function sendContact(input: unknown): Promise<ContactResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const dryRun = process.env.CONTACT_DRY_RUN === "1";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && !dryRun) console.error("[contact] RESEND_API_KEY is not set");
  const send = dryRun ? async () => {} : apiKey ? createResendSender(apiKey) : null;
  return handleContact(input, {
    ip,
    limiter,
    send,
    toEmail: process.env.CONTACT_TO_EMAIL || "miftahulh942@gmail.com",
  });
}

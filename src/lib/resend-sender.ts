import { Resend } from "resend";
import type { OutgoingEmail } from "./contact-service";

export function createResendSender(apiKey: string) {
  const resend = new Resend(apiKey);
  return async (mail: OutgoingEmail) => {
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  };
}

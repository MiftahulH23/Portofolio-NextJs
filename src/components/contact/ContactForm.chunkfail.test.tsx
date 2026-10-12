import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

const sendContact = vi.fn();
vi.mock("@/app/actions/contact", () => ({ sendContact: (...args: unknown[]) => sendContact(...args) }));
// Simulates the lazily imported validator chunk failing to load (offline, or a stale tab after a redeploy).
vi.mock("@/lib/contact-schema", () => {
  throw new Error("Failed to fetch dynamically imported module");
});

import { ContactForm } from "./ContactForm";

describe("ContactForm when the validator chunk cannot load", () => {
  it("shows an error and stays usable instead of silently locking up", async () => {
    renderWithLanguage(<ContactForm />);
    await userEvent.type(screen.getByLabelText("Name"), "Ana Putri");
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Message"), "I need a dashboard built.");
    const button = screen.getByRole("button", { name: /send message/i });

    await userEvent.click(button);
    expect(await screen.findByRole("alert")).toHaveTextContent("Please email me directly");

    // A second attempt must run again (guard released), not return early.
    await userEvent.type(screen.getByLabelText("Message"), "!");
    expect(screen.queryByRole("alert")).toBeInTheDocument();
    await userEvent.click(button);
    expect(await screen.findByRole("alert")).toHaveTextContent("Please email me directly");
    expect(sendContact).not.toHaveBeenCalled();
  });
});

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

const sendContact = vi.fn();
vi.mock("@/app/actions/contact", () => ({ sendContact: (...args: unknown[]) => sendContact(...args) }));

import { ContactForm } from "./ContactForm";

async function fill() {
  await userEvent.type(screen.getByLabelText("Name"), "Ana Putri");
  await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
  await userEvent.type(screen.getByLabelText("Message"), "I need a dashboard built.");
}

beforeEach(() => {
  sendContact.mockReset();
});

describe("ContactForm", () => {
  it("submits and shows the success state", async () => {
    sendContact.mockResolvedValue({ ok: true });
    renderWithLanguage(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: "Full-time role" }));
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText("Message sent, Ana.")).toBeInTheDocument();
    expect(sendContact).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Ana Putri", email: "ana@example.com", topic: "fulltime", company: "" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Send another" }));
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("validates on the client without calling the action", async () => {
    renderWithLanguage(<ContactForm />);
    await userEvent.type(screen.getByLabelText("Name"), "Ana");
    await userEvent.type(screen.getByLabelText("Email"), "not-an-email");
    await userEvent.type(screen.getByLabelText("Message"), "long enough message");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter a valid email address.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("shows server errors", async () => {
    sendContact.mockResolvedValue({ ok: false, error: "rate_limited" });
    renderWithLanguage(<ContactForm />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many messages");
  });

  it("calls the action exactly once on a double click", async () => {
    let resolve: (v: unknown) => void = () => {};
    sendContact.mockImplementation(() => new Promise((r) => (resolve = r)));
    renderWithLanguage(<ContactForm />);
    await fill();
    const button = screen.getByRole("button", { name: /send message/i });
    await userEvent.dblClick(button);
    expect(sendContact).toHaveBeenCalledTimes(1);
    resolve({ ok: true });
    await waitFor(() => expect(screen.getByText("Message sent, Ana.")).toBeInTheDocument());
  });
});

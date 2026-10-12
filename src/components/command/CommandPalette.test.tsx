import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { openCommandPalette } from "@/lib/events";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }), usePathname: () => "/projects/lps" }));

import { CommandPalette } from "./CommandPalette";

describe("CommandPalette", () => {
  it("opens with Ctrl+K and closes with Escape", async () => {
    renderWithLanguage(<CommandPalette />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Go to Work")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens from the custom event and filters by typing", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    await userEvent.type(await screen.findByPlaceholderText("Type a command or search…"), "linkedin");
    expect(screen.getByText("Open LinkedIn profile")).toBeInTheDocument();
    expect(screen.queryByText("Go to Work")).not.toBeInTheDocument();
  });

  it("navigates to a section from another page via the router", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    await userEvent.click(await screen.findByText("Go to Contact"));
    expect(push).toHaveBeenCalledWith("/#contact");
  });

  it("lists case studies and templates", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    expect(await screen.findByText("Case study: Waste Management Institution System")).toBeInTheDocument();
    expect(screen.getByText("Template: Mabro Coffee")).toBeInTheDocument();
    expect(screen.queryByText("Download CV (PDF)")).not.toBeInTheDocument();
  });

  it("switches language", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    await userEvent.click(await screen.findByText("Switch language: English / Indonesia"));
    act(() => openCommandPalette());
    expect(await screen.findByText("Ke bagian Karya")).toBeInTheDocument();
  });
});

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { OPEN_PALETTE_EVENT } from "@/lib/events";
import { Header } from "./Header";

describe("Header", () => {
  it("renders primary nav links pointing at home anchors", () => {
    renderWithLanguage(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav.querySelector('a[href="/ringkas#work"]')).toHaveTextContent("Work");
    expect(nav.querySelector('a[href="/ringkas#contact"]')).toHaveTextContent("Contact");
  });

  it("switches language", async () => {
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getAllByRole("button", { name: "Switch language to Indonesian" })[0]);
    expect(screen.getByRole("navigation", { name: "Utama" })).toHaveTextContent("Karya");
  });

  it("search button dispatches the open-palette event", async () => {
    const spy = vi.fn();
    window.addEventListener(OPEN_PALETTE_EVENT, spy);
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getAllByRole("button", { name: /search/i })[0]);
    expect(spy).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_PALETTE_EVENT, spy);
  });

  it("hides the resume link when no CV is configured", () => {
    renderWithLanguage(<Header />);
    expect(screen.queryByRole("link", { name: /resume/i })).not.toBeInTheDocument();
  });

  it("toggles the mobile menu", async () => {
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});

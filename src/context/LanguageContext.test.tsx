import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider, useLanguage } from "./LanguageContext";

function Probe() {
  const { lang, ui, content, toggleLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="nav">{ui.nav.work}</span>
      <span data-testid="degree">{content.education.degree}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  );
}

afterEach(() => vi.restoreAllMocks());

describe("LanguageProvider", () => {
  it("defaults to English", () => {
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("nav")).toHaveTextContent("Work");
  });

  it("toggles to Indonesian, persists, and sets <html lang>", async () => {
    render(<LanguageProvider><Probe /></LanguageProvider>);
    await userEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("nav")).toHaveTextContent("Karya");
    expect(screen.getByTestId("degree")).toHaveTextContent("Sarjana Terapan Sistem Informasi");
    expect(window.localStorage.getItem("portfolio-lang")).toBe("id");
    expect(document.documentElement.lang).toBe("id");
  });

  it("reads a stored language", () => {
    window.localStorage.setItem("portfolio-lang", "id");
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("id");
  });

  it("still toggles when localStorage throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "toggle" }));
    });
    expect(screen.getByTestId("lang")).toHaveTextContent("id");
    await userEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });
});

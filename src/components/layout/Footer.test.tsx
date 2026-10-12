import { act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import { Footer } from "./Footer";

afterEach(() => vi.useRealTimers());

describe("Footer", () => {
  it("hydrates without a mismatch when the year changed since the static build", async () => {
    const tree = (
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    );
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-12-31T12:00:00Z"));
    const html = renderToString(tree);
    vi.setSystemTime(new Date("2027-01-02T12:00:00Z"));

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const errors: unknown[] = [];
    await act(async () => {
      hydrateRoot(container, tree, { onRecoverableError: (e) => errors.push(e) });
    });
    expect(errors).toEqual([]);
    container.remove();
  });
});

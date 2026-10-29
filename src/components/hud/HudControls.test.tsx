import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { HudControls } from "./HudControls";

describe("HudControls", () => {
  it("folds sound, language and compact links behind the touch menu", async () => {
    renderWithLanguage(<HudControls />);
    const menu = screen.getByRole("button", { name: "More options" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("button", { name: "Mute sound" })).toHaveLength(1);
    await userEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("button", { name: "Mute sound" })).toHaveLength(2);
  });
});

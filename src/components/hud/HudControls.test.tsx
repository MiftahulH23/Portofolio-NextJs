import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";
import { HudControls } from "./HudControls";

beforeEach(() => {
  if (worldStore.getState().muted) worldStore.toggleMute();
});

describe("HudControls", () => {
  it("opens the touch menu with sound, language and compact options", async () => {
    renderWithLanguage(<HudControls />);
    const menu = screen.getByRole("button", { name: "More options" });
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    await userEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");

    const sound = screen.getByRole("switch", { name: "Sound" });
    expect(sound).toHaveAttribute("aria-checked", "true");
    await userEvent.click(sound);
    expect(worldStore.getState().muted).toBe(true);

    await userEvent.click(screen.getByRole("button", { name: "id" }));
    expect(screen.getByRole("switch", { name: "Suara" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Versi ringkas" })).toHaveLength(2);
  });

  it("closes when tapping outside", async () => {
    renderWithLanguage(<HudControls />);
    await userEvent.click(screen.getByRole("button", { name: "More options" }));
    await userEvent.click(document.body);
    expect(screen.getByRole("button", { name: "More options" })).toHaveAttribute("aria-expanded", "false");
  });
});

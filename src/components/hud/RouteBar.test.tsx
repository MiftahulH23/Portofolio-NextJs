import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";
import { RouteBar } from "./RouteBar";

beforeEach(() => {
  worldStore.reset();
  worldStore.closeCard();
  worldStore.setPhase("running");
});

describe("RouteBar", () => {
  it("locks gates until visited, then reopens their card", async () => {
    renderWithLanguage(<RouteBar />);
    const skills = screen.getByRole("button", { name: "Gate 2: Skills" });
    expect(skills).toBeDisabled();
    act(() => {
      worldStore.enterGate("skills");
      worldStore.closeCard();
    });
    expect(skills).toBeEnabled();
    await userEvent.click(skills);
    expect(worldStore.getState().card).toBe("skills");
  });
});

import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { GATE_KEYS } from "@/world/gates";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";
import { FinishDialog } from "./FinishDialog";

beforeEach(() => {
  worldStore.reset();
  worldStore.setPhase("running");
});

const finish = () => act(() => GATE_KEYS.forEach((k) => worldStore.enterGate(k)));

describe("FinishDialog", () => {
  it("appears after the last gate; Start over resets progress", async () => {
    renderWithLanguage(<FinishDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    finish();
    expect(screen.getByRole("dialog", { name: "Exploration complete" })).toHaveTextContent("miftahulh942@gmail.com");
    expect(screen.getByRole("button", { name: "Start over" })).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: "Start over" }));
    expect(worldStore.getState().visited).toEqual([]);
  });
  it("Keep exploring closes it for good", async () => {
    renderWithLanguage(<FinishDialog />);
    finish();
    await userEvent.click(screen.getByRole("button", { name: "Keep exploring" }));
    expect(worldStore.getState()).toMatchObject({ finished: false, freeRide: true });
  });
});

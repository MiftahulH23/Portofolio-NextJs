import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { GATE_KEYS } from "@/world/gates";
import { renderWithLanguage } from "@/test/render";
import { getRuntime } from "@/world/runtime";
import { worldStore } from "@/world/store";
import { FinishDialog } from "./FinishDialog";

beforeEach(() => {
  worldStore.reset();
  worldStore.setPhase("running");
});

const finish = () => act(() => GATE_KEYS.forEach((k) => worldStore.enterGate(k)));

describe("FinishDialog", () => {
  it("appears after the last gate; Ride again resets progress", async () => {
    renderWithLanguage(<FinishDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    finish();
    expect(screen.getByRole("dialog", { name: "All six gates visited" })).toHaveTextContent("miftahulh942@gmail.com");
    expect(screen.getByRole("button", { name: "Ride again" })).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: "Ride again" }));
    expect(worldStore.getState().visited).toEqual([]);
  });
  it("shows the route in visiting order and the trip log", () => {
    const rt = getRuntime();
    rt.trip = { meters: 1234, seconds: 125, topKmh: 31, bells: 4 };
    renderWithLanguage(<FinishDialog />);
    finish();
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["1 Profile", "2 Skills", "3 Experience", "4 Projects", "5 Education", "6 Contact"]);
    expect(dialog).toHaveTextContent("1.23 km");
    expect(dialog).toHaveTextContent("2:05");
    expect(dialog).toHaveTextContent("31 km/h");
  });
  it("Keep riding closes it for good", async () => {
    renderWithLanguage(<FinishDialog />);
    finish();
    await userEvent.click(screen.getByRole("button", { name: "Keep riding" }));
    expect(worldStore.getState()).toMatchObject({ finished: false, freeRide: true });
  });
});

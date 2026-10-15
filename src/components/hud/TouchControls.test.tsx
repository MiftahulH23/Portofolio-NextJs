import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { getRuntime } from "@/world/runtime";
import { TouchControls } from "./TouchControls";

describe("TouchControls", () => {
  it("holds an input while pressed and releases it on lift or cancel", () => {
    renderWithLanguage(<TouchControls />);
    const gas = screen.getByRole("button", { name: "Ride" });
    fireEvent.pointerDown(gas, { pointerId: 1 });
    expect(getRuntime().input.gas).toBe(true);
    fireEvent.pointerUp(gas, { pointerId: 1 });
    expect(getRuntime().input.gas).toBe(false);
    const left = screen.getByRole("button", { name: "Steer left" });
    fireEvent.pointerDown(left, { pointerId: 2 });
    fireEvent.pointerCancel(left, { pointerId: 2 });
    expect(getRuntime().input.left).toBe(false);
  });
});

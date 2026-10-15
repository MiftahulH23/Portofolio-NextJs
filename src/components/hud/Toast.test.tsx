import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { worldStore } from "@/world/store";
import { Toast } from "./Toast";

afterEach(() => vi.useRealTimers());

describe("Toast", () => {
  it("shows a message and clears it", () => {
    vi.useFakeTimers();
    render(<Toast />);
    act(() => worldStore.toast("Pedestrians have priority", 10_000_000));
    expect(screen.getByRole("status")).toHaveTextContent("Pedestrians have priority");
    act(() => vi.advanceTimersByTime(1800));
    expect(worldStore.getState().toast).toBeNull();
  });
});

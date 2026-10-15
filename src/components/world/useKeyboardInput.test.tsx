import { act, fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardInput } from "./useKeyboardInput";

const fresh = () => ({ gas: false, brake: false, left: false, right: false, boost: false });

describe("useKeyboardInput", () => {
  it("maps WASD, arrows and Shift", () => {
    const input = fresh();
    renderHook(() => useKeyboardInput(input, { onBell: vi.fn(), onEscape: vi.fn() }, true));
    fireEvent.keyDown(window, { code: "KeyW" });
    fireEvent.keyDown(window, { code: "ArrowLeft" });
    fireEvent.keyDown(window, { code: "ShiftLeft" });
    expect(input).toEqual({ gas: true, brake: false, left: true, right: false, boost: true });
    fireEvent.keyUp(window, { code: "KeyW" });
    expect(input.gas).toBe(false);
  });

  it("releases everything on blur and when the tab is hidden", () => {
    const input = fresh();
    renderHook(() => useKeyboardInput(input, { onBell: vi.fn(), onEscape: vi.fn() }, true));
    fireEvent.keyDown(window, { code: "KeyW" });
    act(() => {
      window.dispatchEvent(new Event("blur"));
    });
    expect(input.gas).toBe(false);
    fireEvent.keyDown(window, { code: "KeyD" });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(input.right).toBe(false);
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
  });

  it("Space rings the bell, Escape closes, and nothing happens when disabled", () => {
    const input = fresh();
    const onBell = vi.fn(), onEscape = vi.fn();
    const { rerender } = renderHook(({ on }) => useKeyboardInput(input, { onBell, onEscape }, on), { initialProps: { on: true } });
    fireEvent.keyDown(window, { code: "Space" });
    fireEvent.keyDown(window, { code: "Escape" });
    expect(onBell).toHaveBeenCalledOnce();
    expect(onEscape).toHaveBeenCalledOnce();
    rerender({ on: false });
    fireEvent.keyDown(window, { code: "KeyW" });
    expect(input.gas).toBe(false);
  });
});

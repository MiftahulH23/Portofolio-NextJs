import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";
import { TIP_KEYS, TouchTips } from "./TouchTips";

const original = window.matchMedia;

function mockMedia(touch: boolean) {
  window.matchMedia = ((q: string) => ({
    ...original(q),
    matches: touch && (q.includes("coarse") || q.includes("portrait")),
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as typeof window.matchMedia;
}

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.clear();
  worldStore.reset();
  worldStore.closeCard();
  worldStore.setPhase("intro");
});

afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = original;
});

describe("TouchTips", () => {
  it("shows the controls tip, then the rotate tip, once per visitor", () => {
    mockMedia(true);
    const { unmount } = renderWithLanguage(<TouchTips />);
    act(() => worldStore.setPhase("running"));
    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByText("Hold the big button to ride; the one beside it brakes")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByText("Rotate your phone for a wider view")).toBeInTheDocument();
    expect(window.localStorage.getItem(TIP_KEYS.controls)).toBe("1");
    expect(window.localStorage.getItem(TIP_KEYS.rotate)).toBe("1");
    unmount();

    renderWithLanguage(<TouchTips />);
    act(() => vi.advanceTimersByTime(15000));
    expect(screen.queryByText("Hold the big button to ride; the one beside it brakes")).not.toBeInTheDocument();
    expect(screen.queryByText("Rotate your phone for a wider view")).not.toBeInTheDocument();
  });

  it("stays hidden on desktop", () => {
    mockMedia(false);
    renderWithLanguage(<TouchTips />);
    act(() => worldStore.setPhase("running"));
    act(() => vi.advanceTimersByTime(15000));
    expect(screen.queryByText("Hold the big button to ride; the one beside it brakes")).not.toBeInTheDocument();
  });
});

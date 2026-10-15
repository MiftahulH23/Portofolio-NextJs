import { act, fireEvent, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import { renderWithLanguage } from "@/test/render";
import { GATE_KEYS } from "@/world/gates";
import { canRide, worldStore } from "@/world/store";
import { useKeyboardInput } from "@/components/world/useKeyboardInput";
import { useDisposeOnChange } from "@/components/world/useDisposeOnChange";
import { getAudio } from "@/components/world/audio";

vi.mock("@/hooks/useWebGLSupport", () => ({ useWebGLSupport: () => true }));
vi.mock("next/dynamic", () => ({
  default: () =>
    function FakeWorld({ onReady }: { onReady?: () => void }) {
      return <button onClick={onReady}>fake-world</button>;
    },
}));

import { CardAnnouncer } from "./CardAnnouncer";
import { FinishDialog } from "./FinishDialog";
import { Hud } from "./Hud";
import { InfoCard } from "./InfoCard";
import { Intro } from "./Intro";
import { WorldGate } from "./WorldGate";

const fresh = () => {
  worldStore.reset();
  worldStore.closeCard();
  worldStore.setContextLost(false);
  worldStore.setPhase("intro");
};
beforeEach(fresh);
afterEach(() => vi.restoreAllMocks());

describe("Critical: leaving / and coming back", () => {
  it("unmounting the world gate resets the session so a return starts cleanly", async () => {
    const view = renderWithLanguage(<WorldGate />);
    await userEvent.click(screen.getByRole("button", { name: "Start exploring →" }));
    await userEvent.click(screen.getByText("fake-world"));
    expect(worldStore.getState().phase).toBe("running");
    view.unmount();
    expect(worldStore.getState()).toMatchObject({ phase: "intro", contextLost: false, card: null });
    renderWithLanguage(<WorldGate />);
    expect(screen.getByRole("button", { name: "Start exploring →" })).toBeEnabled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("a context-loss event that arrives after the world was torn down is ignored", () => {
    worldStore.reportContextLost();
    expect(worldStore.getState().contextLost).toBe(false);
    worldStore.setPhase("running");
    worldStore.reportContextLost();
    expect(worldStore.getState().contextLost).toBe(true);
  });
});

describe("Important: audio survives a return to /", () => {
  it("is one shared instance and creates a single AudioContext", () => {
    let made = 0;
    class Ctx {
      currentTime = 0;
      destination = {};
      constructor() {
        made++;
      }
      resume() {}
    }
    vi.stubGlobal("AudioContext", Ctx);
    expect(getAudio()).toBe(getAudio());
    getAudio().unlock();
    getAudio().unlock();
    expect(made).toBe(1);
    vi.unstubAllGlobals();
  });
});

describe("Important: no hydration mismatch with reduced motion", () => {
  it("hydrates the intro cleanly when the device prefers reduced motion", async () => {
    const original = window.matchMedia;
    const tree = (
      <LanguageProvider>
        <Intro hidden={false} />
      </LanguageProvider>
    );
    const html = renderToString(tree);
    window.matchMedia = ((q: string) => ({ ...original(q), matches: q.includes("reduce") })) as typeof window.matchMedia;
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const errors: unknown[] = [];
    await act(async () => {
      hydrateRoot(container, tree, { onRecoverableError: (e) => errors.push(e) });
    });
    expect(errors).toEqual([]);
    expect(container.textContent).toContain("Reduced motion is enabled");
    container.remove();
    window.matchMedia = original;
  });
});

describe("Important: textures are disposed when replaced", () => {
  it("disposes the previous set on change and the last set on unmount", () => {
    const a = [{ dispose: vi.fn() }], b = [{ dispose: vi.fn() }];
    const { rerender, unmount } = renderHook(({ items }) => useDisposeOnChange(items), { initialProps: { items: a } });
    rerender({ items: b });
    expect(a[0].dispose).toHaveBeenCalledOnce();
    expect(b[0].dispose).not.toHaveBeenCalled();
    unmount();
    expect(b[0].dispose).toHaveBeenCalledOnce();
  });
});

describe("Important: card announcements", () => {
  it("a persistent live region announces the gate and title; the dialog itself is not live", () => {
    worldStore.setPhase("running");
    renderWithLanguage(
      <>
        <CardAnnouncer />
        <InfoCard />
      </>,
    );
    const live = document.querySelector("[aria-live='polite']")!;
    expect(live).toBeInTheDocument();
    expect(live).toHaveTextContent("");
    act(() => worldStore.openCard("profile"));
    expect(live).toHaveTextContent("Gate 1 · Profile: Miftahul Huda");
    expect(screen.getByRole("dialog").querySelector("[aria-live]")).toBeNull();
  });
});

describe("Important: keyboard and focused controls", () => {
  it("Space on a focused button activates the button instead of the bell", () => {
    const input = { gas: false, brake: false, left: false, right: false, boost: false };
    const onBell = vi.fn();
    renderHook(() => useKeyboardInput(input, { onBell, onEscape: vi.fn() }, true));
    const btn = document.createElement("button");
    document.body.appendChild(btn);
    const ev = new KeyboardEvent("keydown", { code: "Space", bubbles: true, cancelable: true });
    btn.dispatchEvent(ev);
    expect(onBell).not.toHaveBeenCalled();
    expect(ev.defaultPrevented).toBe(false);
    btn.remove();
    fireEvent.keyDown(window, { code: "Space" });
    expect(onBell).toHaveBeenCalledOnce();
  });

  it("riding is disabled while a modal dialog is up", () => {
    const s = { ...worldStore.getState(), phase: "running" as const };
    expect(canRide(s)).toBe(true);
    expect(canRide({ ...s, finished: true })).toBe(false);
    expect(canRide({ ...s, contextLost: true })).toBe(false);
    expect(canRide({ ...s, phase: "intro" })).toBe(false);
  });
});

describe("Important: modal dialogs are modal", () => {
  it("the HUD behind the finish dialog is inert and Esc keeps exploring", async () => {
    worldStore.setPhase("running");
    renderWithLanguage(<Hud />);
    act(() => GATE_KEYS.forEach((k) => worldStore.enterGate(k)));
    expect(screen.getByRole("navigation", { hidden: true }).closest("[inert]")).not.toBeNull();
    await userEvent.keyboard("{Escape}");
    expect(worldStore.getState()).toMatchObject({ finished: false, freeRide: true });
    expect(screen.getByRole("navigation").closest("[inert]")).toBeNull();
  });

  it("the HUD is inert while the context-lost dialog is up", () => {
    worldStore.setPhase("running");
    renderWithLanguage(<Hud />);
    act(() => worldStore.setContextLost(true));
    expect(screen.getByRole("navigation", { hidden: true }).closest("[inert]")).not.toBeNull();
  });

  it("FinishDialog alone still works when rendered without the HUD", () => {
    worldStore.setPhase("running");
    renderWithLanguage(<FinishDialog />);
    act(() => GATE_KEYS.forEach((k) => worldStore.enterGate(k)));
    expect(screen.getByRole("dialog", { name: "Exploration complete" })).toBeInTheDocument();
  });
});

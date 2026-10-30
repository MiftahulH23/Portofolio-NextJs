import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";

vi.mock("@/hooks/useWebGLSupport", () => ({ useWebGLSupport: () => true }));
const mode = vi.hoisted(() => ({ fail: true }));
vi.mock("next/dynamic", () => ({
  default: () =>
    function FakeWorld({ onReady }: { onReady?: () => void }) {
      if (mode.fail) throw new Error("Failed to fetch dynamically imported module");
      return <button onClick={onReady}>fake-world</button>;
    },
}));

import { WorldGate } from "./WorldGate";

beforeEach(() => {
  worldStore.setPhase("intro");
  worldStore.setContextLost(false);
});

describe("WorldGate failures", () => {
  it("a chunk that fails to load returns to the intro with a retry that works", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithLanguage(<WorldGate />);
    await userEvent.click(screen.getByRole("button", { name: "Start riding" }));
    expect(worldStore.getState().phase).toBe("failed");
    mode.fail = false;
    await userEvent.click(screen.getByRole("button", { name: "The city could not be loaded. Try again" }));
    expect(screen.getByText("fake-world")).toBeInTheDocument();
    spy.mockRestore();
  });

  it("a lost WebGL context shows reload and compact options", () => {
    mode.fail = false;
    renderWithLanguage(<WorldGate />);
    act(() => {
      worldStore.setPhase("running");
      worldStore.setContextLost(true);
    });
    expect(screen.getByRole("alertdialog", { name: "3D mode stopped" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /compact version/i }).length).toBeGreaterThan(0);
  });
});

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { worldStore } from "@/world/store";

vi.mock("@/hooks/useWebGLSupport", () => ({ useWebGLSupport: () => true }));
vi.mock("next/dynamic", () => ({
  default: () =>
    function FakeWorld({ onReady }: { onReady?: () => void }) {
      return (
        <button type="button" onClick={onReady}>
          fake-world
        </button>
      );
    },
}));

import { WorldGate } from "./WorldGate";

beforeEach(() => worldStore.setPhase("intro"));

describe("WorldGate", () => {
  it("mounts the world only after start, and hides the intro once it is ready", async () => {
    const { container } = renderWithLanguage(<WorldGate />);
    expect(screen.queryByText("fake-world")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Start exploring →" }));
    await userEvent.click(screen.getByText("fake-world"));
    expect(worldStore.getState().phase).toBe("running");
    expect(container.querySelector("section[aria-label='Introduction']")).toHaveAttribute("inert");
  });
});

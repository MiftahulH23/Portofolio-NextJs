import { act, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

vi.mock("@/hooks/useCanUseWebGL", () => ({ useCanUseWebGL: () => true, detectWebGL: () => true }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useInView: () => true,
}));

const behaviour = vi.hoisted(() => ({ mode: "throw" as "throw" | "lose" }));
vi.mock("next/dynamic", () => ({
  default: () =>
    function FakeIcons({ onContextLost }: { onContextLost?: () => void }) {
      if (behaviour.mode === "throw") throw new Error("Error creating WebGL context.");
      return (
        <button type="button" onClick={onContextLost}>
          lose-context
        </button>
      );
    },
}));

import { FloatingIconsCard } from "./FloatingIconsCard";

describe("FloatingIconsCard when WebGL fails at runtime", () => {
  it("falls back to CSS icons when the renderer throws", () => {
    behaviour.mode = "throw";
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithLanguage(<FloatingIconsCard />);
    expect(screen.getAllByTestId("float-icon")).toHaveLength(6);
    spy.mockRestore();
  });

  it("falls back to CSS icons when the context is lost", () => {
    behaviour.mode = "lose";
    renderWithLanguage(<FloatingIconsCard />);
    expect(screen.queryAllByTestId("float-icon")).toHaveLength(0);
    act(() => screen.getByRole("button", { name: "lose-context", hidden: true }).click());
    expect(screen.getAllByTestId("float-icon")).toHaveLength(6);
  });
});

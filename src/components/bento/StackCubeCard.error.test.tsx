import { act, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

// WebGL looks available, the card is in view, but the renderer itself fails.
vi.mock("@/hooks/useCanUseWebGL", () => ({ useCanUseWebGL: () => true, detectWebGL: () => true }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useInView: () => true,
}));

const cubeBehaviour = vi.hoisted(() => ({ mode: "throw" as "throw" | "lose" }));
vi.mock("next/dynamic", () => ({
  default: () =>
    function FakeStackCube({ onContextLost }: { onContextLost?: () => void }) {
      if (cubeBehaviour.mode === "throw") throw new Error("Error creating WebGL context.");
      return (
        <button type="button" onClick={onContextLost}>
          lose-context
        </button>
      );
    },
}));

import { StackCubeCard } from "./StackCubeCard";

const FACES = ["React", "Laravel", "Next.js", "Node.js", "TypeScript", "MySQL"];

describe("StackCubeCard when WebGL fails at runtime", () => {
  it("falls back to the CSS cube when the renderer throws", () => {
    cubeBehaviour.mode = "throw";
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithLanguage(<StackCubeCard />);
    for (const face of FACES) expect(screen.getByText(face)).toBeInTheDocument();
    spy.mockRestore();
  });

  it("falls back to the CSS cube when the WebGL context is lost", () => {
    cubeBehaviour.mode = "lose";
    renderWithLanguage(<StackCubeCard />);
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    act(() => screen.getByRole("button", { name: "lose-context" }).click());
    for (const face of FACES) expect(screen.getByText(face)).toBeInTheDocument();
  });
});

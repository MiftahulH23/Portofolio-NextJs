import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

vi.mock("@/hooks/useCanUseWebGL", () => ({ useCanUseWebGL: () => false, detectWebGL: () => false }));

import { StackCubeCard } from "./StackCubeCard";

describe("StackCubeCard", () => {
  it("renders the CSS cube with all six faces when WebGL is not usable", () => {
    renderWithLanguage(<StackCubeCard />);
    expect(screen.getByRole("img", { name: "Rotating 3D cube showing my tech stack" })).toBeInTheDocument();
    for (const face of ["React", "Laravel", "Next.js", "Node.js", "TypeScript", "MySQL"]) {
      expect(screen.getByText(face)).toBeInTheDocument();
    }
    expect(screen.queryByText("drag ↻")).not.toBeInTheDocument();
  });
});

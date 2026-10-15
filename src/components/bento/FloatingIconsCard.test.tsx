import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

vi.mock("@/hooks/useCanUseWebGL", () => ({ useCanUseWebGL: () => false, detectWebGL: () => false }));

import { FloatingIconsCard } from "./FloatingIconsCard";

describe("FloatingIconsCard", () => {
  it("shows the CSS icons (no tech-name text) when WebGL is not usable", () => {
    renderWithLanguage(<FloatingIconsCard />);
    expect(screen.getAllByTestId("float-icon")).toHaveLength(6);
    for (const name of ["React", "Laravel", "MySQL"]) expect(screen.queryByText(name)).not.toBeInTheDocument();
    expect(screen.getByText("toolkit.glb")).toBeInTheDocument();
    expect(screen.queryByText("hover · click · drag")).not.toBeInTheDocument();
  });
});

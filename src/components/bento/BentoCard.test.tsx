import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BentoCard, bentoSpan } from "./BentoCard";

describe("BentoCard", () => {
  it("renders children inside a labelled section with span classes", () => {
    render(
      <BentoCard cols={8} rows={3} id="intro" aria-label="Intro">
        hello
      </BentoCard>,
    );
    const section = screen.getByRole("region", { name: "Intro" });
    expect(section).toHaveTextContent("hello");
    expect(section).toHaveAttribute("id", "intro");
    expect(section.className).toContain("bento:col-span-8");
    expect(section.className).toContain("bento:row-span-3");
  });

  it("bentoSpan returns static class names", () => {
    expect(bentoSpan(12, 1)).toBe("bento:col-span-12 bento:row-span-1");
  });
});

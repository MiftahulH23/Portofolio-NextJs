import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { fallbackContributions } from "@/lib/github";
import { ContributionsCard } from "./ContributionsCard";

describe("ContributionsCard", () => {
  it("shows the total and live label for GitHub data", () => {
    renderWithLanguage(<ContributionsCard login="MiftahulH23" data={{ ...fallbackContributions(), total: 401, source: "github" }} />);
    expect(screen.getByText("401 contributions in the last year")).toBeInTheDocument();
    expect(screen.getByText("live via GitHub API")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "github.com/MiftahulH23" })).toHaveAttribute("href", "https://github.com/MiftahulH23");
  });

  it("renders nothing for the offline sample, so fake activity is never shown", () => {
    const { container } = renderWithLanguage(<ContributionsCard login="MiftahulH23" data={fallbackContributions()} />);
    expect(container).toBeEmptyDOMElement();
  });
});

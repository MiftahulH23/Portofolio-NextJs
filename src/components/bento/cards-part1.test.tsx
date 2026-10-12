import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { IntroCard } from "./IntroCard";
import { GpaCard } from "./GpaCard";
import { ExperienceCard } from "./ExperienceCard";
import { StackMarquee } from "./StackMarquee";
import { ServicesSection } from "./ServicesSection";
import { LocationCard } from "./LocationCard";

describe("bento cards part 1", () => {
  it("IntroCard shows the name as h1, CTAs, and no CV link when cvUrl is unset", () => {
    renderWithLanguage(<IntroCard />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Miftahul Huda");
    expect(screen.getByRole("link", { name: /explore work/i })).toHaveAttribute("href", "/#work");
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/MiftahulH23");
    expect(screen.queryByRole("link", { name: /download cv/i })).not.toBeInTheDocument();
  });

  it("GpaCard exposes an accessible GPA label", () => {
    renderWithLanguage(<GpaCard />);
    expect(screen.getByRole("img", { name: "GPA 3.80 out of 4.00" })).toBeInTheDocument();
    expect(screen.getByText("3.80")).toBeInTheDocument();
  });

  it("ExperienceCard lists both roles and has the about anchor", () => {
    renderWithLanguage(<ExperienceCard />);
    expect(screen.getByText("Laboratory Teaching Assistant")).toBeInTheDocument();
    expect(screen.getByText("PT Bank Riau Kepri Syariah")).toBeInTheDocument();
    expect(document.getElementById("about")).not.toBeNull();
  });

  it("StackMarquee lists every skill once for screen readers", () => {
    renderWithLanguage(<StackMarquee />);
    const list = screen.getByRole("list", { name: "Tech stack" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(22);
    expect(within(list).getByText("Laravel")).toBeInTheDocument();
  });

  it("ServicesSection renders the heading and four services", () => {
    renderWithLanguage(<ServicesSection />);
    expect(screen.getByRole("heading", { level: 2, name: "Services" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByText("Mobile Development")).toBeInTheDocument();
  });

  it("LocationCard shows the location", () => {
    renderWithLanguage(<LocationCard />);
    expect(screen.getByText("Riau, Indonesia")).toBeInTheDocument();
  });
});

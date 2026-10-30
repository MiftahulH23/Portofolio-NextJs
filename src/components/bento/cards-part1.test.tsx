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
    expect(screen.getByRole("link", { name: /explore work/i })).toHaveAttribute("href", "/ringkas#work");
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/MiftahulH23");
    expect(screen.queryByRole("link", { name: /download cv/i })).not.toBeInTheDocument();
  });

  it("IntroCard name is never painted at opacity 0 (keeps LCP on the server paint)", () => {
    renderWithLanguage(<IntroCard />);
    const words = screen.getByRole("heading", { level: 1 }).querySelectorAll("span.inline-block");
    expect(words.length).toBeGreaterThan(0);
    words.forEach((w) => expect((w as HTMLElement).style.opacity).not.toBe("0"));
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

  it("ServicesSection gives each service its own icon", () => {
    const { container } = renderWithLanguage(<ServicesSection />);
    const icons = [...container.querySelectorAll("[data-service-icon]")].map((el) => el.getAttribute("data-service-icon"));
    expect(icons).toEqual(["frontend", "backend", "fullstack", "mobile"]);
    for (const el of container.querySelectorAll("[data-service-icon]")) {
      expect(el).toHaveAttribute("aria-hidden", "true");
      expect(el.querySelectorAll("svg")).toHaveLength(1);
    }
    expect(container.querySelector("[data-wire-cube]")).toBeNull();
  });

  it("LocationCard shows the location", () => {
    renderWithLanguage(<LocationCard />);
    expect(screen.getByText("Riau, Indonesia")).toBeInTheDocument();
  });
});

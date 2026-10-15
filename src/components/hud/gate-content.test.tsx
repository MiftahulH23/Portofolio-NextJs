import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { renderWithLanguage } from "@/test/render";
import { GateContent } from "./gate-content";

describe("GateContent", () => {
  it("skills lists every skill group", () => {
    renderWithLanguage(<GateContent gate="skills" />);
    for (const g of en.skills) expect(screen.getByText(g.group)).toBeInTheDocument();
    expect(screen.getByText("Laravel")).toBeInTheDocument();
  });
  it("experience shows each position from content", () => {
    renderWithLanguage(<GateContent gate="experience" />);
    for (const e of en.experience) expect(screen.getByText(e.position)).toBeInTheDocument();
  });
  it("projects link to their case studies", () => {
    renderWithLanguage(<GateContent gate="projects" />);
    for (const p of en.projects) expect(screen.getByRole("link", { name: p.title })).toHaveAttribute("href", `/projects/${p.slug}`);
  });
  it("education shows the GPA from content", () => {
    renderWithLanguage(<GateContent gate="education" />);
    expect(screen.getByText("3.80")).toBeInTheDocument();
    expect(screen.getByText("/ 4.00")).toBeInTheDocument();
  });
  it("contact links to the compact contact form", () => {
    renderWithLanguage(<GateContent gate="contact" />);
    expect(screen.getByRole("link", { name: "Send a message →" })).toHaveAttribute("href", "/ringkas#contact");
    expect(screen.getByText(en.personal.email)).toBeInTheDocument();
  });
});

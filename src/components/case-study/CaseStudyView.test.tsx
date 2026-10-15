import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import type { Project } from "@/content";
import { CaseStudyView } from "./CaseStudyView";

const bare: Project = {
  slug: "bare",
  title: "Bare Project",
  role: "Full-Stack Developer",
  description: "Only the basics.",
  image: "/thumbnails/sistem-informasi-prestasi-mahasiswa.png",
  technologies: ["React.js"],
  featured: false,
};

const full: Project = {
  ...bare,
  slug: "full",
  title: "Full Project",
  demo: "https://example.com",
  github: "https://github.com/x/y",
  caseStudy: {
    timeline: "Jan — Jun 2025",
    problem: { headline: "Paper forms everywhere", body: "Records were scattered." },
    responsibilities: ["Designed the schema"],
    architecture: [
      { label: "client", title: "React", detail: "SPA" },
      { label: "server", title: "Laravel", detail: "API" },
    ],
    features: [{ title: "Proposals", detail: "Submit online." }],
    challenges: [{ problem: "Slow queries", solution: "Added indexes" }],
    results: [{ value: "120", label: "students onboarded" }],
  },
  gallery: [{ src: "/thumbnails/sistem-informasi-prestasi-mahasiswa.png", alt: "Form" }],
};

describe("CaseStudyView", () => {
  it("renders only hero, screenshot and next link when there is no case-study data", () => {
    renderWithLanguage(<CaseStudyView project={bare} index={2} total={4} next={full} nextIndex={3} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bare Project");
    expect(screen.getByText("02 / 04")).toBeInTheDocument();
    expect(screen.queryByText("the problem")).not.toBeInTheDocument();
    expect(screen.queryByText("architecture")).not.toBeInTheDocument();
    expect(screen.queryByText("timeline")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Live ↗" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Full Project/ })).toHaveAttribute("href", "/projects/full");
  });

  it("renders every section when data exists", () => {
    renderWithLanguage(<CaseStudyView project={full} index={1} total={4} next={bare} nextIndex={2} />);
    for (const text of ["Jan — Jun 2025", "Paper forms everywhere", "Designed the schema", "Laravel", "Proposals", "Added indexes", "students onboarded"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Live ↗" })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByAltText("Form")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to work/i })).toHaveAttribute("href", "/ringkas#work");
  });
});

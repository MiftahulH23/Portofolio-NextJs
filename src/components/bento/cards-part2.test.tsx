import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { LanguageProvider } from "@/context/LanguageContext";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectList } from "./ProjectList";
import { ProcessCard } from "./ProcessCard";
import { TerminalCard } from "./TerminalCard";
import { CertificationsCard, EducationCard } from "./EducationRow";

describe("bento cards part 2", () => {
  it("FeaturedProject links to its case study and live demo", () => {
    renderWithLanguage(<FeaturedProject />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Student Achievement Information System");
    expect(screen.getByRole("link", { name: /read case study/i })).toHaveAttribute("href", "/projects/sipresma");
    expect(screen.getByRole("link", { name: "Open live demo" })).toHaveAttribute("href", "https://sipresma.pocari.id/");
    expect(document.getElementById("work")).not.toBeNull();
  });

  it("ProjectList shows only non-featured projects with case-study links", () => {
    renderWithLanguage(<ProjectList />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/projects/lps", "/projects/indogrosir-scm", "/projects/esteh-scm"]);
  });

  it("ProcessCard renders four ordered steps", () => {
    renderWithLanguage(<ProcessCard />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Ship")).toBeInTheDocument();
  });

  it("TerminalCard computes counts from content", () => {
    renderWithLanguage(<TerminalCard />);
    expect(screen.getByText(/22 found/)).toBeInTheDocument();
    expect(screen.getByText(/4 shipped/)).toBeInTheDocument();
    expect(screen.getByText(/miftahulh942@gmail\.com/)).toBeInTheDocument();
  });

  it("CertificationsCard renders nothing when the list is empty", () => {
    const { container } = render(
      <LanguageProvider>
        <CertificationsCard certifications={[]} />
      </LanguageProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("CertificationsCard renders verify links only when a url exists", () => {
    renderWithLanguage(
      <CertificationsCard
        certifications={[
          { name: "Cert A", issuer: "Org", year: "2025", url: "https://example.com/a" },
          { name: "Cert B", issuer: "Org", year: "2024" },
        ]}
      />,
    );
    expect(screen.getByText("Cert A").closest("a")).toHaveAttribute("href", "https://example.com/a");
    expect(screen.getByText("Cert B").closest("a")).toBeNull();
    expect(screen.getAllByText("Verify")).toHaveLength(1);
  });

  it("EducationCard spans 12 columns when wide", () => {
    renderWithLanguage(<EducationCard wide />);
    expect(screen.getByText("Politeknik Caltex Riau").closest("section")?.className).toContain("bento:col-span-12");
  });
});

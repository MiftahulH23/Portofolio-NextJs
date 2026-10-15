// @vitest-environment node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getContent, getProject, getUi } from "./index";

const en = getContent("en");
const id = getContent("id");
const publicPath = (p: string) => join(process.cwd(), "public", decodeURI(p));

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
}

describe("content integrity", () => {
  it("en and id expose the same projects in the same order", () => {
    expect(id.projects.map((p) => p.slug)).toEqual(en.projects.map((p) => p.slug));
    id.projects.forEach((p, i) => {
      expect(p.image).toBe(en.projects[i].image);
      expect(p.technologies).toEqual(en.projects[i].technologies);
    });
  });

  it("slugs are unique kebab-case", () => {
    const slugs = en.projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
  });

  it("exactly one project is featured", () => {
    expect(en.projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it("every referenced public file exists", () => {
    for (const p of en.projects) {
      expect(existsSync(publicPath(p.image)), p.image).toBe(true);
      for (const g of p.gallery ?? []) expect(existsSync(publicPath(g.src)), g.src).toBe(true);
    }
    if (en.personal.cvUrl) expect(existsSync(publicPath(en.personal.cvUrl))).toBe(true);
  });

  it("list lengths match between languages", () => {
    expect(id.services).toHaveLength(en.services.length);
    expect(id.experience).toHaveLength(en.experience.length);
    expect(id.process).toHaveLength(en.process.length);
    expect(id.certifications).toHaveLength(en.certifications.length);
  });

  it("ui strings have identical keys in both languages", () => {
    expect(keyPaths(getUi("id")).sort()).toEqual(keyPaths(getUi("en")).sort());
  });

  it("no placeholder brackets leak into content", () => {
    const text = JSON.stringify([en, id, getUi("en"), getUi("id")]);
    expect(text).not.toMatch(/\[[A-Z][^\]]*\]/);
  });

  it("highlightStack has 8 items that all appear in skills", () => {
    for (const lang of ["en", "id"] as const) {
      const c = getContent(lang);
      const all = c.skills.flatMap((g) => g.items);
      expect(c.highlightStack).toHaveLength(8);
      for (const s of c.highlightStack) expect(all).toContain(s);
    }
  });

  it("getProject finds by slug", () => {
    expect(getProject("id", "sipresma")?.title).toBe("Sistem Informasi Prestasi Mahasiswa");
    expect(getProject("en", "nope")).toBeUndefined();
  });
});

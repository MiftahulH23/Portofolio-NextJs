import { en } from "./en";
import { id } from "./id";
import { uiEn, uiId, type UiStrings } from "./ui";
import type { Lang, PortfolioContent, Project } from "./types";

export * from "./types";
export type { UiStrings } from "./ui";

export function getContent(lang: Lang): PortfolioContent {
  return lang === "id" ? id : en;
}

export function getUi(lang: Lang): UiStrings {
  return lang === "id" ? uiId : uiEn;
}

export function getProject(lang: Lang, slug: string): Project | undefined {
  return getContent(lang).projects.find((p) => p.slug === slug);
}

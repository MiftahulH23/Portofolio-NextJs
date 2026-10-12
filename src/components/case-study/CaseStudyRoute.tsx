"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CaseStudyView } from "./CaseStudyView";

export function CaseStudyRoute({ slug }: { slug: string }) {
  const { content } = useLanguage();
  const projects = content.projects;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  const nextI = (i + 1) % projects.length;
  return <CaseStudyView project={projects[i]} index={i + 1} total={projects.length} next={projects[nextI]} nextIndex={nextI + 1} />;
}

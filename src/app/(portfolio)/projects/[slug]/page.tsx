import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, getProject } from "@/content";
import { CaseStudyRoute } from "@/components/case-study/CaseStudyRoute";

export const dynamicParams = false;

export function generateStaticParams() {
  return getContent("en").projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject("en", slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: project.title, description: project.description, images: [project.image] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProject("en", slug)) notFound();
  return <CaseStudyRoute slug={slug} />;
}

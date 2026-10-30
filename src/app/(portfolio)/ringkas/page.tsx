import { BentoGrid } from "@/components/bento/BentoGrid";
import { ContactSection } from "@/components/bento/ContactSection";
import { ContributionsCard } from "@/components/bento/ContributionsCard";
import { EducationRow } from "@/components/bento/EducationRow";
import { ExperienceCard } from "@/components/bento/ExperienceCard";
import { FeaturedProject } from "@/components/bento/FeaturedProject";
import { GpaCard } from "@/components/bento/GpaCard";
import { IntroCard } from "@/components/bento/IntroCard";
import { LocationCard } from "@/components/bento/LocationCard";
import { ProcessCard } from "@/components/bento/ProcessCard";
import { ProjectList } from "@/components/bento/ProjectList";
import { ServicesSection } from "@/components/bento/ServicesSection";
import { FloatingIconsCard } from "@/components/bento/FloatingIconsCard";
import { StackMarquee } from "@/components/bento/StackMarquee";
import { TerminalCard } from "@/components/bento/TerminalCard";
import { getContent } from "@/content";
import { getContributions } from "@/lib/github";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  alternates: { canonical: "/ringkas" },
};

export const revalidate = 86400;

export default async function Home() {
  const c = getContent("en");
  const login = c.personal.githubLogin;
  const contributions = await getContributions(login);

  return (
    <main id="top" className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <BentoGrid>
        <IntroCard />
        <FloatingIconsCard />
        <LocationCard />
        <GpaCard />
        <ExperienceCard />
        <StackMarquee />
        <ServicesSection />
        <FeaturedProject />
        <ProjectList />
        <ProcessCard />
        {/* The graph renders only with real GitHub data; the terminal then fills the row. */}
        <TerminalCard wide={contributions.source !== "github"} />
        <ContributionsCard data={contributions} login={login} />
        <EducationRow />
        <ContactSection />
      </BentoGrid>
    </main>
  );
}

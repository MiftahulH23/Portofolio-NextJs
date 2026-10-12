import { BentoGrid } from "@/components/bento/BentoGrid";
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
import { StackCubeCard } from "@/components/bento/StackCubeCard";
import { StackMarquee } from "@/components/bento/StackMarquee";
import { TerminalCard } from "@/components/bento/TerminalCard";
import { getContent } from "@/content";
import { getContributions } from "@/lib/github";

export const revalidate = 86400;

export default async function Home() {
  const c = getContent("en");
  const login = c.personal.githubLogin;
  const contributions = await getContributions(login);

  return (
    <main id="top" className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <BentoGrid>
        <IntroCard />
        <StackCubeCard />
        <LocationCard />
        <GpaCard />
        <ExperienceCard />
        <StackMarquee />
        <ServicesSection />
        <FeaturedProject />
        <ProjectList />
        <ProcessCard />
        <TerminalCard />
        <ContributionsCard data={contributions} login={login} />
        <EducationRow />
        {/* Task 8: <ContactSection /> */}
      </BentoGrid>
    </main>
  );
}

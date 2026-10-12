import { BentoGrid } from "@/components/bento/BentoGrid";
import { EducationRow } from "@/components/bento/EducationRow";
import { ExperienceCard } from "@/components/bento/ExperienceCard";
import { FeaturedProject } from "@/components/bento/FeaturedProject";
import { GpaCard } from "@/components/bento/GpaCard";
import { IntroCard } from "@/components/bento/IntroCard";
import { LocationCard } from "@/components/bento/LocationCard";
import { ProcessCard } from "@/components/bento/ProcessCard";
import { ProjectList } from "@/components/bento/ProjectList";
import { ServicesSection } from "@/components/bento/ServicesSection";
import { StackMarquee } from "@/components/bento/StackMarquee";
import { TerminalCard } from "@/components/bento/TerminalCard";

export default function Home() {
  return (
    <main id="top" className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <BentoGrid>
        <IntroCard />
        {/* Task 6: <StackCubeCard /> */}
        <LocationCard />
        <GpaCard />
        <ExperienceCard />
        <StackMarquee />
        <ServicesSection />
        <FeaturedProject />
        <ProjectList />
        <ProcessCard />
        <TerminalCard />
        {/* Task 7: <ContributionsCard data={contributions} /> */}
        <EducationRow />
        {/* Task 8: <ContactSection /> */}
      </BentoGrid>
    </main>
  );
}

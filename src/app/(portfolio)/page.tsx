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
import { StackCubeCard } from "@/components/bento/StackCubeCard";
import { StackMarquee } from "@/components/bento/StackMarquee";
import { TerminalCard } from "@/components/bento/TerminalCard";
import { getContent } from "@/content";
import { getContributions } from "@/lib/github";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

export default async function Home() {
  const c = getContent("en");
  const login = c.personal.githubLogin;
  const contributions = await getContributions(login);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.personal.name,
    jobTitle: c.personal.headline,
    email: `mailto:${c.personal.email}`,
    url: SITE_URL,
    sameAs: [c.personal.socials.github, c.personal.socials.linkedin, c.personal.socials.instagram],
    alumniOf: { "@type": "CollegeOrUniversity", name: c.education.institution },
    address: { "@type": "PostalAddress", addressRegion: "Riau", addressCountry: "ID" },
  };

  return (
    <main id="top" className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
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
        <ContactSection />
      </BentoGrid>
    </main>
  );
}

import type { Metadata } from "next";
import { WorldGate } from "@/components/hud/WorldGate";
import { getContent, getUi } from "@/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  description: getUi("en").world.intro.summary,
  alternates: { canonical: "/" },
};

export default function Home() {
  const c = getContent("en");
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
    <main className="relative min-h-dvh overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <WorldGate />
    </main>
  );
}

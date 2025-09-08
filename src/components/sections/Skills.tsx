"use client";

import { portfolioData } from "@/lib/data";
import Marquee from "react-fast-marquee";

// Komponen untuk satu item skill
const SkillCard = ({ name }: { name: string }) => (
  <div className="mx-4 flex-shrink-0 p-4 border border-border rounded-lg text-center bg-card/80 backdrop-blur-sm">
    <p className="font-semibold text-foreground whitespace-nowrap">{name}</p>
  </div>
);

export default function Skills() {
  const allSkills = Object.values(portfolioData.skills).flat();

  return (
    <section id="skills" className="w-full py-12 md:py-24 lg:py-32">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
        Keahlian & Teknologi
      </h2>

      <Marquee
        pauseOnHover={true}
        speed={50}
        gradient={true}
        gradientColor="var(--background)"
        gradientWidth={100}
      >
        {allSkills.map((skill, index) => (
          <SkillCard key={index} name={skill} />
        ))}
      </Marquee>
    </section>
  );
}

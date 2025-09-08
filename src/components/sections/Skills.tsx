"use client"; // Diperlukan karena library ini adalah komponen client

import { portfolioData } from "@/lib/data";
import Marquee from "react-fast-marquee";

// Komponen untuk satu item skill
const SkillCard = ({ name }: { name: string }) => (
  <div className="mx-4 flex-shrink-0 p-4 border border-border rounded-lg text-center bg-background/20 backdrop-blur-sm">
    <p className="font-semibold text-foreground whitespace-nowrap">{name}</p>
  </div>
);

export default function Skills() {
  const allSkills = Object.values(portfolioData.skills).flat();

  return (
    <section id="skills" className="w-full py-6 md:py-12 lg:py-24">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
        Keahlian & Teknologi
      </h2>

      {/* Menggunakan komponen Marquee yang baru di-install */}
      <Marquee
        pauseOnHover={true}
        speed={50}
        gradient={true}
        gradientColor="oklch(0.145 0 0)" // Warna background dark mode-mu
        gradientWidth={100}
      >
        {allSkills.map((skill, index) => (
          <SkillCard key={index} name={skill} />
        ))}
      </Marquee>
    </section>
  );
}

import { portfolioData } from "@/lib/data";

export default function Skills() {
  // Kita gabungkan semua skill ke dalam satu array
  const allSkills = Object.values(portfolioData.skills).flat();

  // Komponen untuk satu item skill
  const SkillCard = ({ name }: { name: string }) => (
    <div className="flex-shrink-0 p-4 border border-border rounded-lg text-center bg-background/20 backdrop-blur-sm">
      <p className="font-semibold text-foreground whitespace-nowrap">{name}</p>
    </div>
  );

  return (
    <section id="skills" className="w-full py-12 md:py-24 lg:py-32">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
        Teknologi yang Saya Kuasai
      </h2>

      {/* Container utama untuk marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Wrapper yang akan dianimasikan */}
        {/* GANTI hover:pause MENJADI hover:[animation-play-state:paused] */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {/* Kita render list skill DUA KALI untuk loop yang mulus */}
          <div className="flex space-x-4 pr-4">
            {allSkills.map((skill, index) => (
              <SkillCard key={`a-${index}`} name={skill} />
            ))}
          </div>
          <div className="flex space-x-4 pr-4">
            {allSkills.map((skill, index) => (
              <SkillCard key={`b-${index}`} name={skill} />
            ))}
          </div>
        </div>

        {/* Efek gradasi di sisi kiri dan kanan agar terlihat lebih halus */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}

import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";

export default function Home() {
  return (
    <>
      {/* Container Utama untuk semua section */}
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <Skills />
        <Education />
        <Experience />
        <Projects />
      </main>

      {/* Footer sekarang berada di luar main, tapi menggunakan container sendiri */}
      <footer className="w-full py-8 mt-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Miftahul Huda
          </p>
        </div>
      </footer>
    </>
  );
}

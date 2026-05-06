import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Education />
      <Experience />
      <Projects />
      <ContactCTA />
      <Footer />
    </>
  );
}

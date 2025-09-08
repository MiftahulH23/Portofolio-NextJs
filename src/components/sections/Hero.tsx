"use client";

import { Button } from "@/components/ui/button";
import { portfolioData } from "@/lib/data";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "../ui/aurora-background";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { motion } from "framer-motion";

export default function Hero() {
  const { personalInfo } = portfolioData;

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 text-center"
      >
        <h1 className="text-4xl md:text-7xl font-bold dark:text-white">
          {personalInfo.name}
        </h1>

        <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4 max-w-2xl">
          <TextGenerateEffect words={personalInfo.summary} />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Button asChild size="lg">
            <Link
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </Link>
          </Button>
          <Button variant="secondary" asChild size="lg">
            <Link
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Link>
          </Button>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

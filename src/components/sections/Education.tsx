"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioData } from "@/lib/data";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function Education() {
  const { education } = portfolioData;

  return (
    <section id="education" className="w-full py-12 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Pendidikan
        </h2>
        <div className="flex justify-center">
          <Card className="max-w-xl w-full bg-background/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="p-3 border rounded-full">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {education.institution}
                </CardTitle>
                <p className="text-primary font-semibold">{education.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {education.duration}
                </p>
                <p className="text-sm text-muted-foreground">
                  {education.gpa}
                </p>
              </div>
            </CardHeader>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}

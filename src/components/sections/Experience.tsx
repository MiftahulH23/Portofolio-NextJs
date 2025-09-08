"use client"; // Diperlukan untuk hook dan event handler Framer Motion

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioData } from "@/lib/data";
import { motion } from "framer-motion"; // Import motion
import { Briefcase } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="w-full py-12 md:py-24 lg:py-32">
      {/* Tambahkan motion.div di sini */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16">
          Pengalaman Kerja
        </h2>
        <div className="relative max-w-3xl mx-auto pl-8">
          {/* ... sisa kode timeline tidak berubah ... */}
          <div className="absolute left-0 top-0 h-full w-0.5 bg-border transform translate-x-[11.5px]"></div>

          {portfolioData.workExperience.map((job, index) => (
            <div key={index} className="relative mb-10">
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                <Briefcase className="h-3 w-3 text-primary" />
              </div>

              <Card className="ml-12">
                <CardHeader>
                  <p className="text-sm text-muted-foreground -mt-1 mb-2">
                    {job.duration}
                  </p>
                  <CardTitle>
                    <h3 className="text-xl font-semibold">{job.position}</h3>
                    <p className="text-base font-normal text-primary">
                      {job.company}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-left">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {job.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

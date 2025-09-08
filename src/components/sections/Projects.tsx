import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { portfolioData } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="w-full py-12 md:py-24 lg:py-32">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
        Proyek Pilihan
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {portfolioData.projects.map((project, index) => (
          <Card
            key={index}
            className="flex flex-col hover:border-primary transition-all duration-300 bg-background/20 backdrop-blur-sm"
          >
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="font-semibold text-primary pt-1">
                {project.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

"use client";
import { portfolioData } from "@/lib/data";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

export default function Projects() {
  return (
    <section id="projects" className="py-20 w-full">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          Proyek Unggulan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioData.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                   {project.image ? (
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                   ) : (
                      <span>No Image Available</span>
                   )}
                </div>
                
                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                   <a 
                     href={project.github} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110"
                   >
                     <Github size={22}/>
                   </a>
                   <a 
                     href={project.demo} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="p-3 bg-blue-600/80 backdrop-blur-md border border-blue-500/50 rounded-full text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                   >
                     <ExternalLink size={22}/>
                   </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow relative z-10 bg-white dark:bg-neutral-900">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                </div>
                
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex-grow line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                     <span className="text-xs px-2 py-1 text-neutral-500">+{project.technologies.length - 4}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
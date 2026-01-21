"use client";
import { portfolioData } from "@/lib/data";
import { motion } from "framer-motion";

export default function Skills() {
  const categories = Object.entries(portfolioData.skills);

  return (
    <section id="skills" className="py-20 w-full">
      <div className="max-w-5xl mx-auto px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-neutral-900 dark:text-white">
          Tech Stack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {categories.map(([category, items], idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors duration-500 shadow-sm hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-200 mb-6 relative z-10 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {category}
              </h3>
              
              <div className="flex flex-wrap gap-3 relative z-10">
                {items.map((skill, sIdx) => (
                  <div 
                    key={sIdx} 
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-neutral-800 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 transition-all duration-300 cursor-default group/item"
                  >
                    <img 
                      src={skill.icon} 
                      alt={skill.name} 
                      className="w-5 h-5 object-contain opacity-70 group-hover/item:opacity-100 transition-opacity" 
                    />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";
import { motion } from "framer-motion";

import { GeometricArt } from "@/components/ui/GeometricArt";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-12 flex items-center justify-center overflow-hidden bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 relative z-10">
        
        {/* Left Content */}
        <div className="lg:col-span-4 flex flex-col justify-center items-start z-20 order-2 lg:order-1 mt-8 lg:mt-0">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-foreground tracking-tight"
          >
            Hey There,<br />I'm Miftahul
          </motion.h1>
          <motion.a 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            href="mailto:miftahul@email.com" 
            className="text-accent font-semibold hover:underline underline-offset-4 mb-16 lg:mb-32 tracking-wide"
          >
            miftahulh942@gmail.com
          </motion.a>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center gap-3 mt-auto"
          >
            <span className="text-5xl font-bold text-foreground">1</span>
            <span className="text-xs font-bold text-muted-foreground uppercase leading-[1.2] w-24 tracking-widest">
              YEARS<br/>EXPERIENCE
            </span>
          </motion.div>
        </div>

        {/* Center Interactive Globe */}
        <div className="lg:col-span-5 flex justify-center items-center relative z-10 order-1 lg:order-2 h-[50vh] lg:h-[75vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full relative cursor-grab active:cursor-grabbing"
          >
             <div className="absolute inset-0 flex items-center justify-center">
                <GeometricArt />
             </div>
          </motion.div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 flex flex-col justify-between items-end text-right z-20 order-3 lg:pt-24 lg:pb-16">
          <motion.p 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-muted-foreground font-medium text-sm leading-relaxed max-w-[200px]"
          >
            I design beautifully simple things, And I love what I do.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
            className="relative w-36 h-36 flex flex-col items-center justify-center rounded-full mt-12 lg:mt-auto"
          >
            <div className="absolute inset-0 rounded-full border border-border animate-[spin_20s_linear_infinite] border-dashed"></div>
            <div className="absolute inset-2 rounded-full border border-border/50"></div>
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center mb-2">
                <span className="text-background text-[10px]">✨</span>
            </div>
            <span className="text-center font-bold text-[8px] uppercase tracking-widest text-foreground">
               CERTIFIED<br/>PROFESSIONAL<br/>DEVELOPER
            </span>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
"use client";
import { motion } from "framer-motion";

export function GeometricArt() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Orbital rings */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[380px] h-[380px] rounded-full border border-primary/20 border-dashed"
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute w-[280px] h-[280px] rounded-full border border-secondary/30"
      />

      {/* Floating Elements */}
      {/* 1. Pill shape */}
      <motion.div 
        animate={{ y: [-15, 15, -15], rotate: [-10, -5, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[20%] w-24 h-12 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/30 shadow-lg"
      />
      
      {/* 2. Circle shape */}
      <motion.div 
        animate={{ y: [15, -15, 15], x: [-10, 10, -10] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[15%] w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 shadow-lg"
      />

      {/* 3. Center Main Card */}
      <motion.div 
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-48 h-64 rounded-3xl bg-card/60 backdrop-blur-xl border border-border shadow-2xl flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
        {/* Abstract shapes inside card */}
        <div className="flex flex-col gap-4 items-center w-full px-6">
          <div className="w-16 h-16 rounded-full bg-secondary shadow-inner"></div>
          <div className="w-full h-3 rounded-full bg-muted"></div>
          <div className="w-3/4 h-3 rounded-full bg-muted"></div>
        </div>
      </motion.div>

      {/* 4. Small accent star/plus */}
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-[35%] left-[25%] text-accent text-2xl"
      >
        ✦
      </motion.div>
    </div>
  );
}

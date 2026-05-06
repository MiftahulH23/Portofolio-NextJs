"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Lanyard() {
  const { data: portfolioData, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for the drag position
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Apply looser spring physics so it feels like a heavy badge on a string
  const springX = useSpring(dragX, { stiffness: 40, damping: 5, mass: 1.2 });
  const springY = useSpring(dragY, { stiffness: 40, damping: 5, mass: 1.2 });

  // Calculate rotation to make it swing wildly like a pendulum
  const rotateZ = useTransform(springX, [-300, 300], [-45, 45]);

  // Add subtle 3D tilt effect when dragged
  const rotateX = useTransform(springY, [-300, 300], [25, -25]);
  const rotateY = useTransform(springX, [-300, 300], [-25, 25]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] flex justify-center items-start pt-[120px] overflow-visible perspective-[1000px] cursor-grab active:cursor-grabbing"
    >
      {/* The Strings (Lanyard) */}
      {/* We use SVG lines that connect from off-screen top to the top of the dragged card */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
        {/* Left strap (Lanyard fabric) */}
        <motion.line
          x1="calc(50% - 40px)" // Neck position
          y1="-100"
          x2={useTransform(springX, (v) => `calc(50% + ${v}px)`)}
          y2={useTransform(springY, (v) => `calc(110px + ${v}px)`)}
          stroke="#1a1a1c"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Right strap */}
        <motion.line
          x1="calc(50% + 40px)"
          y1="-100"
          x2={useTransform(springX, (v) => `calc(50% + ${v}px)`)}
          y2={useTransform(springY, (v) => `calc(110px + ${v}px)`)}
          stroke="#151517"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </svg>

      {/* The ID Card */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.9}
        style={{
          x: dragX,
          y: dragY,
          rotateZ,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-[260px] h-[360px] bg-gradient-to-b from-[#161616] to-[#0c0c0c] border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center"
      >
        {/* Plastic Lanyard Clip at the top */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-8 flex flex-col items-center z-20">
          {/* Metal ring/hook */}
          <div className="w-6 h-5 border-[3px] border-[#555] rounded-full mb-[-8px] shadow-sm" />
          {/* Plastic badge holder clip */}
          <div className="w-14 h-4 bg-gradient-to-b from-[#222] to-[#111] rounded-t-md border border-white/10 flex justify-center items-center shadow-xl">
            <div className="w-5 h-1.5 rounded-full bg-black/80 shadow-inner border border-white/5" />
          </div>
        </div>

        <div className="w-full h-full p-6 flex flex-col rounded-2xl overflow-hidden relative">
          {/* Subtle Holographic Shine Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

          {/* Header */}
          <div className="text-center mt-4">
            <span className="text-[9px] font-bold tracking-[0.3em] text-emerald-400 uppercase">
              VIP ACCESS
            </span>
            <div className="mt-3 w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-[#222] to-[#111] border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden">
               {/* Small glow behind initials */}
               <div className="absolute inset-0 bg-purple-500/20 blur-md pointer-events-none" />
               <span className="text-2xl font-black tracking-tighter text-white relative z-10">MH</span>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 text-center z-10">
            <h3 className="text-xl font-bold text-[#e8e8e8] tracking-tight">{portfolioData.personalInfo.name}</h3>
            <p className="text-[10px] text-[#888] font-semibold tracking-[0.2em] uppercase mt-1.5">
              Software Engineer
            </p>
          </div>

          <div className="mt-auto space-y-4 w-full z-10">
            {/* Fake Barcode */}
            <div className="w-full h-10 bg-[#000000] border border-white/5 rounded-md flex items-center justify-between px-2 opacity-80 pointer-events-none">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="h-full bg-[#555] rounded-full"
                  style={{
                    width: `${Math.abs(Math.sin(i * 12.34)) * 3 + 1}px`,
                    opacity: Math.abs(Math.cos(i * 43.21)) * 0.5 + 0.5,
                  }}
                />
              ))}
            </div>

            {/* Drag Hint */}
            <p className="text-[9px] text-[#555] text-center font-bold tracking-widest uppercase animate-pulse pointer-events-none">
              Drag to interact
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

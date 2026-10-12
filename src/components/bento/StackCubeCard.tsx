"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useCanUseWebGL } from "@/hooks/useCanUseWebGL";
import { StackCubeCss } from "@/components/three/StackCubeCss";
import { BentoCard } from "./BentoCard";

const StackCube = dynamic(() => import("@/components/three/StackCube"), { ssr: false, loading: () => null });

export function StackCubeCard() {
  const { content, ui } = useLanguage();
  const webgl = useCanUseWebGL();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "200px" });
  const visible = useInView(ref);

  return (
    <BentoCard cols={4} rows={3} reveal={false} className="flex items-center justify-center bg-ink-900">
      <span className="absolute left-6 top-[22px] font-mono text-xs text-ink-300">{ui.cube.file}</span>
      {webgl && <span className="absolute bottom-[22px] right-6 font-mono text-xs text-ink-300">{ui.cube.drag}</span>}
      <div aria-hidden="true" className="absolute size-[330px] animate-spin-slow rounded-full border border-dashed border-ink-500">
        <span className="absolute -top-[5px] left-1/2 size-2.5 rounded-full bg-lime shadow-[0_0_16px_#A3E635]" />
      </div>
      <div aria-hidden="true" className="absolute size-[250px] animate-spin-slow rounded-full border border-ink-600 [animation-direction:reverse] [animation-duration:11s]">
        <span className="absolute -bottom-1 left-[30%] size-2 rounded-full bg-ink-50" />
      </div>
      <div ref={ref} role="img" aria-label={ui.cube.aria} className="relative z-10 size-[260px] cursor-grab active:cursor-grabbing">
        {webgl && seen ? <StackCube faces={content.cubeFaces} active={visible} /> : <StackCubeCss faces={content.cubeFaces} />}
      </div>
    </BentoCard>
  );
}

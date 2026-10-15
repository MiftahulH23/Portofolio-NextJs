"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useCanUseWebGL } from "@/hooks/useCanUseWebGL";
import { CubeErrorBoundary } from "@/components/three/CubeErrorBoundary";
import { FloatingIconsCss } from "@/components/three/FloatingIconsCss";
import { BentoCard } from "./BentoCard";

const FloatingIcons = dynamic(() => import("@/components/three/FloatingIcons"), { ssr: false, loading: () => null });

export function FloatingIconsCard() {
  const { ui } = useLanguage();
  const webgl = useCanUseWebGL();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "200px" });
  const visible = useInView(ref);
  const [contextLost, setContextLost] = useState(false);
  const css = <FloatingIconsCss />;
  const use3d = webgl && seen && !contextLost;

  return (
    <BentoCard cols={4} rows={3} reveal={false} className="relative flex items-center justify-center overflow-hidden bg-ink-900">
      <span className="absolute left-6 top-[22px] z-10 font-mono text-xs text-ink-300">{ui.icons.file}</span>
      {use3d && <span className="absolute bottom-[22px] right-6 z-10 font-mono text-xs text-ink-300">{ui.icons.hint}</span>}
      <div aria-hidden="true" className="pointer-events-none absolute size-[330px] animate-spin-slow rounded-full border border-dashed border-ink-500" />
      <div ref={ref} aria-hidden="true" className="absolute inset-0">
        {use3d ? (
          <CubeErrorBoundary fallback={css}>
            <FloatingIcons active={visible} onContextLost={() => setContextLost(true)} />
          </CubeErrorBoundary>
        ) : (
          css
        )}
      </div>
    </BentoCard>
  );
}

"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useCallback } from "react"; // Tambahkan useCallback

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  // Bungkus addAnimation dengan useCallback
  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      scrollerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "normal" : "reverse"
      );

      scrollerRef.current.style.setProperty(
        "--animation-duration",
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s"
      );

      setStart(true);
    }
  }, [direction, speed]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]); // Tambahkan addAnimation ke dependency array

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationDirection: "var(--animation-direction, normal)",
        }}
      >
        {items.map(
          (
            item // Hapus 'idx' yang tidak terpakai
          ) => (
            <li
              className="w-auto max-w-full shrink-0 rounded-md border border-border bg-card px-8 py-4 flex items-center justify-center"
              key={item.name} // Gunakan key yang unik
            >
              <span className="relative z-20 text-md leading-[1.6] font-semibold text-foreground">
                {item.name}
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

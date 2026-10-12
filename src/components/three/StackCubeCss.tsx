const TRANSFORMS = [
  "rotateY(0deg)",
  "rotateY(90deg)",
  "rotateY(180deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
];

export function StackCubeCss({ faces }: { faces: string[] }) {
  return (
    <div className="flex size-full items-center justify-center [perspective:900px]">
      <div className="relative size-[170px] animate-cube [transform-style:preserve-3d]">
        {faces.slice(0, 6).map((label, i) => (
          <div
            key={label}
            className={
              i === 0
                ? "absolute inset-0 flex items-center justify-center border border-lime bg-lime font-mono text-[17px] font-medium text-ink-950"
                : "absolute inset-0 flex items-center justify-center border border-ink-500 bg-[rgba(24,24,28,0.86)] font-mono text-[17px] font-medium text-ink-50"
            }
            style={{ transform: `${TRANSFORMS[i]} translateZ(85px)` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

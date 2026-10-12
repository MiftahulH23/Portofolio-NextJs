const FACES = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)"];

export function WireCube({ speed = 10 }: { speed?: number }) {
  return (
    <div aria-hidden="true" className="size-11 [perspective:300px]">
      <div className="relative size-full animate-cube [transform-style:preserve-3d]" style={{ animationDuration: `${speed}s` }}>
        {FACES.map((t) => (
          <span key={t} className="absolute inset-0 border-[1.5px] border-lime" style={{ transform: `${t} translateZ(22px)` }} />
        ))}
      </div>
    </div>
  );
}

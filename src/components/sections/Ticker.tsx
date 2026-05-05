"use client";

const items = [
  "LET'S TALK",
  "BASED IN RIAU, INDONESIA",
  "AVAILABLE FOR FREELANCE",
  "FULL-STACK DEVELOPER",
  "LARAVEL & REACT SPECIALIST",
  "OPEN TO OPPORTUNITIES",
  "LET'S TALK",
  "BASED IN RIAU, INDONESIA",
  "AVAILABLE FOR FREELANCE",
  "FULL-STACK DEVELOPER",
  "LARAVEL & REACT SPECIALIST",
  "OPEN TO OPPORTUNITIES",
];

const Star = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline-block mx-5 flex-shrink-0">
    <path d="M5 0L5.98 3.97L10 5L5.98 6.03L5 10L4.02 6.03L0 5L4.02 3.97L5 0Z" fill="#444444" />
  </svg>
);

export default function Ticker() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden bg-[#080808]/80 backdrop-blur-md border-b border-[#111111]/50">
      <div className="ticker-track py-3">
        {items.map((item, i) => (
          <span key={i} className="flex items-center flex-shrink-0 text-[10px] font-bold tracking-[0.2em] text-[#333333] uppercase whitespace-nowrap">
            {item}
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}

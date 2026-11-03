"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");

function Unit({ value, unit }: { value: string; unit: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Each digit group flips in when its value changes.
  useGSAP(
    () => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo(ref.current, { yPercent: -35, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out" });
    },
    { dependencies: [value] },
  );

  return (
    <div className="flex flex-col gap-2.5 overflow-hidden rounded-lg bg-electric-deep px-4 py-[18px]">
      <span ref={ref} className="text-[clamp(44px,6vw,104px)] leading-[0.8] tracking-[-0.06em] tabular-nums">
        {value}
      </span>
      <span className="text-base text-on-electric">{unit}</span>
    </div>
  );
}

export function Countdown({ start }: { start: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const left = now === null ? null : Math.max(0, Date.parse(start) - now);
  const days = left === null ? null : Math.floor(left / 86_400_000);

  const units =
    left === null
      ? [["–", "days"], ["–", "hours"], ["–", "minutes"], ["–", "seconds"]]
      : [
          [String(days), days === 1 ? "day" : "days"],
          [pad(Math.floor(left / 3_600_000) % 24), "hours"],
          [pad(Math.floor(left / 60_000) % 60), "minutes"],
          [pad(Math.floor(left / 1000) % 60), "seconds"],
        ];

  return (
    <div role="timer" aria-live="off" className="grid grid-cols-4 gap-2">
      {units.map(([value, unit]) => (
        <Unit key={unit.replace(/s$/, "")} value={value} unit={unit} />
      ))}
    </div>
  );
}

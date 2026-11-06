"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MOTION_OK } from "@/lib/gsap";

// Seconds each photo stays up.
const HOLD = 1.6;

export type RotatingPhoto = { src: string; alt: string };

/**
 * Photos that keep easing from one to the next while they're on screen, filling their tile, always on
 * the same beat. `active` picks which set to show, for a tile with more than one, and only takes effect
 * on the next beat: scrolling slides tiles under a still mouse, which would otherwise swap the photo
 * early. Reduced motion stays on the first photo of the set.
 */
export function PhotoRotation({ sets, active = 0, sizes }: { sets: RotatingPhoto[][]; active?: number; sizes: string }) {
  const [shown, setShown] = useState({ set: active, frame: 0 });
  const box = useRef<HTMLDivElement>(null);
  const wanted = useRef(active);

  useEffect(() => {
    wanted.current = active;
  }, [active]);

  useEffect(() => {
    if (!box.current) return;
    const still = !window.matchMedia(MOTION_OK).matches;
    const beat = () => setShown(({ frame }) => ({ set: wanted.current, frame: still ? 0 : frame + 1 }));
    let timer: number | undefined;
    const watch = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(beat, HOLD * 1000);
    });
    watch.observe(box.current);
    return () => {
      window.clearInterval(timer);
      watch.disconnect();
    };
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      {sets.map((set, tile) =>
        set.map((photo, i) => {
          const on = tile === shown.set && i === shown.frame % set.length;
          return (
            <div key={photo.src} className={`absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${on ? "opacity-100" : "opacity-0"}`}>
              <Image src={photo.src} alt={on ? photo.alt : ""} fill sizes={sizes} className="object-cover" />
            </div>
          );
        }),
      )}
    </div>
  );
}

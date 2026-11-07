"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// Seconds from one photo to the next, and of that the slide itself. The same pace as PhotoSlides.
const BEAT = 3.6;
const SLIDE = 1;

export type RotatingPhoto = { src: string; alt: string };

/**
 * Photos that keep sliding in from the right, each pushing the last one out to the left, while they're
 * on screen, filling their tile, always on the same beat. `active` picks which set to show, for a tile
 * with more than one, and only takes effect on the next beat: scrolling slides tiles under a still mouse,
 * which would otherwise swap the photo early. Reduced motion stays on the first photo of the set, and
 * fades when the set changes.
 */
export function PhotoRotation({ sets, active = 0, sizes }: { sets: RotatingPhoto[][]; active?: number; sizes: string }) {
  const [first] = useState(active);
  const [shown, setShown] = useState({ set: active, frame: 0 });
  const box = useRef<HTMLDivElement>(null);
  const wanted = useRef(active);
  const showing = useRef<HTMLElement | null>(null);

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
      if (entry.isIntersecting) timer = window.setInterval(beat, BEAT * 1000);
    });
    watch.observe(box.current);
    return () => {
      window.clearInterval(timer);
      watch.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const next = box.current?.querySelector<HTMLElement>("[data-on]");
      const last = showing.current;
      if (!next || next === last) return;
      showing.current = next;
      if (!last) return;
      if (window.matchMedia(MOTION_OK).matches) {
        const slide = { duration: SLIDE, ease: "power3.inOut", overwrite: true };
        gsap.to(last, { xPercent: -100, ...slide });
        gsap.fromTo(next, { xPercent: 100, opacity: 1 }, { xPercent: 0, ...slide });
      } else {
        gsap.to(last, { opacity: 0, duration: 0.3, overwrite: true });
        gsap.to(next, { opacity: 1, duration: 0.3, overwrite: true });
      }
    },
    { dependencies: [shown], scope: box },
  );

  return (
    <div ref={box} className="absolute inset-0">
      {sets.map((set, tile) =>
        set.map((photo, i) => {
          const on = tile === shown.set && i === shown.frame % set.length;
          return (
            // Only the first photo shows until the slides take over the rest.
            <div key={photo.src} data-on={on || undefined} className={`absolute inset-0 ${tile === first && i === 0 ? "" : "opacity-0"}`}>
              <Image src={photo.src} alt={on ? photo.alt : ""} fill sizes={sizes} className="object-cover" />
            </div>
          );
        }),
      )}
    </div>
  );
}

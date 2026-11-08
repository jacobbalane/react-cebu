"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Photos that swipe on their own, left or up, one every few seconds, each new photo
 * pushing the last one out like a carousel. Every slider runs on the same cycle from
 * page load, so a `delay` keeps a set of them swiping in order. A whole section pauses
 * together while it's off screen, so they stay in that order. Reduced motion keeps the
 * first photo.
 */
export function PhotoSlides({
  photos,
  alt,
  direction = "left",
  delay = 0,
  sizes,
  className = "aspect-[16/10]",
  phone,
}: {
  photos: string[];
  alt: string;
  direction?: "left" | "up";
  /** Seconds this slider swipes after the others on the same cycle. */
  delay?: number;
  sizes: string;
  /** Sizing for the frame: a 16:10 card by default, or e.g. `absolute inset-0` to fill a grid tile. */
  className?: string;
  /** A different direction or delay below 768px, where cards often stack in one column. */
  phone?: { direction?: "left" | "up"; delay?: number };
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>("img", ref.current);
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, small: "(max-width: 767px)" }, (context) => {
        if (!context.conditions?.motion) return;
        const onPhone = Boolean(context.conditions.small && phone);
        const axis = (onPhone ? (phone?.direction ?? direction) : direction) === "up" ? "yPercent" : "xPercent";
        gsap.set(slides, { [axis]: (i: number) => (i === 0 ? 0 : 100), opacity: 1 });
        const swipe = { duration: 1, ease: "power3.inOut", immediateRender: false };
        const tl = gsap.timeline({ repeat: -1, delay: onPhone ? (phone?.delay ?? delay) : delay });
        slides.forEach((slide, i) => {
          const next = slides[(i + 1) % slides.length];
          tl.to({}, { duration: 2.6 })
            .fromTo(slide, { [axis]: 0 }, { [axis]: -100, ...swipe })
            .fromTo(next, { [axis]: 100 }, { [axis]: 0, ...swipe }, "<");
        });
        const section = ref.current?.closest("section");
        const watch = new IntersectionObserver(([entry]) => tl.paused(!entry.isIntersecting));
        if (section) watch.observe(section);
        return () => {
          watch.disconnect();
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`tile bg-fog ${className}`}>
      {photos.map((photo, i) => (
        <Image
          key={photo + i}
          src={`/images/${photo}.jpg`}
          alt={i === 0 ? alt : ""}
          fill
          sizes={sizes}
          // Only the first photo shows until the slider takes over the rest.
          className={`object-cover ${i === 0 ? "" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}

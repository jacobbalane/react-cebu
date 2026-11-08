"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * The marquee's photos, eight to a row. Each has ready-made 480 and 800px WebP copies in
 * public/images/wall, in greys like every opener's photo, made by scripts/wall-photos.mjs from
 * public/images; run it after changing this list.
 */
export const marqueePhotos = [
  "first-meetup-group", "peace-pair", "gatsby-speaker", "table-laptops", "sticker-lid", "peace-window", "coffee-stickers", "company-slide-group",
  "the-company-group", "table-trio", "native-speaker", "coding-row", "mentor-macbook", "projector-smile", "terminal-hands", "gatsby-students",
  "first-meetup-room", "desk-row", "big-group", "zero-to-hero-speaker", "laptop-plant", "hello-react-cebu", "small-group", "gatsby-hand-up",
  "reactivate-group", "screen-trio", "glasses-smile", "iced-coffee-coder", "team-huddle", "workshop-window", "gatsby-workshop-group", "blue-shirts-group",
];

const PHONE = "(max-width: 767px)";
// Wider screens show the tilted wall instead, so they take this transparent pixel and download nothing.
const NOTHING = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * The homepage hero's background on phones, in place of the tilted wall, which was more than a
 * phone could redraw. Four flat rows of photos drift sideways, neighbouring rows in opposite
 * directions, and scrolling speeds them up for a moment. The rows sink slower than the page as you
 * scroll away. They pause off screen, and reduced motion keeps them still.
 */
export function HeroMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const rows = [0, 1, 2, 3].map((row) => marqueePhotos.slice(row * 8, row * 8 + 8));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${PHONE} and ${MOTION_OK}`, () => {
        const section = ref.current?.closest("section");
        gsap.to(ref.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });

        const loops = gsap.utils.toArray<HTMLElement>("[data-marquee-track]", ref.current).map((track, i) => {
          const left = i % 2 === 0;
          return gsap
            .fromTo(track, { xPercent: left ? 0 : -50 }, { xPercent: left ? -50 : 0, duration: 60, ease: "none", repeat: -1 })
            .progress((i * 0.29) % 1);
        });
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 7);
            loops.forEach((loop) => {
              gsap.killTweensOf(loop, "timeScale");
              loop.timeScale(boost);
              gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out" });
            });
          },
        });
        const watch = new IntersectionObserver(([entry]) => loops.forEach((loop) => loop.paused(!entry.isIntersecting)));
        if (ref.current) watch.observe(ref.current);
        return () => watch.disconnect();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <>
      <div ref={ref} aria-hidden="true" className="absolute inset-0 flex flex-col gap-2 overflow-hidden py-2 md:hidden">
        {rows.map((row, r) => (
          <div key={r} className="min-h-0 flex-1">
            {/* Two copies, so moving by one copy's width loops without a gap. */}
            <div data-marquee-track className="flex h-full w-max gap-2">
              {[0, 1].map((copy) =>
                row.map((name) => {
                  const base = `/images/wall/${name}`;
                  return (
                    <div key={`${copy}-${name}`} className="aspect-[4/3] h-full shrink-0 overflow-hidden bg-[#111]">
                      <picture>
                        <source media="(min-width: 768px)" srcSet={NOTHING} />
                        {/* A tile is about a third of the screen's height wide. */}
                        <img
                          src={`${base}-480.webp`}
                          srcSet={`${base}-480.webp 480w, ${base}-800.webp 800w`}
                          sizes="36vh"
                          alt=""
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </picture>
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Dims the grey photos as much as the openers' brightness(.45), then darkens the lower half
          more, so the white copy reads. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/55 md:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-45% to-transparent md:hidden" />
    </>
  );
}

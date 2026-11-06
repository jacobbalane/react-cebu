"use client";

import Image from "next/image";
import { useRef } from "react";
import { LoopVideo } from "@/components/loop-video";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const firstRow = [
  { src: "/images/audience.jpg", alt: "An audience watching a talk" },
  { video: "/videos/workshop.mp4", alt: "Developers working together at a workshop" },
  { src: "/images/speaker.jpg", alt: "A speaker presenting to a room" },
  { src: "/images/crowd.jpg", alt: "A crowd at a meetup" },
  { src: "/images/laptops.jpg", alt: "A small group on laptops around a table" },
  { src: "/images/presenter.jpg", alt: "A presenter at the front of a room" },
];

const secondRow = [
  { src: "/images/workshop.jpg", alt: "Developers at a workshop table" },
  { src: "/images/coder.jpg", alt: "A developer at work" },
  { video: "/videos/hacktoberfest.mp4", alt: "A team gathered around one laptop" },
  { src: "/images/react-code.jpg", alt: "React code on a screen" },
  { src: "/images/audience.jpg", alt: "An audience watching a talk" },
  { src: "/images/speaker.jpg", alt: "A speaker presenting to a room" },
];

/**
 * The pause between what a partner gives and what they get: a look at the nights it pays for.
 * Two rows slide past each other as the page scrolls. They arrive grey, and turn to full colour as
 * they come up the screen.
 */
export function Interlude() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const box = ref.current;
      if (!box) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const [upper, lower] = gsap.utils.toArray<HTMLElement>("[data-row]", box);
        const spare = (row: HTMLElement) => row.scrollWidth - window.innerWidth;
        const line = gsap.timeline({ scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
        line.fromTo(upper, { x: 0 }, { x: () => -spare(upper), ease: "none" }, 0);
        line.fromTo(lower, { x: () => -spare(lower) }, { x: 0, ease: "none" }, 0);
        // Full colour by the time the rows sit in the middle of the screen.
        gsap.fromTo("[data-frame]", { filter: "grayscale(1)" }, { filter: "grayscale(0)", ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "center center", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const row = (items: typeof firstRow) => (
    <div data-row className="flex w-max gap-2 px-2">
      {items.map((item, i) => (
        <div key={i} data-frame className="tile aspect-[3/2] h-[max(11rem,21vw)] shrink-0 bg-black motion-safe:grayscale">
          {item.video ? <LoopVideo src={item.video} label={item.alt} /> : <Image src={item.src ?? ""} alt={item.alt} fill sizes="(min-width: 1024px) 32vw, 70vw" className="object-cover" />}
        </div>
      ))}
    </div>
  );

  return (
    <section aria-label="Photos and film from past events" className="pb-32">
      <div ref={ref} className="flex flex-col gap-2 overflow-hidden">
        {row(firstRow)}
        {row(secondRow)}
      </div>
    </section>
  );
}

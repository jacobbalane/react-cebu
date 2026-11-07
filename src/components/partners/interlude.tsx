"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const firstRow = [
  { src: "/images/thumbs-up.jpg", alt: "Three members giving a thumbs up at their desks" },
  { src: "/images/mentor-lean.jpg", alt: "A mentor leaning in to point something out on a laptop" },
  { src: "/images/workshop-banners.jpg", alt: "Members at their laptops in front of event banners" },
  { src: "/images/zero-to-hero-group.jpg", alt: "A large group posing together in an office" },
  { src: "/images/workshop-window.jpg", alt: "Members at their laptops beside a bright window" },
  { src: "/images/projector-smile.jpg", alt: "A member smiling beside a projector at the Gatsby workshop" },
  { src: "/images/desk-smiles.jpg", alt: "Two members smiling at the camera from their desks" },
  { src: "/images/desk-peace.jpg", alt: "Two members at their desks, one smiling and making a peace sign" },
];

const secondRow = [
  { src: "/images/laptop-desk.jpg", alt: "A member working at a bright desk with two laptops" },
  { src: "/images/coding-desk.jpg", alt: "A member typing on a laptop at a long desk" },
  { src: "/images/projector-speaker.jpg", alt: "A speaker pointing at a slide, lit by the projector" },
  { src: "/images/sticker-coder.jpg", alt: "A member concentrating behind a laptop covered in stickers" },
  { src: "/images/talking-hands.jpg", alt: "A member talking with clasped hands" },
  { src: "/images/denim-smile.jpg", alt: "A member in a denim jacket smiling at a laptop" },
  { src: "/images/workshop-smiles.jpg", alt: "Three members turning from their laptops to smile" },
  { src: "/images/desks-group.jpg", alt: "A big group posing behind a row of desks" },
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
          <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 38vw, 85vw" className="object-cover" />
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

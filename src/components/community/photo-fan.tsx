"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const photos = [
  { src: "/images/laptops.jpg", alt: "People working on laptops" },
  { src: "/images/presenter.jpg", alt: "A speaker presenting to a group at a meetup" },
  { src: "/images/speaker.jpg", alt: "A speaker presenting to a room" },
  { src: "/images/students.jpg", alt: "Students working on laptops" },
  { src: "/images/coder.jpg", alt: "A developer coding in a dim room" },
];

const MIDDLE = (photos.length - 1) / 2;
// For each place a card sits from the middle: how far it leans, in degrees, and how far it hangs down.
const LEAN = 5;
const DROP = 16;
// How much of the card before it each card keeps clear of.
const SHOWING = 0.84;
// The card under the pointer rises, straightens and grows a little, and ends up this far clear of
// the card that was covering it.
const LIFT = 18;
const GROW = 1.05;
const GAP = 8;

const layer = (i: number) => photos.length - Math.abs(i - MIDDLE);

/**
 * A pile of photos that fans out as it comes up the screen, the middle cards first, and closes
 * again on the way back. Hover a card and it rises, straightens and slides out from under the one
 * covering it, while the others stay put.
 *
 * A layer can't be eased, so raising a card would make it pop in front of its neighbours. But every
 * card already lies over the one outside it, so sliding outwards frees it with no change of layer.
 * Which card is picked comes from the pointer's place along the fan, not what's under it, so a
 * moving card can't flicker it. With reduced motion the fan is simply open.
 */
export function PhotoFan() {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", stage.current);
      // Close enough that all of them fit on a phone, and never so far apart that they stop overlapping.
      const spread = () => {
        const width = cards[0].offsetWidth;
        return Math.min(width * SHOWING, (window.innerWidth - width - 16) / (photos.length - 1));
      };
      const fanned = (i: number) => ({
        x: () => (i - MIDDLE) * spread(),
        y: Math.abs(i - MIDDLE) * DROP,
        rotation: (i - MIDDLE) * LEAN,
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const opening = gsap.timeline({
          scrollTrigger: { trigger: stage.current, start: "top 90%", end: "center 50%", scrub: 0.6, invalidateOnRefresh: true },
        });
        cards.forEach((card, i) => {
          opening.fromTo(
            card,
            { x: 0, y: 40, rotation: (i - MIDDLE) * 1.5 },
            { ...fanned(i), duration: 1, ease: "power2.out" },
            Math.abs(i - MIDDLE) * 0.08,
          );
        });

        const box = stage.current;
        if (!box) return;
        const faces = cards.map((card) => card.querySelector<HTMLElement>("[data-face]"));
        // Far enough to clear the card covering this one, counting how far that card's corner leans out.
        const slideOut = (i: number) => {
          const { offsetWidth: width, offsetHeight: height } = cards[0];
          const coveringLean = ((Math.abs(i - MIDDLE) - 1) * LEAN * Math.PI) / 180;
          return Math.sign(i - MIDDLE) * ((width * (1 + GROW)) / 2 - spread() + (height / 2) * Math.sin(coveringLean) + GAP);
        };

        let picked: number | null = null;
        const pick = (next: number | null) => {
          if (next === picked) return;
          const leaving = picked;
          picked = next;
          [leaving, next].forEach((i) => {
            if (i === null) return;
            const isPicked = i === next;
            gsap.to(faces[i], {
              x: isPicked ? slideOut(i) : 0,
              y: isPicked ? -LIFT : 0,
              rotation: isPicked ? (MIDDLE - i) * LEAN : 0,
              scale: isPicked ? GROW : 1,
              duration: isPicked ? 0.45 : 0.6,
              ease: "power3.out",
              overwrite: true,
            });
          });
        };

        const track = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const { left, width } = box.getBoundingClientRect();
          const fromMiddle = event.clientX - (left + width / 2);
          const gap = spread();
          const pastTheEnds = Math.abs(fromMiddle) > MIDDLE * gap + cards[0].offsetWidth / 2;
          pick(pastTheEnds ? null : gsap.utils.clamp(0, photos.length - 1, Math.round(fromMiddle / gap + MIDDLE)));
        };
        const leave = () => pick(null);
        box.addEventListener("pointermove", track);
        box.addEventListener("pointerleave", leave);
        return () => {
          box.removeEventListener("pointermove", track);
          box.removeEventListener("pointerleave", leave);
        };
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        cards.forEach((card, i) => gsap.set(card, fanned(i)));
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  return (
    <section aria-label="Photos from React Cebu events" className="overflow-hidden pb-32">
      {/* As tall as a card plus the room its lean and drop need. */}
      <div ref={stage} className="grid h-[calc(clamp(9.375rem,26vw,28.75rem)*1.25+4rem)] place-items-center">
        {photos.map((photo, i) => (
          <div key={photo.src} data-card style={{ zIndex: layer(i) }} className="relative col-start-1 row-start-1 aspect-[4/5] w-[clamp(9.375rem,26vw,28.75rem)]">
            {/* The shadow only shows where the cards lie over each other. A landscape photo fills
                the portrait card by its height, so it's drawn about twice the card's width. */}
            <div data-face className="tile size-full bg-fog shadow-[0_4px_8px_rgba(0,0,0,0.1),0_24px_48px_rgba(0,0,0,0.16)]">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1770px) 920px, (min-width: 577px) 52vw, 300px" className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Children marked with data-reveal rise into place in small staggered
 * batches the first time they scroll into view.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
        gsap.set(items, { y: 56, autoAlpha: 0 });
        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

type HeadingTag = "h1" | "h2" | "h3";

/**
 * How a heading animates in, after Magic UI's TextAnimate. "rise" slides whole lines up
 * from behind a mask; the rest animate each piece from the state below back to rest.
 */
export type HeadingAnimation = "rise" | "blurInUp" | "blurIn" | "slideUp" | "slideLeft" | "scaleUp" | "fadeIn";
/** The pieces a heading is split into before it animates. */
export type HeadingSplit = "line" | "word" | "character";

const FROM: Record<Exclude<HeadingAnimation, "rise">, gsap.TweenVars> = {
  blurInUp: { autoAlpha: 0, filter: "blur(12px)", yPercent: 40 },
  blurIn: { autoAlpha: 0, filter: "blur(12px)" },
  slideUp: { autoAlpha: 0, yPercent: 60 },
  slideLeft: { autoAlpha: 0, xPercent: 40 },
  scaleUp: { autoAlpha: 0, scale: 0.5 },
  fadeIn: { autoAlpha: 0 },
};
// The resting value of every property a preset can start from.
const REST: gsap.TweenVars = { autoAlpha: 1, filter: "blur(0px)", yPercent: 0, xPercent: 0, scale: 1 };

// Smaller pieces move quicker and closer together, so a heading takes about as long
// whichever way it is split. `spread` caps the whole stagger for long headings.
const TIMING: Record<HeadingSplit, { duration: number; stagger: number; spread: number }> = {
  line: { duration: 1, stagger: 0.1, spread: 0.4 },
  word: { duration: 0.8, stagger: 0.05, spread: 0.7 },
  character: { duration: 0.6, stagger: 0.025, spread: 0.9 },
};

/**
 * A heading that animates in, piece by piece, as it enters the viewport. Short headings
 * go by character; page titles (h1) default to words, which reads better for long lines.
 */
export function SplitHeading({
  as: Tag = "h2",
  animation = "blurInUp",
  by = Tag === "h1" ? "word" : "character",
  className,
  id,
  children,
}: {
  as?: HeadingTag;
  animation?: HeadingAnimation;
  by?: HeadingSplit;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scrollTrigger = { trigger: ref.current, start: "top 88%", once: true };
        const split =
          animation === "rise"
            ? SplitText.create(ref.current, {
                type: "lines",
                mask: "lines",
                linesClass: "split-line",
                autoSplit: true,
                // Lines start 150% down: the mask keeps room under each line for descenders,
                // and any less lets the tops of tall letters peek through that gap.
                onSplit: (self) =>
                  gsap.from(self.lines, { yPercent: 150, duration: 1, ease: "power4.out", stagger: 0.08, scrollTrigger }),
              })
            : SplitText.create(ref.current, {
                // Characters stay grouped in words, so a word never breaks across lines.
                type: by === "line" ? "lines" : by === "word" ? "words" : "words, chars",
                autoSplit: true,
                onSplit: (self) => {
                  const pieces = by === "line" ? self.lines : by === "word" ? self.words : self.chars;
                  const from = FROM[animation];
                  const to = Object.fromEntries(Object.keys(from).map((key) => [key, REST[key]]));
                  const { duration, stagger, spread } = TIMING[by];
                  return gsap.fromTo(pieces, from, {
                    ...to,
                    duration,
                    ease: "power3.out",
                    stagger: Math.min(stagger, spread / pieces.length),
                    clearProps: "filter",
                    scrollTrigger,
                  });
                },
              });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [animation, by] },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

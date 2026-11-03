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

/** A heading whose lines slide up from behind a mask as it enters the viewport. */
export function SplitHeading({
  as: Tag = "h2",
  className,
  id,
  children,
}: {
  as?: HeadingTag;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 1,
              ease: "power4.out",
              stagger: 0.08,
              scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
            }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

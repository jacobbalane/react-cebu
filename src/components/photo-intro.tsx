"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion";

/**
 * A page that opens on one full-bleed photo, set like the homepage hero: the title rises line by
 * line in white at the bottom left, the description follows it in, and the photo sinks slower
 * than the page as you scroll away. They stack on phones.
 */
export function PhotoIntro({
  title,
  description,
  src,
  alt,
}: {
  title: string;
  description: string;
  src: string;
  alt: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The photo grows more than it moves, so its top edge never comes into view.
        gsap.to("[data-intro-photo]", {
          scale: 1.2,
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.from("[data-intro-fade]", { y: 30, autoAlpha: 0, duration: 1, ease: "power3.out", delay: 0.45 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="page-title"
      className="relative flex h-[max(640px,100svh)] flex-col justify-end overflow-hidden bg-black px-4 pb-6 text-white md:px-10 md:pb-10"
    >
      <div data-intro-photo className="absolute inset-0">
        <Image src={src} alt={alt} fill preload sizes="100vw" className="object-cover" />
      </div>
      {/* Darkens the lower half so the white copy reads over any photo; the faces above stay clear. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-45% to-transparent"
      />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-16">
        <SplitHeading
          as="h1"
          id="page-title"
          animation="rise"
          by="line"
          className="display m-0 text-balance text-[clamp(44px,6.4vw,112px)] leading-[0.92]"
        >
          {title}
        </SplitHeading>
        <p data-intro-fade className="m-0 max-w-[34ch] text-[clamp(18px,1.5vw,22px)] leading-snug text-white/80 lg:pb-2">
          {description}
        </p>
      </div>
    </section>
  );
}

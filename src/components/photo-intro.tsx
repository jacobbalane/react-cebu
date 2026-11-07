"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { ColourTrail } from "@/components/community/colour-trail";
import { SplitHeading } from "@/components/motion";

/**
 * A page that opens on one full-bleed photo, set like the homepage hero: the title rises line by
 * line in white at the bottom left, the description follows it in, and the photo sinks slower
 * than the page as you scroll away. They stack on phones. The photo is grey, and the pointer leaves
 * a trail of its colour. `position` sets which part of the photo shows,
 * and any children sit under the description. `align="right"` stacks the words in the bottom right.
 */
export function PhotoIntro({
  title,
  description,
  src,
  alt,
  position,
  align = "left",
  children,
}: {
  title: React.ReactNode;
  description: string;
  src: string;
  alt: string;
  position?: string;
  align?: "left" | "right";
  children?: React.ReactNode;
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
      className="relative flex h-[max(640px,100svh)] touch-pan-y flex-col justify-end overflow-hidden bg-black px-4 pb-6 text-white md:px-10 md:pb-10"
    >
      <div data-intro-photo className="absolute inset-0">
        <Image src={src} alt={alt} fill preload sizes="(max-width: 767px) 400vw, (max-width: 1023px) 240vw, (max-width: 1279px) 140vw, 100vw" style={{ objectPosition: position }} className="object-cover motion-safe:brightness-[.45] motion-safe:grayscale" />
        <ColourTrail />
      </div>
      {/* Darkens the lower half so the white copy reads over any photo; the faces above stay clear. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-45% to-transparent"
      />

      <div className={`relative ${align === "right" ? "flex flex-col items-end gap-6 text-right" : "grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-16"}`}>
        <SplitHeading
          as="h1"
          id="page-title"
          animation="rise"
          by="line"
          className="display m-0 text-balance text-[clamp(2.75rem,6.4vw,7rem)] leading-[0.92]"
        >
          {title}
        </SplitHeading>
        <div data-intro-fade className={`flex flex-col gap-5 ${align === "right" ? "" : "lg:pb-2"}`}>
          <p className="m-0 max-w-[34ch] text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug text-white/80">{description}</p>
          {children && <div className="flex flex-wrap gap-2">{children}</div>}
        </div>
      </div>
    </section>
  );
}

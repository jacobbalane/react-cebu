"use client";

import { useRef } from "react";
import { SplitHeading } from "@/components/motion";
import { TransitionLink } from "@/components/page-transition";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** The number cut out of the first meetup's group photo, which slides inside it as the pointer moves. */
export function NotFoundPage() {
  const number = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const box = number.current;
      if (!box) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const place = { x: 50, y: 40 };
        const draw = () => {
          box.style.backgroundPosition = `${place.x}% ${place.y}%`;
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          gsap.to(place, { x: (event.clientX / innerWidth) * 100, y: 20 + (event.clientY / innerHeight) * 50, duration: 0.8, ease: "power3.out", overwrite: true, onUpdate: draw });
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: number },
  );

  return (
    <section aria-labelledby="missing-title" className="flex min-h-svh flex-col justify-center gap-8 px-4 pb-24 pt-28 md:px-10">
      <p ref={number} aria-hidden="true" className="m-0 select-none bg-clip-text text-center text-[clamp(9rem,36vw,36rem)] font-medium leading-[0.84] tracking-[-0.06em] text-transparent" style={{ backgroundImage: "url(/images/first-meetup-group.jpg)", backgroundSize: "130% auto", backgroundPosition: "50% 40%" }}>
        404
      </p>
      <div className="flex flex-col items-center text-center">
        <SplitHeading as="h1" id="missing-title" className="display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]">This page isn’t here, but everyone else is.</SplitHeading>
        <p className="m-0 mt-3 text-base text-muted">The link may be old or mistyped.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <TransitionLink href="/" className="btn btn-primary">Go to the homepage</TransitionLink>
          <TransitionLink href="/events" className="btn btn-quiet">See upcoming events</TransitionLink>
        </div>
      </div>
    </section>
  );
}

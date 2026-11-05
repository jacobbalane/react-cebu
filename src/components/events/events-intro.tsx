"use client";

import Image from "next/image";
import { useRef } from "react";
import { SplitHeading } from "@/components/motion";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const PHOTO = "/images/audience.jpg";
// A hard edge, with a pixel of softness so the circle doesn't look jagged.
const lens = "radial-gradient(circle at var(--x, 50%) var(--y, 45%), #000 var(--r, 200vmax), transparent calc(var(--r, 200vmax) + 1px))";

/**
 * The room sits in grey shadow, and a clean circle of full colour follows the pointer around it.
 * With reduced motion the room is simply in colour.
 */
export function EventsIntro() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const box = ref.current;
      const lit = box?.querySelector<HTMLElement>("[data-lit]");
      if (!box || !lit) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { x: 50, y: 42, r: 0 };
        const paint = () => {
          lit.style.setProperty("--x", `${state.x}%`);
          lit.style.setProperty("--y", `${state.y}%`);
          lit.style.setProperty("--r", `${state.r}vmax`);
        };
        paint();
        gsap.to(state, { r: 15, duration: 1.2, ease: "power3.out", delay: 0.3, onUpdate: paint });
        const follow = (event: PointerEvent) => {
          const { left, top, width, height } = box.getBoundingClientRect();
          gsap.to(state, { x: ((event.clientX - left) / width) * 100, y: ((event.clientY - top) / height) * 100, duration: 0.5, ease: "power3.out", overwrite: "auto", onUpdate: paint });
        };
        box.addEventListener("pointermove", follow);
        return () => box.removeEventListener("pointermove", follow);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="page-title"
      className="relative flex h-[max(640px,100svh)] flex-col items-center justify-end gap-5 overflow-hidden bg-black px-4 pb-20 text-center text-white md:pb-24"
    >
      <div className="absolute inset-0">
        <Image src={PHOTO} alt="An audience watching a talk" fill preload sizes="100vw" className="object-cover brightness-[.45] grayscale" />
      </div>
      <div data-lit aria-hidden="true" className="absolute inset-0" style={{ maskImage: lens, WebkitMaskImage: lens }}>
        <Image src={PHOTO} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      {/* Darkens the lower half so the white copy reads wherever the circle goes. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-45% to-transparent" />

      <SplitHeading as="h1" id="page-title" animation="rise" by="line" className="display relative m-0 text-balance text-[clamp(2.75rem,6.4vw,7rem)] leading-[0.92]">
        Come to the next one.
      </SplitHeading>
      {/* A sentence to each row, where there's room for them. */}
      <p className="relative m-0 text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug text-white/80">
        Free meetups, workshops and code camps around Cebu. <br className="max-sm:hidden" />
        Everyone is welcome, whatever your level.
      </p>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const milestones = [
  { month: "Where it started", year: "2019", title: "The first meetup", text: "More than 50 developers came to The Company Cebu for the first React Cebu meetup.", tone: "bg-react text-black" },
  { month: "October", year: "2019", title: "Gatsby workshop", text: "A hands-on workshop at the Go Negosyo Center, UP Cebu.", tone: "bg-fog text-black" },
  { month: "October", year: "2025", title: "Cebu Hacktoberfest", text: "Co-led by JavaScript Cebu with PizzaPy and Ethereum Philippines: talks, workshops and hack nights all month.", tone: "bg-black text-white" },
  { month: "Now", year: "2026", title: "A new home online", text: "The site you’re looking at, built by members with Next.js.", tone: "bg-azure text-white" },
];

/**
 * On large screens the section pins and scrolling down moves the milestones
 * sideways. Everywhere else, and with reduced motion, it is a plain grid.
 */
export function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth + 16;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="history-title" className="overflow-hidden px-2 pb-28 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pb-0">
      <h2 id="history-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">How we got here</h2>
      <ol
        ref={track}
        aria-label="React Cebu timeline"
        className="motion-safe:lg:flex motion-safe:lg:w-max grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
      >
        {milestones.map((m) => (
          <li
            key={m.title}
            className={`tile flex min-h-[320px] flex-col justify-between gap-8 p-7 lg:min-h-[460px] motion-safe:lg:w-[min(560px,42vw)] motion-safe:lg:shrink-0 ${m.tone}`}
          >
            <span className="flex flex-col gap-2">
              <span className="text-lg opacity-85">{m.month}</span>
              <span className="text-[clamp(72px,7vw,128px)] leading-[0.8] tracking-[-0.06em]">{m.year}</span>
            </span>
            <span className="flex flex-col gap-2.5">
              <span className="text-[32px] leading-[1.02] tracking-[-0.035em]">{m.title}</span>
              <span className="text-[17px] leading-[1.45] opacity-85">{m.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

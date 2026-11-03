"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const milestones = [
  { month: "Occaecat cupidatat non", year: "2019", title: "Proident sunt culpa", text: "Qui officia deserunt mollit anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing.", tone: "bg-sky text-black" },
  { month: "Elit", year: "2019", title: "Sed do", text: "Eiusmod tempor incididunt ut labore et dolore magna aliqua enim.", tone: "bg-fog text-black" },
  { month: "Ad", year: "2025", title: "Minim veniam", text: "Quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit.", tone: "bg-black text-white" },
  { month: "Voluptate", year: "2026", title: "Velit esse cillum fugiat", text: "Nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa.", tone: "bg-electric text-white" },
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
      <h2 id="history-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Qui officia deserunt mollit</h2>
      <ol
        ref={track}
        aria-label="Aliqua enim ad"
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

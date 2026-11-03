"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Reveal, SplitHeading } from "@/components/motion";
import { eventShortDate, upcomingEvents } from "@/data/events";

function Arrow({ className = "bg-white text-black" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-14 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M8 7h9v9" />
      </svg>
    </span>
  );
}

/** The closing call to action: one statement and three ways in. */
export function JoinCta() {
  const ref = useRef<HTMLElement>(null);
  const next = upcomingEvents[0];

  // The atom in the statement tile turns as the section scrolls past.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-atom]",
          { rotate: -40, scale: 0.9 },
          { rotate: 140, scale: 1.08, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="join" aria-labelledby="join-title" className="scroll-mt-20 px-2 pb-2">
      <Reveal className="grid auto-rows-[minmax(240px,auto)] gap-2 lg:auto-rows-[minmax(220px,auto)] lg:grid-cols-12">
        <div data-reveal className="tile relative flex flex-col justify-between gap-10 bg-black p-7 text-white sm:p-10 lg:col-span-8 lg:row-span-3">
          <svg
            data-atom
            aria-hidden="true"
            viewBox="-50 -50 100 100"
            className="pointer-events-none absolute -bottom-40 -right-40 size-[440px] text-[#262626] sm:size-[560px]"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <ellipse rx="44" ry="17" />
              <ellipse rx="44" ry="17" transform="rotate(60)" />
              <ellipse rx="44" ry="17" transform="rotate(120)" />
            </g>
            <circle r="3.5" fill="#1e4dff" />
          </svg>
          <SplitHeading id="join-title" by="word" className="relative m-0 max-w-[13ch] text-[clamp(44px,6.6vw,108px)] font-normal leading-[0.94] tracking-[-0.05em]">
            Build what’s next with React Cebu. <span className="text-soft">Free, friendly, and open to every level.</span>
          </SplitHeading>
          <div className="relative flex flex-wrap items-center gap-4">
            <span className="flex">
              {[1, 2, 3, 4].map((n, i) => (
                <Image
                  key={n}
                  src={`/images/portrait-${n}.jpg`}
                  alt=""
                  width={52}
                  height={52}
                  className={`size-[52px] rounded-full border-2 border-black object-cover ${i ? "-ml-4" : ""}`}
                />
              ))}
            </span>
            <span className="max-w-[30ch] text-base leading-snug text-[#bdbdbd]">
              Students, career-shifters and working engineers already meet here every month.
            </span>
          </div>
        </div>

        <a href="#facebook" data-reveal className="tile group flex flex-col justify-between gap-6 bg-electric p-7 text-white transition-colors duration-300 hover:bg-midnight lg:col-span-4">
          <span className="flex items-start justify-between gap-4">
            <span className="text-[clamp(32px,3vw,44px)] leading-[1.02] tracking-[-0.04em]">Join the Facebook group</span>
            <Arrow />
          </span>
          <span className="text-base leading-snug text-on-electric">Event announcements, questions, job posts and the occasional meme.</span>
        </a>

        <Link href={`/events/${next.slug}`} data-reveal className="tile group flex flex-col justify-between gap-6 bg-sky p-7 text-black lg:col-span-4">
          <span className="flex items-start justify-between gap-4">
            <span className="text-[clamp(44px,4vw,64px)] leading-[0.85] tracking-[-0.06em]">{eventShortDate(next.start)}</span>
            <Arrow className="bg-ink text-white" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[15px]">Next event, free</span>
            <span className="text-xl leading-tight tracking-[-0.02em]">{next.title}</span>
          </span>
        </Link>

        <Link href="/speak" data-reveal className="tile group flex flex-col justify-between gap-6 bg-fog p-7 text-black transition-colors duration-300 hover:bg-[#e0e0e0] lg:col-span-4">
          <Arrow className="bg-ink text-white" />
          <span className="flex flex-col gap-1">
            <span className="text-[28px] leading-none tracking-[-0.035em]">Give a talk</span>
            <span className="text-[15px] text-[#555]">First-timers welcome</span>
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

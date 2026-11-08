"use client";

import { useRef } from "react";
import { SplitHeading } from "@/components/motion";
import { REPORT_EMAIL } from "@/data/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * The fine print, on a fog panel: black is kept for the footer and the closing card. As the list
 * comes on screen the rules sharpen into ink one after another, the way the homepage's manifesto
 * reads, at a pace of their own. With reduced motion they're simply there.
 */
export function CodeOfConduct({ rules }: { rules: string[] }) {
  const rows = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>("[data-rule]", rows.current),
          { opacity: 0.12, filter: "blur(4px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2,
            clearProps: "filter",
            scrollTrigger: { trigger: rows.current, start: "top 85%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: rows },
  );

  return (
    <section id="code-of-conduct" aria-labelledby="coc-title" className="scroll-mt-16 px-2 pb-32 max-md:pb-20">
      <div className="grid gap-10 rounded-[0.75rem] bg-fog p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
        <div className="flex flex-col gap-6">
          <SplitHeading id="coc-title" className="display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]">Code of conduct</SplitHeading>
          <p className="m-0 max-w-[46ch] text-lg leading-normal text-muted">
            If something makes you uncomfortable at an event or online, tell any organizer or email{" "}
            <a href={REPORT_EMAIL} className="text-azure-deep">
              react@jscebu.org
            </a>
            . We read every report.
          </p>
          <a href={REPORT_EMAIL} className="btn btn-black self-start">
            Report a problem
          </a>
        </div>
        {/* Spread over the column, so the first rule lines up with the heading and the last with the button. */}
        <ul ref={rows} className="m-0 flex list-none flex-col justify-between gap-5 p-0">
          {rules.map((rule) => (
            // On phones each rule wraps onto two lines, so a faint line between them keeps them apart.
            <li
              key={rule}
              data-rule
              className="text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15] tracking-[-0.03em] max-md:border-t max-md:border-line max-md:pt-5 max-md:first:border-t-0 max-md:first:pt-0"
            >
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

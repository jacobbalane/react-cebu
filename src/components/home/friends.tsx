"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { friends, venues } from "@/data/site";

const rows = [
  { items: friends.slice(0, 4), reverse: false, tone: "bg-fog text-black", invite: false },
  { items: [...friends.slice(4), ...venues], reverse: true, tone: "bg-black text-white", invite: true },
];

/**
 * Two rows of friends drift in opposite directions. Scrolling speeds them up
 * and scrolling back up reverses them, so the band follows your scroll.
 */
export function Friends() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loops = gsap.utils.toArray<HTMLElement>("[data-track]").map((track) => {
          const reverse = track.dataset.track === "reverse";
          return gsap.fromTo(
            track,
            { xPercent: reverse ? -50 : 0 },
            { xPercent: reverse ? 0 : -50, duration: 40, ease: "none", repeat: -1 },
          );
        });

        let direction = 1;
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            direction = self.direction;
            const boost = direction * (1 + Math.min(Math.abs(self.getVelocity()) / 200, 10));
            loops.forEach((loop) => {
              gsap.killTweensOf(loop, "timeScale");
              loop.timeScale(boost);
              gsap.to(loop, { timeScale: direction, duration: 1.4, ease: "power2.out" });
            });
          },
        });

        // Hovering a row slows it right down so a name can be read or clicked.
        const rowsEls = gsap.utils.toArray<HTMLElement>("[data-row]");
        const handlers = rowsEls.map((row, i) => {
          const enter = () => gsap.to(loops[i], { timeScale: 0.15 * direction, duration: 0.6 });
          const leave = () => gsap.to(loops[i], { timeScale: direction, duration: 0.6 });
          row.addEventListener("pointerenter", enter);
          row.addEventListener("pointerleave", leave);
          return () => {
            row.removeEventListener("pointerenter", enter);
            row.removeEventListener("pointerleave", leave);
          };
        });
        return () => handlers.forEach((off) => off());
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="friends-title" className="overflow-hidden pb-32">
      <h2 id="friends-title" className="mb-6 px-6 text-center text-[15px] font-normal text-muted">
        Sint occaecat cupidatat
      </h2>

      <div className="flex flex-col gap-2">
        {rows.map((row, r) => (
          <div key={r} data-row className="overflow-hidden">
            <ul
              data-track={row.reverse ? "reverse" : "forward"}
              className="flex w-max motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:gap-2 motion-reduce:px-2"
            >
              {[0, 1].map((copy) =>
                [...row.items, ...(row.invite ? [null] : [])].map((item, i) =>
                  item ? (
                    <li
                      key={`${copy}-${item.name}`}
                      aria-hidden={copy === 1}
                      className={`tile mr-2 flex h-[120px] shrink-0 items-center px-10 motion-reduce:mr-0 text-[clamp(28px,3vw,44px)] tracking-[-0.035em] transition-colors duration-300 hover:bg-electric hover:text-white sm:h-[150px] ${row.tone} ${copy === 1 ? "motion-reduce:hidden" : ""}`}
                      style={{ fontWeight: item.weight }}
                    >
                      {item.name}
                    </li>
                  ) : (
                    <li key={`${copy}-you-${i}`} aria-hidden={copy === 1} className={`mr-2 shrink-0 motion-reduce:mr-0 ${copy === 1 ? "motion-reduce:hidden" : ""}`}>
                      <Link
                        href="/partners"
                        tabIndex={copy === 1 ? -1 : undefined}
                        className="tile flex h-[120px] items-center gap-4 bg-electric px-10 text-[clamp(28px,3vw,44px)] tracking-[-0.035em] text-white transition-colors duration-300 hover:bg-midnight sm:h-[150px]"
                      >
                        Non proident sunt
                        <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-white text-black">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </span>
                      </Link>
                    </li>
                  ),
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

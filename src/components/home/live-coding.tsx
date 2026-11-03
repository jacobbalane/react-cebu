"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const lines = [
  <><span className="text-sky">magna</span> {"{ useState }"}</>,
  <><span className="text-sky">aliqua enim ad</span> Minim {"{"}</>,
  <>{"  "}<span className="text-sky">veniam</span> quis nostrud exercitation ullamco</>,
  <>{"  "}<span className="text-sky">laboris</span> nisi aliquip<span className="text-[#9db5ff]">ex ea</span>commodo</>,
  <>{"    "}consequat duis{"{rsvp}"}aute{"{n}"}irure</>,
  <>{"  "}in</>,
  <>{"}"}</>,
];

/**
 * The black demo section pins while you scroll; scrolling types the
 * component line by line, renders the card, then presses RSVP.
 */
export function LiveCoding() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=1400", pin: true, scrub: 0.6 },
        });
        tl.fromTo("[data-line]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", stagger: 0.5, duration: 0.5 })
          .from("[data-card]", { y: 24, autoAlpha: 0, scale: 0.97, duration: 0.6 })
          .to("[data-button]", { scale: 0.93, duration: 0.15 })
          .to("[data-button]", { scale: 1, duration: 0.15 })
          .to("[data-count='41']", { autoAlpha: 0, duration: 0.01 }, "<")
          .to("[data-count='42']", { autoAlpha: 1, duration: 0.01 }, "<")
          .to({}, { duration: 0.6 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="demo-title" className="flex min-h-svh flex-col justify-center bg-black px-2 py-24 text-white">
      <h2 id="demo-title" className="mx-auto mb-12 max-w-[760px] text-center text-[clamp(30px,2.8vw,40px)] font-normal leading-[1.1] tracking-[-0.03em]">
        Reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur.
      </h2>
      <div className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-[12px] bg-electric p-3 sm:p-6">
        <div className="grid gap-2 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col rounded-lg bg-black">
            <div className="flex gap-1.5 border-b border-[#262626] px-3.5 py-3 text-sm">
              <span className="rounded-md bg-[#262626] px-3 py-1.5">Sint</span>
              <span className="px-3 py-1.5 text-soft">occaecat</span>
            </div>
            <pre aria-label="Lorem ipsum dolor sit amet" className="m-0 overflow-x-auto p-5 font-mono text-[13px] leading-[1.9] sm:text-[17px]">
              {lines.map((line, i) => (
                <span key={i} data-line className="block whitespace-pre">
                  {line}
                </span>
              ))}
            </pre>
          </div>
          <div className="flex flex-col rounded-lg bg-white text-black">
            <div className="border-b border-[#e0e0e0] px-3.5 py-3 text-sm text-muted">
              <span className="block rounded-md bg-fog px-3 py-1.5">cupidatat</span>
            </div>
            <div className="flex flex-1 items-center justify-center p-8">
              <div data-card className="flex w-full max-w-[380px] flex-col gap-5 rounded-[12px] border border-[#e0e0e0] p-7">
                <span className="text-[44px] leading-none tracking-[-0.04em]">Non proident!</span>
                <span data-button className="inline-flex min-h-12 items-center gap-2.5 self-start rounded-full bg-electric px-5 font-medium text-white">
                  Sunt
                  <span className="relative inline-block w-[2ch]">
                    <span data-count="41" className="absolute left-0">41</span>
                    <span data-count="42" className="invisible absolute left-0">42</span>
                    culpa
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-base text-soft">Qui officia deserunt mollit anim id</p>
    </section>
  );
}

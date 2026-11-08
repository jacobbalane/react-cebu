"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SplitHeading } from "@/components/motion";
import { PARTNER_EMAIL } from "@/data/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const answers = [
  {
    question: "Will people know we helped?",
    answer: "Yes. Your logo goes on this page and on the opening slide of every event you support. The slide is up while people walk in and find a seat, so the room knows who helped before the first talk starts.",
  },
  {
    question: "Do we get to say anything?",
    answer: "You get a minute on stage before the talks. Say hello, tell the room what your team builds and whether you’re hiring. You don’t need slides, and anyone who wants to know more can come and find you afterwards.",
  },
  {
    question: "Can this help us hire?",
    answer: "It can. Share React roles in the group, with developers who already show up to learn. These are people who give up an evening to get better at this, so your post reaches the ones who care about the work.",
  },
  {
    question: "What do we have to show for it?",
    answer: "A recap with photos. After the event we share a write-up with your team named in it. It’s something your team can post, and something to show whoever signs off on the next one.",
  },
];

const photo = { src: "/images/company-banners-group.jpg", alt: "A group posing between two long tables, beside community banners" };

// A white corner that rounds off the fog where it meets the photo's cut-out.
const corner = "absolute size-3 bg-[radial-gradient(circle_at_100%_0,transparent_calc(0.75rem_-_0.5px),#fff_0.75rem)]";

/**
 * What a partner gets, as the four things their team will ask. The fog panel is cut away at the
 * bottom left and the photo sits in the cut, outside the panel. That side stays put until the
 * answers have all gone by, and the answers sharpen one after another once they're on screen.
 *
 * On phones the questions open and close, one at a time, so the section stays short: the first is
 * open to show how it works, and each answer eases open and shut.
 */
export function Perks() {
  const list = useRef<HTMLDListElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const shown = useRef(open);
  // Lays the answers out for the question that's open; set up on phones only.
  const apply = useRef<(animate: boolean) => void>(() => {});

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>("[data-answer]", list.current),
          { opacity: 0.12, filter: "blur(4px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out", stagger: 0.2, clearProps: "filter", scrollTrigger: { trigger: list.current, start: "top 85%", once: true } },
        );
      });
      mm.add("(max-width: 767px)", (context) => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", list.current);
        // Added to the context by name, so it hands back the wrapped function and the tweens it makes are undone with it.
        apply.current = context.add("lay", (animate: boolean) => {
          const calm = !window.matchMedia(MOTION_OK).matches;
          panels.forEach((panel, i) => {
            const show = i === shown.current;
            const to = { height: show ? "auto" : 0, opacity: show ? 1 : 0 };
            if (!animate || calm) gsap.set(panel, to);
            else gsap.to(panel, { ...to, duration: show ? 0.45 : 0.35, ease: show ? "power3.out" : "power3.inOut", overwrite: true });
          });
        }) as (animate: boolean) => void;
        apply.current(false);
        return () => {
          apply.current = () => {};
        };
      });
      return () => mm.revert();
    },
    { scope: list },
  );

  useEffect(() => {
    shown.current = open;
    apply.current(true);
  }, [open]);

  return (
    <section id="perks" aria-labelledby="perks-title" className="scroll-mt-24 px-2 pb-32 max-md:pb-20">
      <div className="grid rounded-[0.75rem] bg-fog lg:min-h-[36rem] lg:grid-cols-2">
        {/* The answers alone set the panel's height. This side fills it, or the screen when the answers run longer than that. */}
        <div className="relative">
          <div className="lg:absolute lg:inset-0 lg:pt-14">
            <div className="flex flex-col lg:sticky lg:top-24 lg:h-[min(100%,calc(100svh-6rem))]">
              <div className="flex flex-col items-start gap-6 px-6 pt-6 sm:px-10 sm:pt-10 lg:px-14 lg:pb-10 lg:pt-0">
                <SplitHeading id="perks-title" className="display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]">What partners get</SplitHeading>
                <p className="m-0 max-w-[34ch] text-lg leading-normal text-muted">The four things your team will ask before anyone says yes.</p>
                <a href={PARTNER_EMAIL} className="btn btn-black">Email us</a>
              </div>

              <div className="relative hidden min-h-0 flex-1 rounded-tr-[1.25rem] bg-white pr-2 pt-2 lg:block">
                <span aria-hidden="true" className={`${corner} bottom-full left-0`} />
                <span aria-hidden="true" className={`${corner} bottom-0 left-full`} />
                <div className="tile relative size-full bg-black">
                  <Image src={photo.src} alt={photo.alt} fill sizes="50vw" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <dl ref={list} className="m-0 flex flex-col gap-10 p-6 max-md:gap-6 sm:p-10 lg:gap-14 lg:p-14">
          {answers.map(({ question, answer }, i) => (
            <div key={question} data-answer className="flex flex-col gap-2 max-md:gap-0">
              <dt className="title text-[clamp(1.75rem,3vw,2.5rem)]">
                <span className="max-md:hidden">{question}</span>
                {/* On phones the question is the button that opens its answer. */}
                <button
                  type="button"
                  aria-expanded={open === i}
                  aria-controls={`perk-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  // The open question turns azure, its icon with it, and eases back to ink as it closes.
                  className={`flex w-full cursor-pointer items-start justify-between gap-4 text-left transition-colors duration-300 md:hidden ${open === i ? "text-azure" : ""}`}
                >
                  <span>{question}</span>
                  {/* A plus that turns into a cross as the answer opens, and back. */}
                  <span
                    aria-hidden="true"
                    className={`mt-[0.12em] grid size-[0.9em] shrink-0 place-items-center rounded-full text-white transition-[rotate,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${open === i ? "rotate-45 bg-azure" : "bg-ink"}`}
                  >
                    <svg viewBox="0 0 16 16" className="size-[55%]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M8 2v12M2 8h12" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd id={`perk-${i}`} data-panel className="m-0 max-md:overflow-hidden">
                <p className="m-0 max-w-[54ch] text-lg leading-normal text-muted max-md:pt-3">{answer}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="tile relative mt-2 aspect-[3/2] bg-black lg:hidden">
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
      </div>
    </section>
  );
}

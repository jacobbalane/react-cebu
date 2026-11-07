"use client";

import { useRef, useState } from "react";
import { Reveal, SplitHeading } from "@/components/motion";
import { TransitionLink } from "@/components/page-transition";
import { PhotoRotation } from "@/components/photo-rotation";
import { TALK_EMAIL } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const tileTitle = "title m-0 text-[clamp(2.25rem,4vw,3.75rem)]";
const tilePadding = "p-7 sm:p-10 lg:p-8 min-[88rem]:p-10";

// One set per tile, in tile order: people giving talks, then what a partner's room and snacks make possible.
const media = [
  [
    { src: "/images/gatsby-speaker.jpg", alt: "A speaker talking to a room beside a React Cebu banner" },
    { src: "/images/zero-to-hero-speaker.jpg", alt: "A speaker talking with both hands raised" },
    { src: "/images/blue-shirt-talk.jpg", alt: "A speaker in a blue shirt talking beside a projected slide" },
    { src: "/images/projector-speaker.jpg", alt: "A speaker pointing at a slide, lit by the projector" },
    { src: "/images/workshop-window.jpg", alt: "Members at their laptops beside a bright window" },
  ],
  [
    { src: "/images/laptop-trio.jpg", alt: "Three members working something out around a laptop" },
    { src: "/images/pizza.jpg", alt: "Boxes of pizza on a long table at a meetup" },
    { src: "/images/pizza-bite.jpg", alt: "A member grinning with a slice of pizza in their mouth" },
    { src: "/images/the-company-group.jpg", alt: "React Cebu members together at The Company Cebu" },
    { src: "/images/enspace-group.jpg", alt: "React Cebu members around a long wooden table at enspace" },
    { src: "/images/shirt-trio.jpg", alt: "Three members holding up shirts that read Learn, Code, Play, Repeat" },
    { src: "/images/table-laptops.jpg", alt: "Members coding around a long table in a bright office" },
    { src: "/images/company-room.jpg", alt: "Members around a curved table in a big room at night" },
  ],
];

// What a partner can bring, as the Partners page lists it. The first comes back at the end so the roll loops without a jump.
const offers = ["room", "projector", "Wi-Fi", "snacks", "drinks", "prizes", "swag", "stickers", "speakers", "mentors", "engineers", "time", "room"];

/** Rolls the word in the pill through what a partner can bring, with the pill easing to fit each one. */
function rollOffers(pill: HTMLElement, reel: HTMLElement) {
  const padding = parseFloat(getComputedStyle(pill).paddingLeft) * 2;
  const widths = gsap.utils.toArray<HTMLElement>("[data-offer]", reel).map((offer) => offer.offsetWidth + padding);
  gsap.set(pill, { width: widths[0] });

  let shown = 0;
  let next: gsap.core.Tween | undefined;
  const step = () => {
    shown += 1;
    const looped = shown === offers.length - 1;
    gsap.to(reel, {
      yPercent: (-100 * shown) / offers.length,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        if (!looped) return;
        shown = 0;
        gsap.set(reel, { yPercent: 0 });
      },
    });
    gsap.to(pill, { width: widths[shown], duration: 0.6, ease: "power3.inOut" });
    next = gsap.delayedCall(1.25, step);
  };

  // Stopping only cancels the next word, so a change already under way finishes and the pill rests on a whole word.
  const stop = () => next?.kill();
  const start = () => {
    stop();
    next = gsap.delayedCall(0.15, step);
  };
  return { start, stop };
}

/**
 * Two ways to give back, and each tile acts out its own line: the talk tile counts down its five
 * minutes, and the partner tile asks for everything an event runs on. The photos beside them roll
 * on by themselves, moving to the set for the tile being looked at on their next change.
 */
export function DoMore() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const box = ref.current;
      const clock = box?.querySelector<HTMLElement>("[data-clock]");
      const pill = box?.querySelector<HTMLElement>("[data-pill]");
      const reel = box?.querySelector<HTMLElement>("[data-reel]");
      if (!box || !clock || !pill || !reel) return;
      const roll = rollOffers(pill, reel);
      let wake = (tile: number, on: boolean) => void [tile, on];

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const time = { left: 300 };
        const show = () => {
          const seconds = Math.round(time.left);
          clock.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
        };

        wake = (tile, on) => {
          if (tile === 0) gsap.to(time, { left: on ? 0 : 300, duration: on ? 6 : 0.9, ease: on ? "none" : "power3.out", overwrite: true, onUpdate: show });
          else if (on) roll.start();
          else roll.stop();
        };

        // Touch screens have no hover: the clock runs once as the tiles arrive and resets after, and the words roll while on screen.
        const touch = !window.matchMedia("(hover: hover)").matches;
        const arrive = ScrollTrigger.create({
          trigger: box,
          start: "top 65%",
          once: true,
          onEnter: () => {
            if (!touch) return;
            wake(0, true);
            gsap.delayedCall(7.5, () => wake(0, false));
          },
        });
        const onScreen = ScrollTrigger.create({
          trigger: pill,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => {
            if (!isActive) wake(1, false);
            else if (touch) wake(1, true);
          },
        });
        return () => {
          arrive.kill();
          onScreen.kill();
          roll.stop();
          wake = () => {};
        };
      });

      const unlisten = gsap.utils.toArray<HTMLElement>("[data-tile]", box).map((tile, i) => {
        const enter = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          setActive(i);
          wake(i, true);
        };
        const leave = (event: PointerEvent) => {
          if (event.pointerType === "mouse") wake(i, false);
        };
        const focus = () => {
          setActive(i);
          wake(i, true);
        };
        const blur = () => wake(i, false);
        tile.addEventListener("pointerenter", enter);
        tile.addEventListener("pointerleave", leave);
        tile.addEventListener("focusin", focus);
        tile.addEventListener("focusout", blur);
        return () => {
          tile.removeEventListener("pointerenter", enter);
          tile.removeEventListener("pointerleave", leave);
          tile.removeEventListener("focusin", focus);
          tile.removeEventListener("focusout", blur);
        };
      });

      return () => {
        unlisten.forEach((remove) => remove());
        mm.revert();
      };
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="involved-title" className="px-2 pb-32">
      <SplitHeading id="involved-title" className="display m-0 mb-10 px-4 text-[clamp(2.5rem,4.2vw,3.75rem)]">
        Want to do more?
      </SplitHeading>
      <Reveal className="grid gap-2 lg:h-[clamp(30rem,66svh,38rem)] lg:grid-cols-12 lg:grid-rows-2">
        <div data-reveal className="tile min-h-[20rem] bg-black lg:col-span-5 lg:row-span-2 lg:min-h-0">
          <PhotoRotation sets={media} active={active} sizes="(min-width: 1024px) 42vw, 100vw" />
        </div>

        <div data-reveal data-tile className={`tile flex min-h-[16rem] flex-col justify-between gap-6 bg-react text-ink sm:flex-row lg:col-span-7 lg:min-h-0 ${tilePadding}`}>
          <div className="flex flex-col items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h3 className={tileTitle}>Give a talk</h3>
              <p className="m-0 max-w-[24ch] text-lg leading-normal">Five minutes, any topic, any level.</p>
            </div>
            <a href={TALK_EMAIL} className="btn btn-black">
              Email us a talk idea
            </a>
          </div>
          <span data-clock aria-hidden="true" className="title self-end text-[clamp(4rem,9vw,8.5rem)] tabular-nums">
            5:00
          </span>
        </div>

        <div data-reveal data-tile className={`tile flex min-h-[16rem] flex-col justify-between gap-6 bg-azure text-white sm:flex-row lg:col-span-7 lg:min-h-0 ${tilePadding}`}>
          {/* Holds its width, so a long word grows the pill into the space beside the button instead of reflowing the text. */}
          <div className="flex shrink-0 flex-col items-start justify-between gap-6 lg:gap-3">
            <div className="flex flex-col gap-2">
              <h3 className={tileTitle}>Partner with us</h3>
              <p className="m-0 max-w-[36ch] text-lg leading-normal">Every event runs on a borrowed room, donated snacks and volunteer time.</p>
            </div>
            <TransitionLink href="/partners#ways" className="btn btn-white">
              See ways to help
            </TransitionLink>
          </div>
          <span aria-hidden="true" className="title flex min-w-0 flex-col items-end gap-1 self-end text-[clamp(2.25rem,4.4vw,4.5rem)] leading-none">
            <span>Your</span>
            <span data-pill className="block h-[1.4em] overflow-hidden rounded-full bg-react px-[0.42em] text-ink">
              <span data-reel className="flex flex-col items-end">
                {offers.map((offer, i) => (
                  <span key={i} data-offer className="block h-[1.4em] leading-[1.4em]">
                    {offer}?
                  </span>
                ))}
              </span>
            </span>
          </span>
        </div>
      </Reveal>
    </section>
  );
}

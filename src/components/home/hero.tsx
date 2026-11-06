"use client";

import { TransitionLink } from "@/components/page-transition";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { TiltedTiles, type Tile } from "@/components/tilted-tiles";
import { FACEBOOK_URL } from "@/data/site";

const photo = (name: string): Tile => ({ kind: "photo", src: `/images/${name}.jpg` });

/**
 * One headline phrase in its own mask, so it slides up from below on load. The
 * breaks are set by hand: automatic line splitting re-wrapped them by width.
 * `inline` phrases share a line from tablet up and stack on phones.
 */
function Line({ children, inline = false }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <span className={`split-line-mask block overflow-clip ${inline ? "md:inline-block md:align-top" : ""}`}>
      <span data-hero-line className="block">
        {children}
      </span>
    </span>
  );
}

// Photos only: flat text tiles read as stray gray boxes once the wall is muted. One line per set of
// ten, each a mix of groups, talks, faces and details, as a column shows one set.
const tiles: Tile[] = [
  "first-meetup-group", "laughing-pair", "peace-smile", "gatsby-speaker", "table-laptops", "sticker-lid", "desk-room", "side-smile", "coffee-stickers", "blue-wall-talk",
  "the-company-group", "table-trio", "peace-signs", "native-speaker", "coding-row", "pizza", "mentor-macbook", "chin-laugh", "terminal-hands", "gatsby-students",
  "first-meetup-room", "desk-pair", "big-group", "zero-to-hero-speaker", "laptop-plant", "hello-react-cebu", "shirt-mentor", "maroon-smile", "thumbs-up", "gatsby-hand-up",
  "reactivate-group", "whiteboard-pair", "glasses-smile", "what-is-react-cebu", "iced-coffee-coder", "sticker-coder", "team-huddle", "peace-wall", "desk-laugh", "gatsby-trio",
  "gatsby-group", "senior-coder", "black-tee-smile", "first-meetup-speaker", "focused-coders", "coding-desk", "desk-duo", "denim-smile", "lanyard-smile", "enspace-talk",
].map(photo);

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // As you scroll away, the wall sinks slower than the page while the copy scrolls
        // normally. The wall grows more than it moves, so its top edge never comes into view.
        gsap.to("[data-hero-wall]", {
          scale: 1.2,
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });

        // The headline rises line by line, then the rest follows it in. Lines start 150% down:
        // the mask keeps room under each line for descenders, and at 105% the tops of tall
        // letters peeked through that gap while waiting.
        gsap.from("[data-hero-line]", { yPercent: 150, duration: 1, ease: "power4.out", stagger: 0.08 });
        gsap.from("[data-hero-fade]", { y: 30, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.45 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative h-[max(720px,100svh)] overflow-hidden bg-black"
    >
      <div data-hero-wall className="absolute inset-0">
        <TiltedTiles tiles={tiles} />
      </div>
      {/* Mutes the wall to gray texture everywhere except a soft window on the right,
          where photos drifting through regain their colour and fade back as they leave.
          Blend layers rather than a backdrop filter, which Chrome redraws in bands while scrolling. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#808080] mix-blend-saturation [mask-image:radial-gradient(ellipse_36%_50%_at_74%_34%,transparent_40%,black_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/55 [mask-image:radial-gradient(ellipse_36%_50%_at_74%_34%,transparent_40%,black_100%)]"
      />
      {/* Darkens steadily with distance from the colour window, deepest in the far corner. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_74%_34%,transparent_18%,rgba(0,0,0,0.35)_42%,rgba(0,0,0,0.7)_72%,rgba(0,0,0,0.9)_100%)]"
      />
      <div aria-hidden="true" className="grain opacity-20" />
      {/* Darkens the corner behind the copy so white text stays readable over bright photos. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(0,0,0,0.75),transparent_70%)]" />

      <div className="absolute inset-x-4 bottom-6 flex flex-col items-start gap-6 text-white md:inset-x-10 md:bottom-10 md:gap-8">
        {/* Broken by phrase rather than by width, so no line ends mid-thought. */}
        <h1 id="hero-title" className="display m-0 text-[clamp(3rem,8.4vw,8.75rem)] leading-[0.92]">
          <Line>Build the web</Line>{" "}
          <Line>with React,</Line>{" "}
          <span className="block">
            <Line inline>right here</Line>{" "}
            <Line inline>in Cebu.</Line>
          </span>
        </h1>
        <p data-hero-fade className="m-0 max-w-[34ch] text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug text-[#b5b5b5]">
          A free community for developers, by developers, since 2019.
        </p>
        <div data-hero-fade className="flex flex-wrap gap-1.5">
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join React Cebu</a>
          <TransitionLink href="/events" className="btn btn-quiet">See upcoming events</TransitionLink>
        </div>
      </div>
    </section>
  );
}

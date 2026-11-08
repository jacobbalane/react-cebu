"use client";

import { TransitionLink } from "@/components/page-transition";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { TiltedTiles, type Tile } from "@/components/tilted-tiles";
import { FACEBOOK_URL } from "@/data/site";
import { HeroMarquee } from "@/components/home/hero-marquee";

const photo = (name: string): Tile => ({ kind: "photo", src: `/images/${name}.jpg` });

/**
 * One headline phrase in its own mask, so it slides up from below on load. The
 * breaks are set by hand: automatic line splitting re-wrapped them by width.
 * `inline` phrases share a line from tablet up and stack on phones.
 */
function Line({ children, inline = false }: { children: React.ReactNode; inline?: boolean }) {
  return (
    // With the tight tracking, a line's last letter pokes past its box, and the mask cut it: on phones
    // the widest line is "Build the web", and the mask cut the side off its "b". A little room on the
    // right keeps it whole. It needs ! as .split-line-mask sets its padding outside the layers.
    <span className={`split-line-mask block overflow-clip max-md:!pr-[0.12em] ${inline ? "md:inline-block md:align-top" : ""}`}>
      <span data-hero-line className="block">
        {children}
      </span>
    </span>
  );
}

// Photos only: flat text tiles read as stray gray boxes once the wall is muted. One line per set of
// ten, each a mix of groups, talks, faces and details, as a column shows one set.
const tiles: Tile[] = [
  "first-meetup-group", "peace-pair", "peace-smile", "gatsby-speaker", "table-laptops", "sticker-lid", "desk-room", "peace-window", "coffee-stickers", "company-slide-group",
  "the-company-group", "table-trio", "peace-signs", "native-speaker", "coding-row", "pizza", "mentor-macbook", "projector-smile", "terminal-hands", "gatsby-students",
  "first-meetup-room", "desk-row", "big-group", "zero-to-hero-speaker", "laptop-plant", "hello-react-cebu", "shirt-mentor", "small-group", "thumbs-up", "gatsby-hand-up",
  "reactivate-group", "screen-trio", "glasses-smile", "what-is-react-cebu", "iced-coffee-coder", "sticker-coder", "team-huddle", "peace-wall", "workshop-window", "gatsby-trio",
  "gatsby-workshop-group", "senior-coder", "black-tee-smile", "blue-shirt-talk", "workshop-banners", "coding-desk", "desk-duo", "denim-smile", "blue-shirts-group", "enspace-talk",
].map(photo);

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // As you scroll away, the wall sinks slower than the page while the copy scrolls
        // normally. The wall grows more than it moves, so its top edge never comes into view.
        // Touch screens skip the growing, as rescaling a wall this big is heavy for a phone.
        gsap.to("[data-hero-wall]", {
          scale: window.matchMedia("(pointer: coarse)").matches ? 1 : 1.2,
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
    // Phones get a lower floor: 720px is taller than an iPhone SE, which pushed the buttons below
    // the screen. The copy and buttons need about 500px with the header, so 520px still holds them.
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative h-[max(720px,100svh)] overflow-hidden bg-black max-md:h-[max(520px,100svh)]"
    >
      {/* The tilted wall and its shading, from tablets up. Phones get the marquee below instead: the
          wall was more than a phone could redraw, and flickered. */}
      <div className="contents max-md:hidden">
      <div data-hero-wall className="absolute inset-0">
        <TiltedTiles tiles={tiles} />
      </div>
      {/* Mutes the wall to gray texture everywhere except a soft window on the right, where photos
          drifting through regain their colour and fade back as they leave.
          Blend layers rather than a backdrop filter, which Chrome redraws in bands while scrolling. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#808080] mix-blend-saturation [@media(pointer:coarse)]:hidden [mask-image:radial-gradient(ellipse_36%_50%_at_74%_34%,transparent_40%,black_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/55 [@media(pointer:coarse)]:hidden [mask-image:radial-gradient(ellipse_36%_50%_at_74%_34%,transparent_40%,black_100%)]"
      />
      {/* Touch screens get the same darkness as one still layer, as blending and masking over a
          moving 3D wall means redrawing it every frame. The photos keep their colour under it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_36%_50%_at_74%_34%,transparent_40%,rgba(0,0,0,0.72)_100%)] [@media(pointer:coarse)]:block"
      />
      {/* Darkens steadily with distance from the colour window, deepest in the far corner. Desktop
          goes darker away from the window, as the user asked. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_74%_34%,transparent_18%,rgba(0,0,0,0.35)_42%,rgba(0,0,0,0.7)_72%,rgba(0,0,0,0.9)_100%)] lg:bg-[radial-gradient(ellipse_at_74%_34%,transparent_18%,rgba(0,0,0,0.42)_42%,rgba(0,0,0,0.82)_72%,rgba(0,0,0,0.96)_100%)]"
      />
      <div aria-hidden="true" className="grain opacity-20 [@media(pointer:coarse)]:hidden" />
      {/* Darkens the corner behind the copy so white text stays readable over bright photos. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(0,0,0,0.75),transparent_70%)]" />
      </div>
      <HeroMarquee />

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
          {/* Black, picked over fog, azure and greys. */}
          <TransitionLink href="/events" className="btn btn-black">
            See upcoming events
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

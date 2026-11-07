"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal, SplitHeading } from "@/components/motion";

function Photo({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(min-width: 1280px) 85vw, (min-width: 1024px) 105vw, (min-width: 640px) 120vw, 245vw" className="object-cover" />;
}

const stops = [
  {
    month: "Where it started",
    year: 2019,
    title: "The first meetup",
    text: "More than 50 developers came to The Company Cebu for the first React Cebu meetup.",
    media: <Photo src="/images/first-meetup-group.jpg" alt="Everyone at the first React Cebu meetup, gathered in front of the screen" />,
  },
  {
    month: "October",
    year: 2019,
    title: "Gatsby workshop",
    text: "A hands-on workshop at the Go Negosyo Center, UP Cebu.",
    media: <Photo src="/images/gatsby-workshop-group.jpg" alt="Everyone at the Gatsby workshop gathered for a group photo" />,
  },
  {
    month: "October",
    year: 2025,
    title: "Cebu Hacktoberfest",
    text: "Co-led by JavaScript Cebu with PizzaPy and Ethereum Philippines: talks, workshops and hack nights all month.",
    media: <Photo src="/images/hacktoberfest-shirt.jpg" alt="A close-up of a Hacktoberfest shirt" />,
  },
  {
    month: "November",
    year: 2026,
    title: "A new home online",
    text: "The site you’re looking at, built by members with Next.js.",
    media: <Photo src="/images/enspace-group.jpg" alt="React Cebu members around a long wooden table at enspace" />,
  },
];

const glide = "duration-700 ease-[cubic-bezier(.2,.8,.2,1)]";

/**
 * Four slices of photo side by side, muted to grey, with their years on top. Hover, tap or tab to
 * one and it opens wide in full colour with its story while the others close up. On phones they
 * stack, all open.
 */
export function Timeline() {
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="history-title" className="px-2 pb-32">
      {/* The whole journey in a line, ahead of the milestones. */}
      <div className="mb-10 flex flex-col gap-3 px-4">
        <SplitHeading id="history-title" className="display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]">How we got here</SplitHeading>
        <p className="m-0 max-w-[60ch] text-base text-muted">
          Built by members, one event at a time.
        </p>
      </div>

      <Reveal>
        <ol data-reveal aria-label="React Cebu timeline" className="m-0 flex list-none flex-col gap-2 p-0 lg:h-[clamp(30rem,68svh,38.75rem)] lg:flex-row">
          {stops.map((stop, i) => {
            const open = i === active;
            return (
              <li
                key={stop.title}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
                style={{ flexGrow: open ? 5 : 1 }}
                className={`tile min-h-[27.5rem] basis-0 bg-black text-white transition-[flex-grow] lg:min-h-0 ${glide}`}
              >
                {/* Wider than a closed panel and centred, so opening reveals more of the photo instead of resizing it. */}
                <div className={`absolute inset-y-0 left-1/2 w-full -translate-x-1/2 transition-[filter] lg:w-[62vw] ${glide} ${open ? "" : "lg:grayscale"}`}>{stop.media}</div>
                {/* Darkens the top and bottom so the white text reads over any photo. */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 via-45% to-black/50" />

                <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-1">
                  {/* Dropped from closed panels too narrow to hold it. */}
                  <span className={`whitespace-nowrap text-base transition-opacity duration-500 ${open ? "" : "lg:opacity-0 min-[88rem]:opacity-100"}`}>{stop.month}</span>
                  <span className="text-[clamp(2.25rem,3.6vw,4rem)] leading-none tabular-nums tracking-[-0.04em]">{stop.year}</span>
                </div>

                {/* A fixed width, so the text doesn't reflow as the panel opens. */}
                <div className={`pointer-events-none absolute bottom-5 left-5 flex w-[calc(100%-2.5rem)] flex-col gap-2 transition-opacity duration-500 lg:w-[min(28.75rem,34vw)] ${open ? "" : "lg:opacity-0"}`}>
                  <h3 className="title m-0 text-[clamp(1.75rem,3vw,2.5rem)]">{stop.title}</h3>
                  <p className="m-0 text-lg leading-[1.4]">{stop.text}</p>
                </div>

                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="absolute inset-0 hidden cursor-pointer rounded-[0.625rem] focus-visible:outline-offset-[-4px]! lg:block"
                >
                  <span className="sr-only">
                    {stop.title}, {stop.year}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}

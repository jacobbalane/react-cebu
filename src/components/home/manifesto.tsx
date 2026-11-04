"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// The paragraph as text runs and small animated pills, in reading order: React's atom spinning
// before "developers", a bug that keeps sneaking through after "bugs", and a wall of outlined
// bricks going up after "build". On desktop the atom sits alone mid-way along the first line while the
// bug and the bricks share the third, so they read as a loose cluster rather than a pattern.
type Piece = string | "atom" | "bug" | "blocks";

const pieces: Piece[] = [
  "React Cebu is where",
  "atom",
  "developers find each other, learn at workshops and talks, share the same bugs",
  "bug",
  "and build",
  "blocks",
  "together, from a first component to a shipped app.",
];

// Shared by every pill: sized in em so it scales with the paragraph, and sat on the baseline.
// All three are ink with white artwork, so they read as one set.
const pill = "relative inline-block h-[1em] w-[2.4em] overflow-hidden rounded-full align-[-0.16em]";

// A brick wall in the pill's 240 by 100 box, two rows tall in view: three bricks a row with
// tight 3-unit joints, shifting each row like real brickwork. The bottom row runs past the
// pill's bottom edge so no gap shows under it, and the top row leaves room above; one row up is
// a spare that waits out of sight. Each row step pushes a row fully out of the bottom. The spare
// matches the bottom row, so after the wall has slid down two rows it looks exactly as it
// started. Bottom row first.
const BRICK = 44;
const STEP = BRICK + 3;
const OUTLINE = 9;
// The bottom row's top edge: low enough that a good part of it is cut off by the pill's bottom.
const BASE = 66;
const rows = [BASE, BASE - STEP, BASE - 2 * STEP].map((y, row) => ({
  y,
  bricks:
    row % 2 === 0
      ? [
          { x: 28, width: 50 },
          { x: 81, width: 64 },
          { x: 148, width: 64 },
        ]
      : [
          { x: 28, width: 64 },
          { x: 95, width: 64 },
          { x: 162, width: 50 },
        ],
}));

// The bug and the tick both slide the same distance, 1.2em, between resting in view and fully out
// of sight, so with the same timing they move at the same speed. GSAP's xPercent is a share of the
// icon's own width: 1.3em for the bug, 0.8em for the tick (their sizes in the markup below).
const TRAVEL = 1.2;
const BUG_TUCK = (TRAVEL / 1.3) * 100;
const CHECK_TUCK = (TRAVEL / 0.8) * 100;

/**
 * The community in a few centered lines, read as you scroll: each word sharpens from a
 * faint blur into ink in turn, and the pills open up as the sentence reaches them.
 * Tied to the scrollbar, so scrolling back fades it again.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Starts as the paragraph comes up the screen and is fully read by the time its
        // middle is just below the middle of the screen, so it never sits centred half-faded.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-paragraph]",
            start: "top 85%",
            end: "center 60%",
            scrub: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-piece]", ref.current).forEach((piece, i) => {
          const at = i * 0.1;
          if (piece.dataset.piece === "pill") {
            tl.fromTo(piece, { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, at);
          } else {
            tl.fromTo(
              piece,
              { opacity: 0.12, filter: "blur(4px)" },
              {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.3,
                ease: "none",
              },
              at,
            );
          }
        });

        // The atom keeps turning, like the logo on react.dev.
        gsap.to("[data-spin]", {
          rotate: 360,
          duration: 4,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });

        // A bug peeks in from the left edge, holds, and ducks back out of sight; only then does a
        // tick peek in from the right, with exactly the same timing, and duck back; then the next
        // bug has a go. Three bugs take turns, so the loop is three bug-and-tick rounds. Sets and
        // plain .to tweens, so when the loop wraps it falls back to its start.
        const bug = "[data-bug]";
        const check = "[data-check]";
        const kinds = gsap.utils.toArray<SVGGElement>("[data-kind]", ref.current);
        gsap.set(bug, { xPercent: -BUG_TUCK });
        gsap.set(check, { xPercent: CHECK_TUCK });
        gsap.set(kinds, { autoAlpha: 0 });
        gsap.set(kinds[0], { autoAlpha: 1 });
        const IN = 0.5;
        const HOLD = 1.2;
        const OUT = 0.4;
        const PAUSE = 0.1;
        const turn = IN + HOLD + OUT + PAUSE;
        const peek = { xPercent: 0, duration: IN, ease: "power3.out" };
        const tuck = { duration: OUT, ease: "power2.in" };
        const turns = gsap.timeline({ repeat: -1 });
        kinds.forEach((kind, i) => {
          const at = i * 2 * turn;
          turns
            .set(kinds, { autoAlpha: 0 }, at)
            .set(kind, { autoAlpha: 1 }, at)
            .to(bug, peek, at)
            .to(bug, { xPercent: -BUG_TUCK, ...tuck }, at + IN + HOLD)
            .to(check, peek, at + turn)
            .to(check, { xPercent: CHECK_TUCK, ...tuck }, at + turn + IN + HOLD);
        });
        // End on the pause after the last tick, so the gap before the loop wraps matches the others.
        turns.to({}, { duration: PAUSE });

        // Bricks fall in one at a time onto the bottom row until there are two rows, then the
        // wall slides down a row and the next row falls in on top, and it slides again. After two
        // rounds it matches the start, so the wall seems to rise forever.
        const rowOf = (row: number) => gsap.utils.toArray<SVGRectElement>(`[data-row="${row}"]`, ref.current);
        gsap.set([...rowOf(1), ...rowOf(2)], { y: -110, autoAlpha: 1 });
        const fall = { y: 0, duration: 0.5, ease: "bounce.out", stagger: 0.25 };
        const slide = { duration: 0.55, ease: "power2.inOut" };
        gsap
          .timeline({ repeat: -1 })
          .to(rowOf(1), fall, 0.2)
          .to("[data-wall]", { y: STEP, ...slide }, "+=0.35")
          .to(rowOf(2), fall, "+=0.1")
          .to("[data-wall]", { y: 2 * STEP, ...slide }, "+=0.35");
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-label="About React Cebu"
      className="flex min-h-[80svh] items-center bg-fog px-4 py-28 md:px-10 md:py-40"
    >
      {/* The width is in em, so it scales with the type and the lines break in the same places
          at every desktop size; a fixed width let some sizes stack one pill right above another. */}
      <p
        data-paragraph
        className="title mx-auto my-0 max-w-[20em] text-balance text-center text-[clamp(32px,4.2vw,64px)] leading-[1.12] text-ink"
      >
        {pieces.map((piece, i) =>
          piece === "atom" ? (
            <span key="atom">
              <span data-piece="pill" aria-hidden="true" className={`${pill} bg-ink`}>
                {/* Oversized and tucked into the bottom right corner, so the pill crops it as it turns. */}
                <svg data-spin viewBox="-50 -50 100 100" className="absolute -bottom-[1.25em] -right-[0.6em] size-[2.5em]">
                  <g fill="none" stroke="white" strokeWidth="5">
                    <ellipse rx="44" ry="17" />
                    <ellipse rx="44" ry="17" transform="rotate(60)" />
                    <ellipse rx="44" ry="17" transform="rotate(120)" />
                  </g>
                  <circle r="7" fill="white" />
                </svg>
              </span>{" "}
            </span>
          ) : piece === "bug" ? (
            <span key="bug">
              <span data-piece="pill" aria-hidden="true" className={`${pill} bg-ink`}>
                {/* Filled bugs, a little taller than the pill, sat just past its left edge so most
                    of the bug peeks in, tail cut off; drawn facing up and turned to face into the
                    pill. One shows at a time. Gaps and spots are painted in the pill's ink. Reduced
                    motion leaves the beetle and the tick in view, still. */}
                <svg data-bug viewBox="0 0 512 512" className="absolute -left-[0.2em] -top-[0.15em] size-[1.3em]">
                  <g transform="rotate(90 256 256)">
                    {/* Beetle: two wing halves split down the middle, a domed head, antennae and three legs a side. */}
                    <g data-kind>
                      <g fill="none" stroke="white" strokeWidth="30" strokeLinecap="round">
                        <path d="M188 46L208 86M324 46L304 86" />
                        <path d="M80 168L128 196M50 300H100M84 424L124 384M432 168L384 196M462 300H412M428 424L388 384" />
                      </g>
                      <g fill="white">
                        <path d="M162 143A94 80 0 0 1 350 143Z" />
                        <path d="M240 175H135C108 210 97 258 97 300C97 390 158 456 240 476Z" />
                        <path d="M272 175H377C404 210 415 258 415 300C415 390 354 456 272 476Z" />
                      </g>
                    </g>
                    {/* Ladybug: knobbed antennae, a head cap and a round shell with spots and a split. */}
                    <g data-kind className="invisible">
                      <path d="M170 20L206 56M342 20L306 56" fill="none" stroke="white" strokeWidth="22" strokeLinecap="round" />
                      <g fill="white">
                        <circle cx="166" cy="16" r="20" />
                        <circle cx="346" cy="16" r="20" />
                        <path d="M150 116A106 70 0 0 1 362 116Q256 92 150 116Z" />
                        <ellipse cx="256" cy="318" rx="196" ry="186" />
                      </g>
                      <g fill="var(--color-ink)">
                        <path d="M256 270L292 466H220Z" />
                        <circle cx="176" cy="236" r="16" />
                        <circle cx="146" cy="326" r="34" />
                        <circle cx="156" cy="414" r="17" />
                        <circle cx="336" cy="236" r="16" />
                        <circle cx="366" cy="326" r="34" />
                        <circle cx="356" cy="414" r="17" />
                      </g>
                    </g>
                    {/* Scarab: a small head cap, a domed shield, square-shouldered wing halves and bent
                      legs. Drawn edge to edge, so it is scaled down about its middle to sit with the others. */}
                    <g data-kind className="invisible" transform="translate(256 256) scale(0.85) translate(-256 -256)">
                      <g fill="none" stroke="white" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M222 46L166 14M290 46L346 14" />
                        <path d="M122 160H104L44 104M390 160H408L468 104" />
                        <path d="M92 246H76L46 302H16M420 246H436L466 302H496" />
                        <path d="M98 382L74 398V470M414 382L438 398V470" />
                      </g>
                      <g fill="white">
                        <path d="M198 72A58 40 0 0 1 314 72Z" />
                        <path d="M152 180A104 90 0 0 1 360 180Z" />
                        <path d="M242 208H150Q122 208 120 236V340C120 420 175 470 242 478Z" />
                        <path d="M270 208H362Q390 208 392 236V340C392 420 337 470 270 478Z" />
                      </g>
                    </g>
                  </g>
                </svg>
                {/* A tick in a ring that slides in from the right and comes to rest whole, inside the
                    pill's rounded end. */}
                <svg data-check viewBox="0 0 512 512" className="absolute right-[0.12em] top-[0.1em] size-[0.8em]">
                  <g fill="none" stroke="white" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="256" cy="256" r="212" />
                    <path d="M148 262L222 334L366 190" />
                  </g>
                </svg>
              </span>{" "}
            </span>
          ) : piece === "blocks" ? (
            <span key="blocks">
              <span data-piece="pill" aria-hidden="true" className={`${pill} bg-ink`}>
                <svg viewBox="0 0 240 100" className="absolute inset-0 size-full">
                  {/* Outlined bricks: each outline is drawn just inside its brick's box, so the
                      joints between bricks stay as wide as with solid ones. */}
                  <g data-wall fill="none" stroke="white" strokeWidth={OUTLINE}>
                    {rows.map((row, r) =>
                      row.bricks.map((brick) => (
                        <rect
                          key={`${r}-${brick.x}`}
                          data-brick
                          // The bottom row is already standing when each round starts. The spare row
                          // would peek over the top edge of a still wall, so it only shows once moving.
                          data-row={r}
                          className={r === 2 ? "invisible" : undefined}
                          x={brick.x + OUTLINE / 2}
                          y={row.y + OUTLINE / 2}
                          width={brick.width - OUTLINE}
                          height={BRICK - OUTLINE}
                        />
                      )),
                    )}
                  </g>
                </svg>
              </span>{" "}
            </span>
          ) : (
            piece.split(" ").map((word, j) => (
              <span key={`${i}-${j}`}>
                <span data-piece="word" className="inline-block">
                  {word}
                </span>{" "}
              </span>
            ))
          ),
        )}
      </p>
    </section>
  );
}

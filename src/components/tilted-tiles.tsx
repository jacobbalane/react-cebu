"use client";

import { getImageProps } from "next/image";
import { useMemo, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

export type Tile =
  | { kind: "photo"; src: string }
  | { kind: "block"; className: string; content: React.ReactNode };

type TiltedTilesProps = {
  tiles: Tile[];
  /** Number of scrolling columns across the plane. */
  columns?: number;
  /** Tiles in one copy of a column; each column renders three copies so the loop never shows a gap. */
  perColumn?: number;
  /** Seconds for a column to scroll one copy's height. */
  duration?: number;
  /** How far the wall tilts toward the mouse, in degrees. */
  tilt?: number;
  className?: string;
};

// Columns hold three identical copies and move by one copy, so the loop is seamless.
const COPIES = 3;
// Phones show the homepage marquee instead of the wall, so they don't draw it, move it or download
// its photos. A tile takes this transparent pixel there: eager images load even when hidden.
const PHONE = "(max-width: 767px)";
const NOTHING = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/** A wall photo, through next/image, inside <picture> so phones can skip it. */
function TilePhoto({ src }: { src: string }) {
  // Eager: lazy loading never fires reliably for transformed tiles.
  const { props } = getImageProps({
    src,
    alt: "",
    fill: true,
    sizes: "(min-width: 1024px) 24vw, (min-width: 768px) 32vw, (orientation: portrait) 64vw, 50vw",
    loading: "eager",
    className: "object-cover",
  });
  return (
    <picture>
      <source media={PHONE} srcSet={NOTHING} />
      <img {...props} alt="" />
    </picture>
  );
}

/**
 * Shuffles a copy of `items` with a seeded generator (mulberry32), so the server
 * and the browser produce the same order and hydration matches.
 */
function shuffled<T>(items: T[], seed: number) {
  let state = seed;
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * A wall of image columns, tilted back in 3D, with neighbouring columns
 * scrolling in opposite directions. Scrolling the page speeds it up and the
 * wall tilts a little to face the mouse.
 */
export function TiltedTiles({ tiles, columns = 13, perColumn = 10, duration = 80, tilt = 3, className = "" }: TiltedTilesProps) {
  const root = useRef<HTMLDivElement>(null);
  const shift = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        const loops = gsap.utils.toArray<HTMLElement>("[data-tt-track]").map((track, i) => {
          const up = i % 2 === 0;
          const step = 100 / COPIES;
          return gsap
            .fromTo(track, { yPercent: up ? 0 : -step }, { yPercent: up ? -step : 0, duration, ease: "none", repeat: -1 })
            .progress((i * 0.37) % 1);
        });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 7);
            loops.forEach((loop) => {
              gsap.killTweensOf(loop, "timeScale");
              loop.timeScale(boost);
              gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out" });
            });
          },
        });

        // The side nearest the mouse leans away, so the wall turns to face it. Touch screens have no
        // hover, so they don't follow the pointer at all.
        if (!window.matchMedia("(hover: hover)").matches) return;
        const turnTo = gsap.quickTo(shift.current, "rotationY", { duration: 1.4, ease: "power3.out" });
        const leanTo = gsap.quickTo(shift.current, "rotationX", { duration: 1.4, ease: "power3.out" });
        const follow = (event: PointerEvent) => {
          if (event.pointerType !== "mouse" || !root.current) return;
          const box = root.current.getBoundingClientRect();
          turnTo(((event.clientX - box.left) / box.width - 0.5) * 2 * tilt);
          leanTo(((event.clientY - box.top) / box.height - 0.5) * -2 * tilt);
        };
        window.addEventListener("pointermove", follow);
        return () => window.removeEventListener("pointermove", follow);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Tiles split into sets of `perColumn`, and the sets rotate across the columns. Columns slide past
  // each other, so a tile must only come back several columns away or it ends up beside itself.
  // Every column gets its own shuffled order, so no pattern repeats across the wall.
  const sets = Math.max(1, Math.floor(tiles.length / perColumn));
  const orders = useMemo(
    () =>
      Array.from({ length: columns }, (_, column) => {
        const start = (column % sets) * perColumn;
        return shuffled(sets > 1 ? tiles.slice(start, start + perColumn) : tiles, column + 1);
      }),
    [tiles, columns, perColumn, sets],
  );
  const tileAt = (column: number, row: number) => orders[column][row % orders[column].length];

  return (
    <div ref={root} aria-hidden="true" className={`absolute inset-0 overflow-hidden bg-black [perspective:max(137vw,1008px,140svh)] ${className}`}>
      <div ref={shift} className="absolute inset-0 [transform-style:preserve-3d]">
        {/* The wall recedes toward the top right with columns leaning left, measured from the
            reference. It is shifted toward the far side, which needs the most wall to fill the corners,
            with enough spare that the mouse tilt never shows an edge. */}
        <div className="absolute left-1/2 top-1/2 flex h-[240%] w-[520%] gap-2.5 [transform:translate(-50%,-50%)_rotateZ(23.5deg)_rotateX(42.6deg)_rotateZ(-38deg)_translate(22%,-5%)] md:w-[330%] lg:w-[240%]">
          {Array.from({ length: columns }, (_, column) => (
            <div key={column} className="h-full min-w-0 flex-1 overflow-hidden">
              <div data-tt-track className="flex flex-col gap-2">
                {Array.from({ length: COPIES }, (_, copy) =>
                  Array.from({ length: perColumn }, (_, row) => {
                    const tile = tileAt(column, row);
                    return (
                      <div key={`${copy}-${row}`} className="@container relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#111]">
                        {tile.kind === "photo" ? (
                          <TilePhoto src={tile.src} />
                        ) : (
                          <div className={`flex h-full flex-col justify-between p-[8%] ${tile.className}`}>{tile.content}</div>
                        )}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

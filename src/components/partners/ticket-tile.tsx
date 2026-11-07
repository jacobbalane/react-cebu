"use client";

import { useRef, useSyncExternalStore } from "react";
import { teamName, useOffer, ways } from "@/components/partners/offer";
import { AddPill, follow, grain, moves, rise, rootSize, shell, tileText, tileTitle, useLift } from "@/components/partners/ways-tile";
import { gsap, useGSAP } from "@/lib/gsap";

const student = ways[4];

// What a saved seat might be for, and where it is. Talks have rows and hands-on days have tables.
const seats = [
  { event: "React Cebu meetup", seat: "Row C, Seat 12" },
  { event: "Lightning talks", seat: "Row A, Seat 4" },
  { event: "Code camp", seat: "Table 3, Seat 2" },
  { event: "Hacktoberfest", seat: "Table 2, Seat 5" },
  { event: "React workshop", seat: "Table 5, Seat 6" },
  { event: "Training session", seat: "Row D, Seat 7" },
  { event: "React Cebu meetup", seat: "Row F, Seat 18" },
  { event: "Lightning talks", seat: "Row E, Seat 15" },
];

// A random seat for each ticket: one per page load, then a new one each time a ticket is torn up. The
// server always sends the first, and the browser swaps in its pick as it hydrates, so the two never disagree.
let shown: number | undefined;
const watchers = new Set<() => void>();

const chooseSeat = () => {
  // It skips the one shown last, so the text always changes. Storage can be blocked, and then a refresh is only random.
  let last = shown ?? -1;
  try {
    last = shown ?? Number(sessionStorage.getItem("ticket-seat") ?? -1);
  } catch {
    last = shown ?? -1;
  }
  const choices = seats.map((_, i) => i).filter((i) => i !== last);
  shown = choices[Math.floor(Math.random() * choices.length)];
  try {
    sessionStorage.setItem("ticket-seat", String(shown));
  } catch {
    // Nothing to do: the next load just won't know what this one showed.
  }
  return shown;
};

const currentSeat = () => shown ?? chooseSeat();
const firstSeat = () => 0;
const nextSeat = () => {
  chooseSeat();
  watchers.forEach((tell) => tell());
};
const watchSeat = (tell: () => void) => {
  watchers.add(tell);
  return () => {
    watchers.delete(tell);
  };
};

type End = "top" | "bottom";
type Point = [number, number];

// How far a side has to be pulled, in rem, to tear the whole line.
const FULL_TEAR = 7;
// How wide the peeled corner is, as a share of the length of its rip.
const FOLD = 0.55;
// How much of the print shows through from the other side of the paper.
const SHOW_THROUGH = "0.1";
const NOTCH = 0.625;

const TEETH = 18;
const BITE = 0.18;
// Uneven, so a torn edge looks torn and not cut with pinking shears.
const wander = [1, 0.45, 0.8, 0.2, 1, 0.6, 0.35, 0.9, 0.5, 0.15, 0.75, 1, 0.3, 0.65, 0.1, 0.85];
const steps = Array.from({ length: TEETH * 2 + 1 }, (_, i) => i);
const along = (i: number) => Math.round(((i * 50) / TEETH) * 100) / 100;
const depth = (i: number) => BITE * wander[i % wander.length];
// The two pieces interlock along the perforation, so once apart each shows a torn edge.
const mainEdge = `polygon(0 0, ${steps.map((i) => `calc(100% - ${depth(i)}rem) ${along(i)}%`).join(", ")}, 0 100%)`;
const stubEdge = `polygon(${steps.map((i) => `${BITE - depth(i)}rem ${along(i)}%`).join(", ")}, 100% 100%, 100% 0)`;
// Half a circle bitten out of each end of the line.
const mainNotches = "[mask-composite:intersect] [mask-image:radial-gradient(circle_0.625rem_at_100%_0,transparent_98%,#000),radial-gradient(circle_0.625rem_at_100%_100%,transparent_98%,#000)]";
const stubNotches = "[mask-composite:intersect] [mask-image:radial-gradient(circle_0.625rem_at_0.18rem_0,transparent_98%,#000),radial-gradient(circle_0.625rem_at_0.18rem_100%,transparent_98%,#000)]";

const polygon = (points: Point[]) => `polygon(${points.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;

/** Holds the piece's own surface where it folds over, one at each end of the line. */
function Flaps() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 drop-shadow-[0_0.2rem_0.3rem_rgba(0,0,0,0.35)]">
      <span data-flap="top" className="absolute inset-0" />
      <span data-flap="bottom" className="absolute inset-0" />
    </span>
  );
}

/**
 * A ticket that tears along its dashed line the way paper does. Pulling a side rips the line from the
 * end nearest the grab, and the corner of that piece peels back along the rip, so the fold is what
 * opens the gap. It tears from both ends, each piece peels on its own, and a rip stays where it's left.
 * When the rips meet it's through, and letting go drops both pieces out of the card and a new ticket
 * comes up from the bottom.
 */
export function TicketTile() {
  const { team } = useOffer();
  const { event, seat } = seats[useSyncExternalStore(watchSeat, currentSeat, firstSeat)];
  const ref = useRef<HTMLDivElement>(null);
  const hover = useLift(ref, "student", (line, box) => {
    rise(line, box, { y: "4rem", rotation: -5 }, { y: "1.5rem", rotation: -2 });
    line.fromTo(box.querySelector("[data-punch]"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 0.35);
  });

  useGSAP(
    () => {
      const tile = ref.current;
      const ticket = tile?.querySelector<HTMLElement>("[data-ticket]");
      const main = tile?.querySelector<HTMLElement>("[data-half='main']");
      const stub = tile?.querySelector<HTMLElement>("[data-half='stub']");
      const seam = tile?.querySelector<HTMLElement>("[data-seam]");
      const punch = tile?.querySelector<HTMLElement>("[data-punch]");
      if (!tile || !ticket || !main || !stub || !seam || !punch) return;

      const still = !moves();
      let busy = false;
      // A tear stays where it's left, so how far each piece has peeled at each end, as a share of the
      // line, outlasts a single drag. An end's rip is as long as the longer of its two peels.
      const peels = new Map<HTMLElement, Record<End, number>>([
        [main, { top: 0, bottom: 0 }],
        [stub, { top: 0, bottom: 0 }],
      ]);
      const ripped = (end: End) => Math.max(peels.get(main)?.[end] ?? 0, peels.get(stub)?.[end] ?? 0);

      // Draws one piece: its face with any peeled corners gone, and each corner folded over onto it.
      // Measurements on a corner are `u`, in from the line, and `v`, along the line from the ticket's end.
      const drawHalf = (half: HTMLElement, height: number, rem: number) => {
        const isStub = half === stub;
        const face = half.querySelector<HTMLElement>("[data-face]");
        if (!face) return;
        const width = parseFloat(getComputedStyle(half).width);
        const bite = BITE * rem;
        const inward = (u: number) => (isStub ? bite + u : width - u);
        // The notch is already a hole, so there's no paper to fold until a rip has got past it.
        const notch = NOTCH * rem;
        const corner = (end: End) => {
          const length = (peels.get(half)?.[end] ?? 0) * height;
          if (length <= notch) return { length: 0, width: 0 };
          return { length, width: Math.min(length * FOLD, (width - bite) * 0.85) };
        };
        const top = corner("top");
        const bottom = corner("bottom");

        const line = steps
          .map((i): Point => [isStub ? bite - depth(i) * rem : width - depth(i) * rem, (along(i) / 100) * height])
          .filter(([, y]) => y > top.length && y < height - bottom.length);
        const upper: Point = [inward(0), top.length];
        const lower: Point = [inward(0), height - bottom.length];
        face.style.clipPath = polygon(
          isStub
            ? [[inward(top.width), 0], [width, 0], [width, height], [inward(bottom.width), height], lower, ...line.reverse(), upper]
            : [[0, 0], [inward(top.width), 0], upper, ...line, lower, [inward(bottom.width), height], [0, height]],
        );

        (["top", "bottom"] as const).forEach((end) => {
          const surface = half.querySelector<HTMLElement>(`[data-flap="${end}"] > *`);
          const { length, width: across } = end === "top" ? top : bottom;
          if (!surface) return;
          surface.style.display = length > 0 ? "" : "none";
          if (length <= 0) return;

          // The corner of the piece's own surface, cut along the fold with its real torn edge.
          const place = ([u, v]: Point): Point => [inward(u), end === "top" ? v : height - v];
          const crease = place([0, length]);
          const reach = place([across, 0]);
          const tip = place([0, 0]);
          const tornEdge = steps
            .map((i): Point => [isStub ? bite - depth(i) * rem : width - depth(i) * rem, (along(i) / 100) * height])
            .filter(([, y]) => (end === "top" ? y < length : y > height - length));
          surface.style.clipPath = polygon([reach, crease, ...(end === "top" ? tornEdge.reverse() : tornEdge)]);

          // Turned over across the fold, so it's the same paper, lying back on the piece.
          const size = Math.hypot(reach[0] - crease[0], reach[1] - crease[1]);
          const flip = { x: (reach[1] - crease[1]) / size, y: -(reach[0] - crease[0]) / size };
          const turn = crease[0] * flip.x + crease[1] * flip.y;
          const skew = -2 * flip.x * flip.y;
          surface.style.transform = `matrix(${1 - 2 * flip.x * flip.x}, ${skew}, ${skew}, ${1 - 2 * flip.y * flip.y}, ${2 * turn * flip.x}, ${2 * turn * flip.y})`;

          // Shaded darkest along the fold, where the paper curves away from the light.
          const side = (tip[0] - crease[0]) * flip.x + (tip[1] - crease[1]) * flip.y > 0 ? 1 : -1;
          const toTip = { x: flip.x * side, y: flip.y * side };
          const line = Math.abs(width * toTip.x) + Math.abs(height * toTip.y);
          const at = ([x, y]: Point) => (x - width / 2) * toTip.x + (y - height / 2) * toTip.y + line / 2;
          const start = at(crease);
          const finish = at(tip);
          surface.style.background = `linear-gradient(${(Math.atan2(toTip.x, -toTip.y) * 180) / Math.PI}deg, #bfc2c5 ${start}px, #eceeee ${start + (finish - start) * 0.35}px, #fbfbfa ${finish}px)`;
        });
      };

      // Copies a piece's surface into its flaps. It's done on each grab, so a change of team name shows.
      const copySurface = (half: HTMLElement) => {
        const face = half.querySelector<HTMLElement>("[data-face]");
        if (!face) return;
        half.querySelectorAll("[data-flap]").forEach((flap) => {
          const copy = face.cloneNode(true) as HTMLElement;
          copy.removeAttribute("data-face");
          copy.querySelectorAll<HTMLElement>("*").forEach((part) => {
            part.removeAttribute("data-punch");
            part.style.opacity = SHOW_THROUGH;
          });
          copy.style.position = "absolute";
          copy.style.inset = "0";
          copy.style.transformOrigin = "0 0";
          copy.style.display = "none";
          flap.replaceChildren(copy);
        });
      };

      const draw = () => {
        const rem = rootSize();
        const height = parseFloat(getComputedStyle(ticket).height);
        drawHalf(main, height, rem);
        drawHalf(stub, height, rem);
        // What's still joined keeps its hairline filled, so the rip's point is the last thing open.
        const stop = (end: End) => Math.max(0, ripped(end) * height - NOTCH * rem);
        seam.style.clipPath = `inset(${stop("top")}px 0 ${stop("bottom")}px 0)`;
      };

      // Both pieces drop out of the card, then a whole ticket comes up to wherever the paper is now.
      const fall = (held: HTMLElement, other: HTMLElement, way: 1 | -1, zoom: number) => {
        const drop = (tile.getBoundingClientRect().bottom - ticket.getBoundingClientRect().top) / zoom + 60;
        // The hole belongs to the ticket that's falling, so it goes down with a copy that hover can't close.
        const hole = punch.cloneNode() as HTMLElement;
        hole.removeAttribute("data-punch");
        punch.after(hole);
        const renew = () => {
          hole.remove();
          nextSeat();
          peels.forEach((peel) => {
            peel.top = 0;
            peel.bottom = 0;
          });
          gsap.set([main, stub], { clearProps: "transform" });
          gsap.set(seam, { autoAlpha: 1 });
          draw();
          const rising = still ? 0 : 0.65;
          gsap.fromTo(ticket, { y: still ? 0 : drop }, { y: 0, duration: rising, ease: "power3.out", onComplete: () => (busy = false) });
          // The new ticket comes up whole. If the card is still open, it gets its own punch on arrival.
          const punched = Number(gsap.getProperty(punch, "scale"));
          if (punched > 0 && !still) gsap.fromTo(punch, { scale: 0 }, { scale: punched, duration: 0.3, delay: rising, ease: "back.out(3)" });
        };
        if (still) return renew();
        gsap.to(held, { y: `+=${drop}`, rotation: way * 9, duration: 0.7, ease: "power2.in" });
        gsap.to(other, { y: `+=${drop}`, rotation: way * -6, duration: 0.7, delay: 0.06, ease: "power2.in", onComplete: renew });
      };

      const grab = (half: HTMLElement, other: HTMLElement, away: 1 | -1) => (down: PointerEvent) => {
        const peel = peels.get(half);
        if (busy || down.button || !peel) return;
        busy = true;
        const box = ticket.getBoundingClientRect();
        const end: End = down.clientY < box.top + box.height / 2 ? "top" : "bottom";
        copySurface(half);
        draw();
        const opposite: End = end === "top" ? "bottom" : "top";
        const full = FULL_TEAR * rootSize();
        const started = peel[end];
        let scale = 1;
        let through: { dx: number; dy: number; left: number; right: number; top: number; bottom: number } | null = null;

        follow(
          half,
          down,
          (dx, dy, zoom) => {
            scale = zoom;
            if (!through) {
              // It only ever rips further, because paper doesn't mend, and it stops where it meets the other rip.
              peel[end] = Math.max(peel[end], Math.min(1 - ripped(opposite), started + (away * dx) / zoom / full));
              draw();
              if (ripped("top") + ripped("bottom") < 1) return;
              const held = half.getBoundingClientRect();
              const room = tile.getBoundingClientRect();
              through = { dx, dy, left: room.left - held.left, right: room.right - held.right, top: room.top - held.top, bottom: room.bottom - held.bottom };
              // The rips have met, so the last of the paper joining the pieces has gone.
              gsap.to(seam, { autoAlpha: 0, duration: still ? 0 : 0.12 });
            }
            // Through the line, the held piece is free to follow the pointer inside the card.
            gsap.set(half, {
              x: gsap.utils.clamp(through.left, through.right, dx - through.dx) / zoom,
              y: gsap.utils.clamp(through.top, through.bottom, dy - through.dy) / zoom,
            });
          },
          () => {
            if (through) fall(half, other, away, scale);
            else busy = false;
          },
        );
      };

      const pullMain = grab(main, stub, -1);
      const pullStub = grab(stub, main, 1);
      main.addEventListener("pointerdown", pullMain);
      stub.addEventListener("pointerdown", pullStub);
      return () => {
        main.removeEventListener("pointerdown", pullMain);
        stub.removeEventListener("pointerdown", pullStub);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal {...hover} className={`${shell} bg-azure text-white lg:order-2 lg:col-span-4`}>
      <h3 className={tileTitle}>{student.title}</h3>
      <p className={tileText}>{student.text}</p>
      <div><AddPill id="student" title={student.title} tone="btn-white" /></div>
      <div className="flex min-h-[11rem] flex-[1_1_0px] justify-center">
        <div data-object className="h-max w-[min(23rem,100%)] drop-shadow-[0_1rem_1.25rem_rgba(0,0,0,0.4)]">
          <div data-ticket className="relative flex select-none text-ink">
            {/* Fills the hairline between the two pieces where they're still joined. It stops short of the notches, or it would show in them. */}
            <span data-seam aria-hidden="true" className="absolute inset-y-[0.625rem] left-[calc(70%-0.3rem)] w-[0.6rem] bg-white" />
            <div data-half="main" className="relative w-[70%] cursor-grab touch-pan-y active:cursor-grabbing">
              <div data-face className={`${grain} ${mainNotches} flex h-full flex-col gap-3 rounded-l-[0.5rem] p-4 pb-16`} style={{ clipPath: mainEdge }}>
                <p className="m-0 text-sm">{seat}</p>
                <p className="title m-0 text-[1.375rem]">{event}</p>
                <p className="m-0 truncate text-sm">Reserved by {teamName(team)}</p>
              </div>
              <Flaps />
            </div>
            <div data-half="stub" className="relative -ml-[0.18rem] w-[calc(30%+0.18rem)] cursor-grab touch-pan-y active:cursor-grabbing">
              <div data-face className={`${grain} ${stubNotches} relative h-full rounded-r-[0.5rem] p-4`} style={{ clipPath: stubEdge }}>
                <span aria-hidden="true" className="absolute inset-y-0 left-[0.18rem] border-l-2 border-dashed border-ink/25" />
                <p className="m-0 text-sm">Admit</p>
                <p className="title m-0 text-[2.25rem]">1</p>
                <span aria-hidden="true" data-punch className="absolute right-4 top-[42%] block size-5 scale-0 rounded-full bg-azure shadow-[inset_0_0.125rem_0.1875rem_rgba(0,0,0,0.35)]" />
              </div>
              <Flaps />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

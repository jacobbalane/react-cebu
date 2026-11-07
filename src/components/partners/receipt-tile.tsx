"use client";

import { useRef, useState } from "react";
import { teamName, useOffer, ways } from "@/components/partners/offer";
import { AddPill, follow, grain, moves, onLight, rootSize, shell, tileText, tileTitle, useLook, zoomOf } from "@/components/partners/ways-tile";
import { gsap, useGSAP } from "@/lib/gsap";

const snacks = ways[1];

// How much of the strip, in percent, stays inside the printer until it's looked at.
const TUCKED = 22;
// How much of the next strip, in rem, peeks out of the slot after a tear. It's the blank end of that strip, so it shows only paper and teeth.
const STUB = 1.25;
// How far a press has to move, in pixels, before it counts as tearing.
const TEAR_AT = 6;
// In hand it behaves like the family cards: it leans this far, and at least this much of it stays in the card.
const LEAN = 4;
const SHOW = 0.25;

const TEETH = 22;
const DEPTH = 0.42;
const across = (i: number) => Math.round(((i * 50) / TEETH) * 100) / 100;
const teeth = Array.from({ length: TEETH * 2 + 1 }, (_, i) => i);
// The torn edges are cut out of the paper itself, so the shadow follows the teeth and nothing is laid on top to fake them.
const tornEnd = `polygon(0 0, 100% 0, ${teeth.map((i) => `${100 - across(i)}% calc(100% - ${i % 2 ? 0 : DEPTH}rem)`).join(", ")})`;
const tornTop = `polygon(${teeth.map((i) => `${across(i)}% ${i % 2 ? 0 : DEPTH}rem`).join(", ")}, 100% 100%, 0 100%)`;

const leader = ".".repeat(60);
const bars = [2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1];

type Line = [name: string, amount: (people: number) => string];
const per = (guests: number, unit: string): Line[1] => (people) => `${Math.ceil(people / guests)} ${unit}`;
const always = (amount: string): Line[1] => () => amount;

// What a print can order. Every receipt has the same five lines, so the paper stays one length however the order changes.
const mains: Line[] = [["Pizza", per(8, "boxes")], ["Siomai", per(0.5, "pcs")], ["Ngohiong", per(1, "pcs")], ["Bam-i", per(15, "trays")], ["Lechon", per(8, "kilos")], ["Chicken", per(10, "buckets")]];
const sides: Line[] = [["Puso", per(0.5, "pcs")], ["Rosquillos", per(10, "packs")], ["Otap", per(10, "packs")], ["Dried mango", per(5, "packs")], ["Donuts", per(12, "boxes")]];
const drinks: Line[] = [["Iced tea", per(1, "cups")], ["Coffee", per(30, "flasks")], ["Sikwate", per(30, "flasks")], ["Mango shake", per(1, "cups")], ["Soft drinks", per(24, "cases")], ["Water", per(1, "bottles")]];
const extras: Line[] = [["Napkins", always("Plenty")], ["Extra rice", always("Always")], ["Seconds", always("Allowed")], ["Leftovers", always("None")]];
const crowds = [40, 50, 60, 80, 100];
const thanks = ["Salamat, see you next time", "Daghang salamat, partner", "Thanks for feeding us", "Kaon na, coders", "Busog na? Back to the code"];

const list = (lines: Line[], people: number) => lines.map(([name, amount]) => ({ name, amount: amount(people) }));
const other = <T,>(options: T[], last: T) => gsap.utils.random(options.filter((option) => option !== last));

// The first print is always this one, so the server and the browser agree on it.
const firstPrint = { people: 60, order: list([mains[0], sides[0], drinks[0], drinks[1], extras[0]], 60), bars, thanks: thanks[0] };

/** A new order, with a different crowd and sign-off from the last so no two prints in a row match. */
function nextPrint(last: typeof firstPrint) {
  const people = other(crowds, last.people);
  const [first, second] = gsap.utils.shuffle([...drinks]);
  const lines = [gsap.utils.random(mains), gsap.utils.random(sides), first, second, gsap.utils.random(extras)];
  return { people, order: list(lines, people), bars: gsap.utils.shuffle([...bars]), thanks: other(thanks, last.thanks) };
}

function Item({ name, amount }: { name: string; amount: string }) {
  return (
    <div className="flex gap-1.5">
      <span className="shrink-0">{name}</span>
      <span aria-hidden="true" className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-ink/35">{leader}</span>
      <span className="max-w-[62%] shrink-0 truncate">{amount}</span>
    </div>
  );
}

/**
 * A receipt that can be torn off. Dragging it tears it at the slot and leaves the next strip's end
 * peeking out, so when the torn piece is let go and falls away, the printer carries straight on from
 * there. `feed` moves the strip, and hover only reaches it when nothing is being torn. Every print is
 * a new order: it changes while only the strip's blank end is out, so the torn piece keeps the old one.
 */
export function ReceiptTile() {
  const { team } = useOffer();
  const [print, setPrint] = useState(firstPrint);
  const ref = useRef<HTMLDivElement>(null);
  const feed = useRef<(open: boolean) => void>(() => {});
  const { handlers, isOpen } = useLook(ref, "snacks", (open) => feed.current(open));

  useGSAP(
    () => {
      const tile = ref.current;
      const strip = tile?.querySelector<HTMLElement>("[data-strip]");
      const slot = tile?.querySelector<HTMLElement>("[data-slot]");
      const layer = tile?.querySelector<HTMLElement>("[data-loose]");
      const light = tile?.querySelector<HTMLElement>("[data-light]");
      if (!tile || !strip || !slot || !layer || !light) return;

      const still = !moves();
      const rest = still ? 0 : -TUCKED;
      // True from a tear until the next strip has finished printing, so there's only ever one piece loose.
      let busy = false;
      // True while the strip is sitting as a stub, waiting for the torn piece to get out of the way.
      let waiting = false;
      let printed = firstPrint;

      const run = (to: number) => {
        // The strip slides out of the slot, torn end first, so the header is the last line to appear.
        gsap.to(strip, { yPercent: to, duration: still ? 0 : 0.7, ease: "sine.inOut", overwrite: true, onComplete: () => (busy = false) });
        gsap.to(light, { opacity: to === 0 ? 1 : 0.35, duration: 0.3, overwrite: true });
      };

      gsap.set(strip, { yPercent: rest });
      // A strip that's printing still answers the pointer, so it stops where it should if the pointer leaves or comes back.
      feed.current = (open) => {
        if (!waiting) run(open ? 0 : rest);
      };

      const tear = () => {
        busy = true;
        waiting = true;
        gsap.killTweensOf(strip);
        const zoom = zoomOf(strip);
        const box = strip.getBoundingClientRect();
        const room = tile.getBoundingClientRect();
        const cut = slot.getBoundingClientRect().top;

        // A copy of what's out of the printer, so the real strip can drop back to a stub behind it.
        const copy = strip.cloneNode(true) as HTMLElement;
        copy.removeAttribute("data-strip");
        copy.removeAttribute("style");
        copy.className = "";
        copy.style.marginTop = `${(box.top - cut) / zoom}px`;
        const edge = document.createElement("div");
        edge.style.clipPath = tornTop;
        edge.style.height = "100%";
        edge.style.overflow = "hidden";
        edge.append(copy);
        const piece = document.createElement("div");
        piece.className = "@container absolute left-0 top-0 drop-shadow-[0_0.875rem_1rem_rgba(0,50,70,0.32)] will-change-transform";
        piece.style.left = `${(box.left - room.left) / zoom}px`;
        piece.style.top = `${(cut - room.top) / zoom}px`;
        piece.style.width = `${box.width / zoom}px`;
        piece.style.height = `${(box.bottom - cut) / zoom}px`;
        piece.append(edge);
        layer.append(piece);

        gsap.set(strip, { yPercent: -100 * (1 - (STUB * rootSize()) / (box.height / zoom)) });
        printed = nextPrint(printed);
        setPrint(printed);
        gsap.to(light, { opacity: 0.35, duration: 0.3, overwrite: true });
        if (!still) gsap.to(piece, { scale: 1.03, duration: 0.25, ease: "power2.out" });

        const held = piece.getBoundingClientRect();
        const spareX = held.width * (1 - SHOW);
        const spareY = held.height * (1 - SHOW);
        let last = 0;
        let settle: gsap.core.Tween | undefined;

        return {
          // It can run past the card's edges, which clip it, and leans with the way it's moving.
          move(dx: number, dy: number) {
            const x = gsap.utils.clamp(room.left - held.left - spareX, room.right - held.right + spareX, dx) / zoom;
            const y = gsap.utils.clamp(room.top - held.top - spareY, room.bottom - held.bottom + spareY, dy) / zoom;
            gsap.set(piece, { x, y });
            gsap.to(piece, { rotation: gsap.utils.clamp(-LEAN, LEAN, (x - last) * 0.8), duration: 0.3, ease: "power2.out", overwrite: "auto" });
            last = x;
            settle?.kill();
            settle = gsap.delayedCall(0.1, () => gsap.to(piece, { rotation: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" }));
          },
          drop() {
            settle?.kill();
            const print = () => {
              waiting = false;
              run(isOpen() ? 0 : rest);
            };
            if (still) {
              piece.remove();
              print();
              return;
            }
            const fall = (room.bottom - piece.getBoundingClientRect().top) / zoom + 40;
            const turn = Number(gsap.getProperty(piece, "rotation"));
            gsap.to(piece, { y: `+=${fall}`, rotation: turn + (turn < 0 ? -9 : 9), duration: 0.75, ease: "power2.in", overwrite: true, onComplete: () => piece.remove() });
            gsap.delayedCall(0.4, print);
          },
        };
      };

      const press = (down: PointerEvent) => {
        if (busy || down.button) return;
        let piece: ReturnType<typeof tear> | null = null;
        follow(
          strip,
          down,
          (dx, dy) => {
            if (!piece && Math.hypot(dx, dy) >= TEAR_AT) piece = tear();
            piece?.move(dx, dy);
          },
          () => piece?.drop(),
        );
      };

      strip.addEventListener("pointerdown", press);
      return () => {
        strip.removeEventListener("pointerdown", press);
        feed.current = () => {};
        layer.replaceChildren();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal {...handlers} className={`${shell} bg-react text-ink sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(17.5rem,1fr)] sm:gap-x-8 lg:col-span-7 min-[80rem]:col-span-6`}>
      <div className="flex flex-col items-start gap-4">
        <h3 className={tileTitle}>{snacks.title}</h3>
        <p className={tileText}>{snacks.text}</p>
        <AddPill id="snacks" title={snacks.title} tone={onLight} />
      </div>

      <div className="flex flex-col items-center pb-6 max-sm:mt-4">
        <div className="relative z-1 h-10 w-full max-w-[17.5rem] rounded-[0.625rem] bg-linear-to-b from-ink-soft to-ink shadow-[0_0.625rem_1rem_-0.375rem_rgba(0,50,70,0.55)]">
          <span data-light className="absolute right-4 top-3 size-2 rounded-full bg-react opacity-35" />
          <span className="absolute inset-x-4 bottom-2 h-1.5 rounded-full bg-black" />
        </div>

        {/* This sits in front of the printer with its top edge along the middle of the slot, and cuts the strip off there, so the paper comes out of the slot itself. Only the top is cut, so the shadow still falls past the sides and the end. */}
        <div data-slot className="@container relative z-2 -mt-[0.6875rem] w-[min(15rem,calc(100%-1.25rem))]" style={{ clipPath: "inset(0 -4rem -4rem -4rem)" }}>
          <div data-strip className="cursor-grab touch-pan-y select-none drop-shadow-[0_0.875rem_1rem_rgba(0,50,70,0.32)] will-change-transform active:cursor-grabbing">
            <div className="relative overflow-hidden" style={{ clipPath: tornEnd }}>
              <div className={`${grain} flex flex-col gap-2.5 px-[7cqw] pb-7 pt-6 font-mono text-[clamp(0.8125rem,5.2cqw,1rem)] leading-snug text-ink`}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="m-0 text-[1.25em] font-bold tracking-[0.06em]">REACT CEBU</p>
                  <p className="m-0">Snacks and drinks for {print.people}</p>
                </div>
                <div className="border-t border-dashed border-ink/40" />
                <div className="flex flex-col gap-1">
                  {print.order.map(({ name, amount }) => (
                    <Item key={name} name={name} amount={amount} />
                  ))}
                </div>
                <div className="border-t border-dashed border-ink/40" />
                <Item name="From" amount={teamName(team)} />
                <div className="-mx-2 flex items-baseline justify-between gap-3 rounded-[0.125rem] bg-ink whitespace-nowrap px-3 py-1.5 text-[1.25em] font-bold text-white">
                  <span>At the door</span>
                  <span>₱0.00</span>
                </div>
                <div aria-hidden="true" className="mt-1 flex h-9 justify-center gap-px">
                  {print.bars.map((width, i) => (
                    <span key={i} className={i % 2 ? "bg-transparent" : "bg-ink"} style={{ width: `${width * 0.22}rem` }} />
                  ))}
                </div>
                <p className="m-0 whitespace-nowrap text-center">{print.thanks}</p>
              </div>

              {/* Light that moves with the paper: the curl at both edges and one soft crease. */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.06),transparent_9%,transparent_91%,rgba(0,0,0,0.07))]" />
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[11rem] h-8 bg-linear-to-b from-transparent to-black/[0.022]" />
            </div>
          </div>
          {/* The slot's shadow stays put while the paper slides out of it. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b from-black/30 to-transparent" />
        </div>
      </div>

      {/* A torn piece lies here, above everything in the card and clipped by its edges. */}
      <div data-loose aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" />
    </div>
  );
}

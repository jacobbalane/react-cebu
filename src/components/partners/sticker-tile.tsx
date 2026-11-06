"use client";

import { useRef } from "react";
import { ways } from "@/components/partners/offer";
import { AtomSticker, BracesSticker, CreditSticker, FreeSticker, HeartSticker, ShirtSticker } from "@/components/partners/stickers";
import { AddPill, follow, grain, lying, moves, onLight, rise, shell, tileText, tileTitle, useLift, zoomOf } from "@/components/partners/ways-tile";
import { gsap, useGSAP } from "@/lib/gsap";

const prizes = ways[2];

const sheet = [<AtomSticker key="atom" />, <ShirtSticker key="shirt" />, <CreditSticker key="credit" />, <FreeSticker key="free" />, <BracesSticker key="braces" />, <HeartSticker key="heart" />];

// How far a stuck sticker is pulled, as a share of its width, before it comes away.
const PEEL_OFF = 0.55;
// How far the fold travels for each pixel pulled. Paper folds at half the speed of the hand, with a little extra so it reads.
const FOLD = 0.6;
// How far a press has to move, in pixels, before there's a direction to peel from.
const PEEL_AT = 5;

type Point = { x: number; y: number };

const centre = (element: HTMLElement): Point => {
  const box = element.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
};

const polygon = (points: Point[]) => `polygon(${points.map((p) => `${p.x}px ${p.y}px`).join(", ")})`;

/**
 * Folds a sticker along a line at right angles to the pull. The part ahead of the line stays as it
 * is. The part behind it is mirrored across the line and drawn white, as the sticker's back, so the
 * fold follows the sticker's real outline.
 */
function fold(sticker: HTMLElement, pull: Point, amount: number) {
  const flat = sticker.querySelector<HTMLElement>("[data-flat]");
  const flap = sticker.querySelector<HTMLElement>("[data-flap]");
  if (!flat || !flap) return;
  const size = parseFloat(getComputedStyle(sticker).width);
  const half = size / 2;
  const line = { x: half - pull.x * half + pull.x * amount, y: half - pull.y * half + pull.y * amount };
  const reach = size * 3;
  const one = { x: line.x - pull.y * reach, y: line.y + pull.x * reach };
  const two = { x: line.x + pull.y * reach, y: line.y - pull.x * reach };
  const shift = (p: Point, by: number) => ({ x: p.x + pull.x * by, y: p.y + pull.y * by });
  flat.style.clipPath = polygon([one, two, shift(two, reach), shift(one, reach)]);
  flap.style.clipPath = polygon([one, two, shift(two, -reach), shift(one, -reach)]);
  const across = line.x * pull.x + line.y * pull.y;
  const skew = -2 * pull.x * pull.y;
  flap.style.transform = `matrix(${1 - 2 * pull.x * pull.x}, ${skew}, ${skew}, ${1 - 2 * pull.y * pull.y}, ${2 * across * pull.x}, ${2 * across * pull.y})`;
  flap.style.display = "block";
}

function unfold(sticker: HTMLElement) {
  const flat = sticker.querySelector<HTMLElement>("[data-flat]");
  const flap = sticker.querySelector<HTMLElement>("[data-flap]");
  if (!flat || !flap) return;
  flat.style.clipPath = "none";
  flap.style.display = "none";
}

/**
 * A sheet of stickers. A sticker on the sheet's backing paper lifts straight off. Dropped with any
 * part on the card, it sticks. Pulling a stuck sticker curls up the edge opposite the pull until it
 * comes away, unless that edge is over the sheet, which it was never stuck to.
 */
export function StickerTile() {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useLift(ref, "prizes", (line, box) => rise(line, box, { y: "2rem", rotation: 3 }, { y: "0.75rem", rotation: 1 }));

  useGSAP(
    () => {
      const tile = ref.current;
      const paper = tile?.querySelector<HTMLElement>("[data-object]");
      const layer = tile?.querySelector<HTMLElement>("[data-stuck]");
      if (!tile || !paper || !layer) return;

      const stuck = new WeakSet<HTMLElement>();
      let top = 1;

      // Moves a sticker to another parent without it shifting on screen.
      const place = (sticker: HTMLElement, parent: HTMLElement) => {
        const zoom = zoomOf(sticker);
        const size = parseFloat(getComputedStyle(sticker).width);
        const before = centre(sticker);
        const turn = Number(gsap.getProperty(paper, "rotation"));
        const onPaper = parent !== layer;
        parent.append(sticker);
        sticker.style.width = `${size}px`;
        sticker.style.height = `${size}px`;
        gsap.set(sticker, { x: 0, y: 0, rotation: onPaper ? 0 : turn });
        const after = centre(sticker);
        const dx = (before.x - after.x) / zoom;
        const dy = (before.y - after.y) / zoom;
        // On the paper, distances run along its tilt.
        const angle = onPaper ? (-turn * Math.PI) / 180 : 0;
        gsap.set(sticker, { x: dx * Math.cos(angle) - dy * Math.sin(angle), y: dx * Math.sin(angle) + dy * Math.cos(angle) });
      };

      const stops = gsap.utils.toArray<HTMLElement>("[data-peel]", tile).map((sticker) => {
        const cell = sticker.parentElement as HTMLElement;

        const press = (down: PointerEvent) => {
          if (down.button) return;
          // In hand it lies in the card's own layer, so it sits above everything and ignores the paper's movement.
          if (sticker.parentElement !== layer) place(sticker, layer);
          top += 1;
          sticker.style.zIndex = String(top);

          const box = sticker.getBoundingClientRect();
          const room = tile.getBoundingClientRect();
          const backing = paper.getBoundingClientRect();
          const size = parseFloat(getComputedStyle(sticker).width);
          const startX = Number(gsap.getProperty(sticker, "x"));
          const startY = Number(gsap.getProperty(sticker, "y"));
          const toX = gsap.quickTo(sticker, "x", { duration: 0.12, ease: "power3.out" });
          const toY = gsap.quickTo(sticker, "y", { duration: 0.12, ease: "power3.out" });
          const lift = () => gsap.to(sticker, { scale: 1.08, duration: 0.2, ease: "power2.out" });

          let mode: "free" | "waiting" | "peeling" = stuck.has(sticker) && moves() ? "waiting" : "free";
          let pull: Point = { x: 0, y: 0 };
          let folded = 0;
          if (mode === "free") lift();

          const letGo = () => {
            const state = { amount: folded };
            const way = pull;
            gsap.to(state, {
              amount: 0,
              duration: 0.2,
              ease: "power2.out",
              onUpdate: () => fold(sticker, way, state.amount),
              onComplete: () => unfold(sticker),
            });
          };

          follow(
            sticker,
            down,
            (dx, dy, zoom) => {
              const distance = Math.hypot(dx, dy);
              if (mode === "waiting") {
                if (distance < PEEL_AT) return;
                pull = { x: dx / distance, y: dy / distance };
                // The edge opposite the pull. Only a part stuck to the card can peel.
                const tail = { x: box.left + box.width / 2 - (pull.x * box.width) / 2.4, y: box.top + box.height / 2 - (pull.y * box.height) / 2.4 };
                const onBacking = tail.x > backing.left && tail.x < backing.right && tail.y > backing.top && tail.y < backing.bottom;
                mode = onBacking ? "free" : "peeling";
                if (onBacking) {
                  stuck.delete(sticker);
                  lift();
                }
              }
              if (mode === "peeling") {
                if (distance) pull = { x: dx / distance, y: dy / distance };
                folded = (distance / zoom) * FOLD;
                fold(sticker, pull, folded);
                if (distance / zoom < size * PEEL_OFF) return;
                mode = "free";
                stuck.delete(sticker);
                letGo();
                lift();
              }
              toX(startX + gsap.utils.clamp(room.left - box.left, room.right - box.right, dx) / zoom);
              toY(startY + gsap.utils.clamp(room.top - box.top, room.bottom - box.bottom, dy) / zoom);
            },
            () => {
              if (mode === "peeling") {
                letGo();
                return;
              }
              if (mode === "waiting") return;
              gsap.to(sticker, { scale: 1, duration: 0.25, ease: "power2.out" });
              // quickTo is still catching up to the pointer, so wait for it before measuring where the sticker landed.
              gsap.delayedCall(0.14, () => {
                const landed = sticker.getBoundingClientRect();
                const edge = landed.width * 0.08;
                const sheetBox = paper.getBoundingClientRect();
                const onSheet = landed.left + edge >= sheetBox.left && landed.right - edge <= sheetBox.right && landed.top + edge >= sheetBox.top && landed.bottom - edge <= sheetBox.bottom;
                if (onSheet) {
                  stuck.delete(sticker);
                  place(sticker, cell);
                } else {
                  stuck.add(sticker);
                }
              });
            },
          );
        };

        sticker.addEventListener("pointerdown", press);
        return () => sticker.removeEventListener("pointerdown", press);
      });

      return () => stops.forEach((stop) => stop());
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal {...hover} className={`${shell} bg-fog text-ink lg:col-span-4 lg:max-[80rem]:bg-react min-[80rem]:col-span-3`}>
      <h3 className={tileTitle}>{prizes.title}</h3>
      <p className={tileText}>{prizes.text}</p>
      <div><AddPill id="prizes" title={prizes.title} tone={onLight} /></div>
      <div className="flex min-h-[11rem] flex-[1_1_0px] justify-center">
        <div data-object className={`${grain} ${lying} grid h-max w-[min(19rem,100%)] grid-cols-3 gap-3 rounded-[0.25rem] px-5 pb-16 pt-5`}>
          {sheet.map((sticker, i) => (
            // The cell keeps its space on the sheet when its sticker is carried off.
            <div key={i} className="relative aspect-square">
              <div data-peel className="pointer-events-auto absolute left-0 top-0 size-full cursor-grab touch-none select-none drop-shadow-[0_0.3rem_0.45rem_rgba(0,0,0,0.3)] active:cursor-grabbing">
                <div data-flat className="size-full">{sticker}</div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 drop-shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.3)]">
                  <div data-flap className="hidden size-full origin-top-left [filter:brightness(0)_invert(0.95)]">{sticker}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Stickers in hand or stuck to the card lie here, so they stay put when the paper moves. */}
      <div data-stuck className="pointer-events-none absolute inset-0 z-10" />
    </div>
  );
}

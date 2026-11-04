"use client";

import { useRef } from "react";
import { TransitionLink } from "@/components/page-transition";
import { Reveal, SplitHeading } from "@/components/motion";
import { Draggable, gsap, useGSAP } from "@/lib/gsap";

// Each group's mark, drawn in one colour (the card's mark tone) and cropped by the card's corner.
type Mark = (props: { className: string }) => React.ReactElement;

const Shield: Mark = ({ className }) => (
  // Angular's logo: the shield's left half in the mark tone and its right half a shade darker, as
  // the logo's two reds, with the white A on top.
  <svg viewBox="19 24 212 212" className={className} aria-hidden="true">
    <path d="M125 30L31.9 63.2L46.1 186.3L125 230Z" fill="currentColor" />
    <path d="M125 30L218.1 63.2L203.9 186.3L125 230Z" className="text-[#dcdcdc]" fill="currentColor" />
    <path d="M125 52.1L66.8 182.6H88.5L100.2 153.4H149.6L161.3 182.6H183L125 52.1ZM142 135.4H108L125 94.5Z" fill="white" fillRule="evenodd" />
  </svg>
);

const Atom: Mark = ({ className }) => (
  // React's logo, at its official proportions, framed so the orbits fill the same share of the box
  // as the other two marks.
  <svg viewBox="-12.5 -12.5 25 25" className={className} aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
    <circle r="2.05" fill="currentColor" />
  </svg>
);

const Vee: Mark = ({ className }) => (
  // Vue's logo: the outer V in the mark tone and the inner V nested in it a shade darker, as the
  // logo's two greens.
  <svg viewBox="0 0 262 227" className={className} aria-hidden="true">
    <path d="M161.1 0L130.9 52.4L100.6 0H0L130.9 226.7L261.7 0Z" fill="currentColor" />
    <path d="M161.1 0H209.4L130.9 136L52.3 0H100.6L130.9 52.4Z" className="text-[#dcdcdc]" fill="currentColor" />
  </svg>
);

const groups: { name: string; tile: string; mark: Mark; markTone: string; body: React.ReactNode }[] = [
  {
    name: "Angular Cebu",
    tile: "bg-white text-ink",
    mark: Shield,
    markTone: "text-fog",
    body: <p className="m-0 max-w-[22ch] text-base leading-snug">Angular developers in Cebu</p>,
  },
  {
    name: "React Cebu",
    tile: "bg-react text-ink",
    mark: Atom,
    // React cyan with a third white mixed in: a soft tint on the card, as the fog marks sit on white.
    markTone: "text-[#59e6ff]",
    body: (
      <div className="flex flex-col items-start gap-5">
        <p className="m-0 max-w-[30ch] text-base leading-snug">
          One of three communities under JavaScript Cebu. We share events, speakers and a lot of pizza.
        </p>
        <TransitionLink href="/community#family" className="btn btn-black">
          Meet the family
        </TransitionLink>
      </div>
    ),
  },
  {
    name: "Vue.js Cebu",
    tile: "bg-white text-ink",
    mark: Vee,
    markTone: "text-fog",
    body: <p className="m-0 max-w-[22ch] text-base leading-snug">Vue.js developers in Cebu</p>,
  },
];

// While a card is in hand: the most it leans, in degrees, and how much it lifts.
const LEAN = 4;
const LIFT = 1.03;
// The furthest a card carries on after it is let go mid-move, in pixels.
const CARRY = 90;
// The least share of a card that must stay in view once a card is let go, and how finely each
// card is sampled to tell.
const SHOW = 0.25;
const GRID = 8;
// How strongly each card's shadow shows, as the opacity of a shadow drawn once behind it: none for
// a card with nothing under it, some for a card resting on another, more for React on top, and
// full for the card in hand. Only the opacity eases, which needs no repainting.
const SHADE = { flat: 0, over: 0.5, top: 0.7, held: 1 };

/**
 * React Cebu between its two sister communities under JavaScript Cebu: three cards of one size,
 * side by side, that rise in like the rest of the page. On a wide screen each card can be picked
 * up and moved around the panel: the one in hand lifts a little and leans into the drag, then
 * settles flat where it lands. React always stays on top. A card can be dragged past the panel's
 * edge, which cuts it off, and over the others; let go where less than a quarter of any card
 * would show, it eases back to the nearest place where enough does. A card resting on another
 * casts a shadow on it, so the stacking order shows. The "Meet the family" link still clicks.
 */
export function Family() {
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Not on phones and narrow screens, where the stacked cards fill the width and dragging
      // them would stop the page from scrolling.
      mm.add("(min-width: 1024px)", () => {
        const box = panel.current;
        if (!box) return;
        const cards = gsap.utils.toArray<HTMLElement>("[data-drag]", box);
        // Where a card has been dragged to, from GSAP's own record, so no layout is read.
        const at = (card: HTMLElement) => ({ x: Number(gsap.getProperty(card, "x")), y: Number(gsap.getProperty(card, "y")) });
        // React always stays on top. Of the two behind it, the one last picked up sits higher. The
        // order is kept here rather than read back from the page.
        const front = cards.find((card) => card.dataset.drag === "front");
        const layer = new Map(cards.map((card) => [card, card === front ? 3 : 1]));
        const depth = (card: HTMLElement) => layer.get(card) ?? 0;
        const stack = () => gsap.set(cards, { zIndex: (_: number, card: HTMLElement) => depth(card) });
        stack();
        const raise = (card: HTMLElement) => {
          if (card === front) return;
          cards.forEach((other) => other !== front && layer.set(other, other === card ? 2 : 1));
          stack();
        };

        // The panel's size and each card's place in it before any drag, measured when a card is
        // picked up rather than while it moves, so the browser never has to work out the layout
        // mid-drag.
        let size = { w: box.clientWidth, h: box.clientHeight };
        const slots = new Map<HTMLElement, { left: number; top: number; width: number; height: number }>();
        const measure = () => {
          size = { w: box.clientWidth, h: box.clientHeight };
          cards.forEach((card) => slots.set(card, { left: card.offsetLeft, top: card.offsetTop, width: card.offsetWidth, height: card.offsetHeight }));
        };
        measure();

        // A card's box in the panel, ignoring its lean and lift, where it is or at a given offset.
        const boxOf = (card: HTMLElement, { x, y } = at(card)) => {
          const slot = slots.get(card)!;
          const left = slot.left + x;
          const top = slot.top + y;
          return { left, top, right: left + slot.width, bottom: top + slot.height };
        };

        // The card in hand, and how strongly each card's shadow shows now. A card casts a shadow
        // only where it rests on another, so side by side they stay flat; the one in hand always
        // does.
        let held: HTMLElement | null = null;
        const shadows = cards.map((card) => card.querySelector<HTMLElement>("[data-shade]"));
        const looks = new Map<HTMLElement, number>();
        const shade = () =>
          cards.forEach((card, i) => {
            const r = boxOf(card);
            const over = cards.some((other) => {
              const o = boxOf(other);
              return depth(other) < depth(card) && r.left < o.right && o.left < r.right && r.top < o.bottom && o.top < r.bottom;
            });
            const look = card === held ? SHADE.held : !over ? SHADE.flat : card === front ? SHADE.top : SHADE.over;
            if (looks.get(card) === look) return;
            looks.set(card, look);
            gsap.to(shadows[i], { opacity: look, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          });

        // The least of any card that shows, with `moved` at x, y: each card's box is sampled on a
        // grid, and a point counts if it is inside the panel, which clips the cards, and no card
        // above it covers it.
        const leastShown = (moved: HTMLElement, x: number, y: number) => {
          const order = [...cards].sort((a, b) => depth(a) - depth(b) || cards.indexOf(a) - cards.indexOf(b));
          const rects = order.map((card) => (card === moved ? boxOf(card, { x, y }) : boxOf(card)));
          let least = 1;
          rects.forEach((r, i) => {
            const above = rects.slice(i + 1);
            let shown = 0;
            for (let gx = 0; gx < GRID; gx++) {
              for (let gy = 0; gy < GRID; gy++) {
                const px = r.left + ((gx + 0.5) / GRID) * (r.right - r.left);
                const py = r.top + ((gy + 0.5) / GRID) * (r.bottom - r.top);
                const inside = px > 0 && px < size.w && py > 0 && py < size.h;
                if (inside && !above.some((a) => px > a.left && px < a.right && py > a.top && py < a.bottom)) shown++;
              }
            }
            least = Math.min(least, shown / (GRID * GRID));
          });
          return least;
        };

        const drags = cards.map((card) => {
          // How far it leans, following the drag sideways and easing back upright when it stops.
          const lean = gsap.quickTo(card, "rotation", { duration: 0.4, ease: "power3.out" });
          const settle = () => {
            lean(0);
            gsap.to(card, { scale: 1, duration: 0.4, ease: "power3.out" });
            if (held === card) held = null;
            shade();
          };
          // Where the card may go: past the panel's edges, which cut it off, but never so far that
          // less than a quarter of its width or height is still inside. Never so tight that it
          // shuts out where the card sits now.
          const limits = () => {
            const { left, top, width: w, height: h } = slots.get(card)!;
            const { x, y } = at(card);
            return {
              minX: Math.min(x, w * SHOW - w - left),
              maxX: Math.max(x, size.w - w * SHOW - left),
              minY: Math.min(y, h * SHOW - h - top),
              maxY: Math.max(y, size.h - h * SHOW - top),
            };
          };
          let bounds = limits();
          // Where it was picked up, which is a place it fits.
          let start = at(card);
          // Where the card comes to rest when let go heading for `aim`: there, if every card still
          // shows a quarter (or no less than when it was picked up); otherwise as far along the
          // way from where it was picked up as still fits, then slid along whichever way does.
          const rest = (aim: { x: number; y: number }) => {
            const want = { x: gsap.utils.clamp(bounds.minX, bounds.maxX, aim.x), y: gsap.utils.clamp(bounds.minY, bounds.maxY, aim.y) };
            const floor = Math.min(SHOW, leastShown(card, start.x, start.y));
            const fits = (p: { x: number; y: number }) => leastShown(card, p.x, p.y) >= floor;
            if (fits(want)) return want;
            let lo = 0;
            let hi = 1;
            for (let i = 0; i < 12; i++) {
              const mid = (lo + hi) / 2;
              if (fits({ x: start.x + (want.x - start.x) * mid, y: start.y + (want.y - start.y) * mid })) lo = mid;
              else hi = mid;
            }
            const reach = { x: start.x + (want.x - start.x) * lo, y: start.y + (want.y - start.y) * lo };
            return [{ x: want.x, y: reach.y }, { x: reach.x, y: want.y }].find(fits) ?? reach;
          };

          // Where it has been over the last moments of the drag, to tell how fast it was moving.
          let trail: { x: number; y: number; t: number }[] = [];

          // The card follows the pointer freely while held. How much of each card shows is only
          // settled once it is let go, so nothing holds it back or jumps mid-drag.
          const [drag] = Draggable.create(card, {
            type: "x,y",
            bounds,
            // A hard stop at the limits.
            edgeResistance: 1,
            zIndexBoost: false,
            cursor: "grab",
            activeCursor: "grabbing",
            onPress() {
              gsap.killTweensOf(card, "x,y");
              this.update();
              measure();
              raise(card);
              bounds = limits();
              this.applyBounds(bounds);
              start = at(card);
              trail = [];
              held = card;
              shade();
              gsap.to(card, { scale: LIFT, duration: 0.25, ease: "power2.out" });
            },
            onDrag() {
              lean(gsap.utils.clamp(-LEAN, LEAN, this.deltaX * 0.8));
              const t = performance.now();
              trail = [...trail.filter((p) => t - p.t < 100), { x: this.x, y: this.y, t }];
              shade();
            },
            // Let go mid-move, it carries on a short way and eases to a stop; let go still, it
            // stays put. Either way, where it would hide too much it eases back to where it fits.
            onRelease() {
              const t = performance.now();
              const recent = trail.filter((p) => t - p.t < 80);
              const from = at(card);
              let aim = from;
              if (recent.length > 1) {
                const first = recent[0];
                const span = Math.max(16, t - first.t);
                const carry = (d: number) => gsap.utils.clamp(-CARRY, CARRY, (d / span) * 120);
                aim = { x: from.x + carry(from.x - first.x), y: from.y + carry(from.y - first.y) };
              }
              const to = rest(aim);
              if (to.x !== from.x || to.y !== from.y) {
                gsap.to(card, { ...to, duration: 0.6, ease: "power3.out", onUpdate: shade, onComplete: () => this.update() });
              }
              settle();
            },
          });
          return drag;
        });
        return () => {
          drags.forEach((drag) => drag.kill());
          // Back in the row with no shadows, for the stacked layout on a narrower screen.
          gsap.set(cards, { clearProps: "transform,zIndex" });
          gsap.set(shadows, { clearProps: "opacity" });
        };
      });
      return () => mm.revert();
    },
    { scope: panel },
  );

  return (
    <section aria-labelledby="family-title" className="px-2 pb-32">
      {/* A fog panel holding the heading and the cards, so the family reads as one group. It clips
          any card dragged past its edge. The heading is inset to line up with the cards' text. */}
      <div ref={panel} className="relative overflow-hidden rounded-[12px] bg-fog p-2">
        <SplitHeading id="family-title" className="display mb-0 text-balance px-7 pb-10 pt-8 text-[clamp(40px,4.2vw,60px)]">
          Three frameworks, one family under JavaScript Cebu
        </SplitHeading>

        {/* Cards of one fixed size, 380 by 507, centred in a row; they share the row evenly when it
            is narrower than three of them, and stack on phones. */}
        <Reveal className="flex flex-col items-center gap-2 pb-12 lg:flex-row lg:justify-center lg:pb-16">
          {groups.map(({ name, tile, mark: Mark, markTone, body }) => (
            <div
              key={name}
              data-reveal
              data-drag={name === "React Cebu" ? "front" : ""}
              className="relative aspect-[3/4] w-full max-w-[380px] lg:w-[calc((100%-16px)/3)]"
            >
              {/* The card's shadow, drawn once and faded in and out to show how the cards stack. */}
              <span
                data-shade
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 shadow-[0_4px_8px_rgba(0,0,0,0.1),0_24px_48px_rgba(0,0,0,0.16)] will-change-[opacity]"
              />
              <div className={`tile flex h-full flex-col justify-between gap-6 p-6 sm:p-7 ${tile}`}>
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-[8%] -right-[10%] block w-[66%]">
                  <Mark className={`block w-full ${markTone}`} />
                </span>
                <h3 className="relative m-0 text-[clamp(28px,3vw,40px)] font-normal leading-[1.02] tracking-[-0.04em]">{name}</h3>
                <div className="relative">{body}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

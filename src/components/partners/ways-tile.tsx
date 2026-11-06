"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useOffer, type WayId } from "@/components/partners/offer";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

export const tileTitle = "title m-0 text-[clamp(1.75rem,2.7vw,2.5rem)]";
export const tileText = "m-0 max-w-[36ch] text-lg leading-normal";
export const onLight = "btn-black focus-visible:outline-ink!";
export const shell = "tile flex min-h-[29rem] flex-col gap-4 p-7 pb-0 sm:p-10 sm:pb-0 lg:p-7 lg:pb-0 min-[88rem]:p-10 min-[88rem]:pb-0";
// Paper has a soft shadow because it really is lying on top of the tile, and a little grain so it doesn't read as a white box.
export const grain = "bg-white bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .05 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E\")]";
export const lying = "shadow-[0_1.25rem_2.5rem_-0.75rem_rgba(0,0,0,0.45),0_0.125rem_0.375rem_rgba(0,0,0,0.2)]";

export const moves = () => window.matchMedia(MOTION_OK).matches;
export const rootSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

/** How far the grid's CSS zoom has scaled an element. Pointer distances are screen pixels, so they're divided by this. */
export const zoomOf = (element: HTMLElement) => (element as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? 1;

/**
 * Follows one pointer from press to release, reporting how far it has moved on screen. These cards
 * use this and not Draggable because Draggable can't measure inside the grid's CSS zoom.
 */
export function follow(element: HTMLElement, down: PointerEvent, move: (dx: number, dy: number, zoom: number) => void, end: () => void) {
  const zoom = zoomOf(element);
  const watch = (event: PointerEvent) => {
    if (event.pointerId === down.pointerId) move(event.clientX - down.clientX, event.clientY - down.clientY, zoom);
  };
  const stop = (event: PointerEvent) => {
    if (event.pointerId !== down.pointerId) return;
    window.removeEventListener("pointermove", watch);
    window.removeEventListener("pointerup", stop);
    window.removeEventListener("pointercancel", stop);
    end();
  };
  element.setPointerCapture(down.pointerId);
  window.addEventListener("pointermove", watch);
  window.addEventListener("pointerup", stop);
  window.addEventListener("pointercancel", stop);
}

export function AddPill({ id, title, tone }: { id: WayId; title: string; tone: string }) {
  const { picked, toggle } = useOffer();
  const on = picked.some((way) => way.id === id);
  const swap = "col-start-1 row-start-1 flex items-center gap-2 transition-opacity duration-300";
  return (
    <button type="button" aria-pressed={on} aria-label={`${title}: add to my offer`} onClick={() => toggle(id)} className={`btn whitespace-nowrap ${tone}`}>
      <span className="grid">
        <span className={`${swap} ${on ? "opacity-0" : "opacity-100"}`}>Add to my offer</span>
        <span className={`${swap} ${on ? "opacity-100" : "opacity-0"}`}>
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="M3 8.5L6.5 12L13 4.5" />
          </svg>
          In my offer
        </span>
      </span>
    </button>
  );
}

/** Tells a tile whether its object should be open: while it's looked at, or while its way is in the offer. */
export function useLook(tile: RefObject<HTMLDivElement | null>, id: WayId, show: (open: boolean) => void) {
  const on = useOffer().picked.some((way) => way.id === id);
  // Kept apart, because a click moves focus: leaving a button mustn't count as the pointer leaving the card.
  const over = useRef(false);
  const focused = useRef(false);
  const kept = useRef(on);
  const shown = useRef(show);

  useEffect(() => {
    shown.current = show;
  });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Touch screens have no hover, so each object shows what it does once, as it arrives.
        const arrive = ScrollTrigger.create({
          trigger: tile.current,
          start: "top 65%",
          once: true,
          onEnter: () => {
            if (window.matchMedia("(hover: hover)").matches) return;
            shown.current(true);
            gsap.delayedCall(3, () => {
              if (!kept.current) shown.current(false);
            });
          },
        });
        return () => arrive.kill();
      });
      return () => mm.revert();
    },
    { scope: tile },
  );

  // Ways can also change from the form further down, so the tiles follow the offer itself.
  useEffect(() => {
    kept.current = on;
    shown.current(on || over.current || focused.current);
  }, [on]);

  const isOpen = () => over.current || focused.current || kept.current;
  const point = (now: boolean) => {
    over.current = now;
    shown.current(isOpen());
  };
  const focus = (now: boolean) => {
    focused.current = now;
    shown.current(isOpen());
  };

  return {
    isOpen,
    handlers: {
      onPointerEnter: (event: React.PointerEvent) => event.pointerType === "mouse" && point(true),
      onPointerLeave: (event: React.PointerEvent) => event.pointerType === "mouse" && point(false),
      onFocus: () => focus(true),
      onBlur: () => focus(false),
    },
  };
}

/** Plays a tile's object forward while it's open, and eases it back after. */
export function useLift(tile: RefObject<HTMLDivElement | null>, id: WayId, build: (line: gsap.core.Timeline, box: HTMLElement) => void) {
  const part = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const box = tile.current;
      if (!box) return;
      const mm = gsap.matchMedia();
      mm.add({ moves: MOTION_OK, still: "(prefers-reduced-motion: reduce)" }, (context) => {
        const line = gsap.timeline({ paused: true });
        build(line, box);
        if (context.conditions?.still) {
          line.progress(1);
          return;
        }
        part.current = line;
        return () => {
          part.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: tile },
  );

  return useLook(tile, id, (open) => {
    if (open) part.current?.timeScale(1).play();
    else part.current?.timeScale(1.4).reverse();
  }).handlers;
}

export const rise = (line: gsap.core.Timeline, box: HTMLElement, from: { y: string; rotation: number }, to: { y: string; rotation: number }) => {
  line.fromTo(box.querySelector("[data-object]"), from, { ...to, duration: 0.7, ease: "power3.out" }, 0);
};

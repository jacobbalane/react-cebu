"use client";

import { useEffect, useRef, type MouseEvent, type RefObject } from "react";
import { FACEBOOK_URL, navLinks } from "@/data/site";
import { TransitionLink } from "@/components/page-transition";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const links = [...navLinks, { href: "/partners", label: "Partner with us" }];

/** Every path starts with "/", so Home only counts as current on the home page itself. */
export const isActive = (pathname: string, href: string) =>
  !href.includes("#") && (href === "/" ? pathname === "/" : pathname.startsWith(href));

// Sized by height too, so all five fit a short phone without scrolling.
const LINK = "display text-[clamp(2.25rem,min(10.5vw,8svh),4.5rem)]";

type Motion = { play: (open: boolean) => void; reset: () => void };

/**
 * The menu below lg. The menu button opens out into a fog panel, and the links rise into it once
 * it has nearly filled the screen. Closing fades the words first, then shrinks the panel back into
 * the button, so no word is ever cut by the panel's moving edge. Reduced motion gets a short fade.
 *
 * Focus moves into the menu and back only for keyboard users, so a tap never leaves a focus ring.
 * A link to another page hands the menu over to the page change: the menu drops under its white
 * sheet, which slides up over it as over any page, and once the new page is in, the menu is put
 * away unseen behind the sheet.
 */
export function MobileMenu({
  open,
  pathname,
  onClose,
  toggle,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
  /** The header's menu button, which stays on top of the menu. */
  toggle: RefObject<HTMLButtonElement | null>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion | null>(null);
  // The page a link was picked on, until the next page arrives.
  const leftFrom = useRef<string | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      const panel = el?.querySelector<HTMLElement>("[data-panel]");
      if (!el || !panel) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
      const foot = el.querySelector("[data-foot]");
      // The panel's clip is kept here and written out whole on every frame. Tweening the clip-path
      // string itself read back the browser's shortened "inset(0px round 12px)", which paired the
      // wrong numbers: the corners went square and the edges jumped as it closed.
      const shape = { top: 0, right: 0, bottom: 0, left: 0, radius: 12 };
      const draw = () => {
        panel.style.clipPath = `inset(${shape.top}px ${shape.right}px ${shape.bottom}px ${shape.left}px round ${shape.radius}px)`;
      };
      const full = { top: 0, right: 0, bottom: 0, left: 0, radius: 12 };
      // The button's own shape, right under it.
      const button = () => {
        const b = toggle.current?.getBoundingClientRect();
        const box = panel.getBoundingClientRect();
        if (!b) return { top: 0, right: 0, bottom: box.height, left: 0, radius: 12 };
        return { top: b.top - box.top, right: box.right - b.right, bottom: box.bottom - b.bottom, left: b.left - box.left, radius: b.height / 2 };
      };
      let shown = false;
      let step: gsap.core.Timeline | undefined;

      motion.current = {
        play: (open) => {
          step?.kill();
          if (!window.matchMedia(MOTION_OK).matches) {
            shown = open;
            step = gsap.timeline().to(el, { autoAlpha: open ? 1 : 0, duration: 0.2, ease: "none" });
            return;
          }
          if (open) {
            if (!shown) {
              Object.assign(shape, button());
              draw();
              gsap.set(lines, { yPercent: 110, opacity: 1 });
              gsap.set(foot, { opacity: 0 });
            }
            shown = true;
            step = gsap
              .timeline()
              .set(el, { autoAlpha: 1 })
              .to(shape, { ...full, duration: 0.42, ease: "power4.out", onUpdate: draw }, 0)
              .to(lines, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power4.out", stagger: 0.035 }, 0.2)
              .to(foot, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.3);
            return;
          }
          step = gsap
            .timeline({
              onComplete: () => {
                gsap.set(el, { autoAlpha: 0 });
                shown = false;
              },
            })
            .to([...lines, foot], { opacity: 0, duration: 0.12, ease: "power1.out" }, 0)
            .to(shape, { ...button(), duration: 0.32, ease: "power3.inOut", onUpdate: draw }, 0.04);
        },
        reset: () => {
          step?.kill();
          gsap.set(el, { autoAlpha: 0 });
          shown = false;
        },
      };
    },
    { scope: root },
  );

  useEffect(() => {
    const menu = motion.current;
    const el = root.current;
    if (!menu || !el) return;

    if (open) {
      menu.play(true);
      if (!toggle.current?.matches(":focus-visible")) return;
      const focus = gsap.delayedCall(0.05, () => el.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }));
      return () => {
        focus.kill();
      };
    }

    if (leftFrom.current !== null && leftFrom.current !== pathname) menu.reset();
    else menu.play(false);
    leftFrom.current = null;
    gsap.set(el, { clearProps: "zIndex" });
    // Focus left on a link would vanish with the menu.
    const active = document.activeElement;
    if (active instanceof HTMLElement && el.contains(active)) {
      if (active.matches(":focus-visible")) toggle.current?.focus({ preventScroll: true });
      else active.blur();
    }
  }, [open, pathname, toggle]);

  const pick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (new URL(event.currentTarget.href).pathname === window.location.pathname) {
      onClose();
      return;
    }
    leftFrom.current = window.location.pathname;
    // Under the page change's white sheet (z-35), still under the header.
    gsap.set(root.current, { zIndex: 34 });
  };

  return (
    // Under the header (z-40), so its logo and menu button stay on top, and over the page change's
    // white sheet (z-35).
    <div ref={root} id="mobile-menu" className="invisible fixed inset-0 z-[38] p-2 lg:hidden">
      <div data-panel className="flex h-full flex-col overflow-y-auto overscroll-contain rounded-[12px] bg-fog p-2 pt-[5rem] [scrollbar-width:none]">
        <nav aria-label="Main" className="flex flex-col gap-3">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={pick}
                aria-current={active ? "page" : undefined}
                className={`split-line-mask block overflow-hidden ${LINK}`}
              >
                {/* Every word is padded as a pill, so they all line up; the current page's is cyan. */}
                <span data-line className={`-my-[0.06em] inline-flex px-[0.25em] py-[0.06em] ${active ? "rounded-full bg-react" : ""}`}>
                  {link.label}
                </span>
              </TransitionLink>
            );
          })}
        </nav>
        <div data-foot className="mt-auto pt-10">
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" onClick={onClose} className="btn btn-black min-h-14 px-7 text-lg">
            Join the Facebook page
          </a>
        </div>
      </div>
    </div>
  );
}

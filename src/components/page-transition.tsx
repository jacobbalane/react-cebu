"use client";

import Image from "next/image";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

type Point = { x: number; y: number } | null;

/** Starts the transition to `href`; false when it isn't another page here, so the link navigates as usual. */
const TransitionContext = createContext<(href: string, from: Point) => boolean>(() => false);

/**
 * The atom iris between pages: a React-cyan circle opens from the click to cover the
 * page, the next page loads behind it, then the circle closes into the React Cebu logo
 * in the middle. Reduced motion gets a short fade instead. Back and forward skip it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const atom = useRef<HTMLSpanElement>(null);
  // The page we're heading to, and a timer that uncovers the screen if it never arrives.
  const pending = useRef<string | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout>>(undefined);

  const reveal = useCallback(() => {
    clearTimeout(fallback.current);
    pending.current = null;
    const el = overlay.current;
    if (!el) return;
    const done = () => gsap.set(el, { visibility: "hidden", pointerEvents: "none" });
    if (!window.matchMedia(MOTION_OK).matches) {
      gsap.to(el, { opacity: 0, duration: 0.2, onComplete: done });
      return;
    }
    const radius = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);
    gsap.to(atom.current, { rotate: 25, scale: 0.4, duration: 0.6, ease: "power3.in" });
    gsap.fromTo(
      el,
      { clipPath: `circle(${radius}px at 50% 50%)` },
      { clipPath: "circle(0px at 50% 50%)", duration: 0.6, ease: "power3.inOut", onComplete: done },
    );
  }, []);

  const start = useCallback(
    (href: string, from: Point) => {
      const el = overlay.current;
      const url = new URL(href, window.location.href);
      if (!el || url.origin !== window.location.origin || url.pathname === window.location.pathname) return false;
      // Mid-transition clicks are swallowed rather than starting a second one.
      if (pending.current) return true;
      pending.current = url.pathname;

      gsap.killTweensOf([el, atom.current]);
      gsap.set(el, { visibility: "visible", pointerEvents: "auto", opacity: 1 });
      const go = () => {
        fallback.current = setTimeout(reveal, 6000);
        router.push(href);
      };

      if (!window.matchMedia(MOTION_OK).matches) {
        gsap.fromTo(el, { clipPath: "none", opacity: 0 }, { opacity: 1, duration: 0.2, onComplete: go });
        return true;
      }
      // Open from the click, or from the middle for keyboard activation.
      const { innerWidth: w, innerHeight: h } = window;
      const x = from?.x ?? w / 2;
      const y = from?.y ?? h / 2;
      const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
      // A slight turn, not a spin: the logo's CEBU wordmark would end up upside down.
      gsap.fromTo(atom.current, { rotate: -25, scale: 0.4 }, { rotate: 0, scale: 1, duration: 0.8, ease: "power3.out" });
      gsap.fromTo(
        el,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)`, duration: 0.6, ease: "power3.inOut", onComplete: go },
      );
      return true;
    },
    [router, reveal],
  );

  // The new page has committed: give it two frames to lay out, then uncover it.
  useEffect(() => {
    if (pending.current !== pathname) return;
    let frame = requestAnimationFrame(() => (frame = requestAnimationFrame(reveal)));
    return () => cancelAnimationFrame(frame);
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={start}>
      {children}
      <div
        ref={overlay}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[60] flex items-center justify-center bg-react"
        style={{ clipPath: "circle(0px at 50% 50%)" }}
      >
        <span ref={atom} className="block">
          {/* The React Cebu mark, 646×729. Sized in CSS too, as in the nav logo, so the
              global img height:auto can't round the height a pixel off. Loaded eagerly so
              it's ready for the first transition. */}
          <Image
            src="/images/react-cebu-logo.webp"
            alt=""
            width={142}
            height={160}
            style={{ width: 142, height: 160 }}
            loading="eager"
          />
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

/** next/link that plays the atom iris on its way to another page of the site. */
export function TransitionLink({ onClick, ...props }: ComponentProps<typeof NextLink>) {
  const start = useContext(TransitionContext);
  const from = useRef<Point>(null);
  return (
    <NextLink
      {...props}
      onClick={(event) => {
        // Keyboard activation reports 0,0, which isn't where the visitor is looking.
        from.current = event.clientX || event.clientY ? { x: event.clientX, y: event.clientY } : null;
        onClick?.(event);
      }}
      onNavigate={(event) => {
        if (typeof props.href === "string" && start(props.href, from.current)) event.preventDefault();
      }}
    />
  );
}

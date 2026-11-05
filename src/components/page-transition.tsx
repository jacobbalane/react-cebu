"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

/** Starts the transition to `href`; false when it isn't another page here, so the link navigates as usual. */
const TransitionContext = createContext<(href: string) => boolean>(() => false);

/**
 * The page change: the next page arrives as a blank white sheet sliding up from the bottom of the
 * screen, under the nav, which stays put on top. Once it has covered the old page, the next page
 * loads behind it and its content is painted in as the white fades away. Reduced motion gets a
 * short fade instead. Back and forward skip it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sheet = useRef<HTMLDivElement>(null);
  // The page we're heading to, and a timer that uncovers the screen if it never arrives.
  const pending = useRef<string | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout>>(undefined);

  const reveal = useCallback(() => {
    clearTimeout(fallback.current);
    pending.current = null;
    const el = sheet.current;
    if (!el) return;
    const fast = !window.matchMedia(MOTION_OK).matches;
    gsap.to(el, {
      autoAlpha: 0,
      duration: fast ? 0.2 : 0.6,
      ease: "power1.out",
      onComplete: () => gsap.set(el, { pointerEvents: "none", yPercent: 100 }),
    });
  }, []);

  const start = useCallback(
    (href: string) => {
      const el = sheet.current;
      const url = new URL(href, window.location.href);
      if (!el || url.origin !== window.location.origin || url.pathname === window.location.pathname) return false;
      // Mid-transition clicks are swallowed rather than starting a second one.
      if (pending.current) return true;
      pending.current = url.pathname;

      gsap.killTweensOf(el);
      const calm = !window.matchMedia(MOTION_OK).matches;
      const go = () => {
        fallback.current = setTimeout(reveal, 6000);
        // A section on the next page is SmoothScroll's to glide to, unless motion is off.
        router.push(href, { scroll: calm || !url.hash });
      };
      if (calm) {
        gsap.fromTo(el, { yPercent: 0, autoAlpha: 0, pointerEvents: "auto" }, { autoAlpha: 1, duration: 0.2, onComplete: go });
        return true;
      }
      // Moved by yPercent alone; y stays 0 so no pixel offset ever adds to it.
      gsap.fromTo(
        el,
        { y: 0, yPercent: 100, autoAlpha: 1, pointerEvents: "auto" },
        { yPercent: 0, duration: 0.8, ease: "power3.inOut", onComplete: go },
      );
      return true;
    },
    [router, reveal],
  );

  // The new page has committed: give it two frames to lay out, then paint it in.
  useEffect(() => {
    if (pending.current !== pathname) return;
    let frame = requestAnimationFrame(() => (frame = requestAnimationFrame(reveal)));
    return () => cancelAnimationFrame(frame);
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={start}>
      {children}
      {/* Above the page and below the nav (z-40), so the nav stays on top of the new page. */}
      <div ref={sheet} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[35] bg-white" />
    </TransitionContext.Provider>
  );
}

/** next/link that brings the next page up as a white sheet on its way to another page of the site. */
export function TransitionLink(props: ComponentProps<typeof NextLink>) {
  const start = useContext(TransitionContext);
  return (
    <NextLink
      {...props}
      onNavigate={(event) => {
        if (typeof props.href === "string" && start(props.href)) event.preventDefault();
      }}
    />
  );
}

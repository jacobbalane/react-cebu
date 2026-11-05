"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

const LenisContext = createContext<RefObject<Lenis | null>>({ current: null });

/** The Lenis instance lives in a ref: read it when acting, it is null with reduced motion. */
export function useLenis() {
  return useContext(LenisContext);
}

// A glide takes longer the further it goes, within these bounds, in seconds.
const glideTime = (distance: number) => gsap.utils.clamp(0.9, 1.8, 0.7 + distance / 4000);
// Arriving from another page, the page lands this share of a screen short of its section and
// glides the rest of the way as the white sheet clears.
const ARRIVAL_LEAD = 0.6;
const ARRIVAL_TIME = 1.2;

const sectionAt = (hash: string) => (hash.length > 1 ? document.getElementById(hash.slice(1)) : null);
const glide = (lenis: Lenis, section: HTMLElement, duration: number) => lenis.scrollTo(section, { duration, easing: gsap.parseEase("power3.inOut") });

// Lenis drives the page scroll and feeds ScrollTrigger, so pinned and scrubbed sections stay in
// step with the smoothed position. It also takes every link to a section: one on this page glides
// there, and one from another page arrives with a short glide. With reduced motion there's no
// Lenis, and they jump as links normally do.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;

    const instance = new Lenis({ autoRaf: false });
    const tick = (time: number) => instance.raf(time * 1000);

    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.current = instance;

    // Listens on the way down, ahead of next/link, which leaves a click alone once it's handled here.
    const follow = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest("a");
      if (!link?.hash || link.target === "_blank" || link.origin !== location.origin || link.pathname !== location.pathname) return;
      const section = sectionAt(link.hash);
      if (!section) return;
      event.preventDefault();
      if (link.hash !== location.hash) history.pushState(null, "", link.hash);
      glide(instance, section, glideTime(Math.abs(section.getBoundingClientRect().top)));
      // The next Tab carries on from the section, as it would after a jump.
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    };
    document.addEventListener("click", follow, true);

    return () => {
      document.removeEventListener("click", follow, true);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = lenis.current;
    const section = sectionAt(location.hash);
    const arriving = lastPath.current !== pathname;
    lastPath.current = pathname;

    if (!section) instance?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
    if (!instance || !section) return;

    // Straight there first, which also says where the section ends up once the page's end is counted.
    instance.scrollTo(section, { immediate: true });
    if (!arriving) return;
    instance.scrollTo(instance.scroll - window.innerHeight * ARRIVAL_LEAD, { immediate: true });
    glide(instance, section, ARRIVAL_TIME);
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

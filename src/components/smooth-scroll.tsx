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

// Lenis drives the page scroll and feeds ScrollTrigger, so pinned and
// scrubbed sections stay in step with the smoothed position.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;

    const instance = new Lenis({ autoRaf: false });
    const tick = (time: number) => instance.raf(time * 1000);

    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.current = instance;

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

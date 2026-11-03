"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * A muted, looping clip that fills its tile. It plays only while on screen,
 * stays on its first frame for reduced motion, and fades in once it has a frame to show.
 */
export function LoopVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(() => {
    const video = ref.current;
    if (!video) return;
    // The first frame can arrive before hydration, when onLoadedData isn't listening yet.
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setReady(true);
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const trigger = ScrollTrigger.create({
        trigger: video,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? video.play().catch(() => {}) : video.pause()),
      });
      return () => {
        trigger.kill();
        video.pause();
      };
    });
    return () => mm.revert();
  });

  return (
    // Video extensions tag <video> elements (data-video="0" and the like) before React
    // hydrates; those extra attributes are harmless, so don't flag them as a mismatch.
    <video
      suppressHydrationWarning
      ref={ref}
      src={src}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      onLoadedData={() => setReady(true)}
      className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}

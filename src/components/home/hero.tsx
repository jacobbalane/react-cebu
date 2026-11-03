"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

type Tile =
  | { type: "photo"; src: string; h: number }
  | { type: "block"; h: number; node: React.ReactNode; className: string };

const columns: { dir: "up" | "down"; duration: number; tiles: Tile[]; className?: string }[] = [
  {
    dir: "up",
    duration: 90,
    tiles: [
      { type: "photo", src: "/images/placeholder.png", h: 520 },
      {
        type: "block",
        h: 300,
        className: "border border-[#e0e0e0] bg-white font-mono text-[13px] leading-[1.35] justify-between md:text-[22px]",
        node: (
          <>
            <span>culpa qui {"{"}</span>
            <span className="pl-7 text-electric">officia</span>
            <span>{"}"}, [])</span>
          </>
        ),
      },
      { type: "photo", src: "/images/placeholder.png", h: 420 },
    ],
  },
  {
    dir: "down",
    duration: 110,
    tiles: [
      {
        type: "block",
        h: 380,
        className: "bg-electric text-white justify-between",
        node: (
          <>
            <span className="text-base">Deserunt mollit anim</span>
            <span className="text-[28px] leading-[0.95] tracking-[-0.045em] md:text-[clamp(36px,3.9vw,56px)]">Id est laborum</span>
          </>
        ),
      },
      { type: "photo", src: "/images/placeholder.png", h: 460 },
      {
        type: "block",
        h: 300,
        className: "bg-sky justify-between",
        node: (
          <>
            <span className="text-base">Lorem ipsum</span>
            <span className="text-[64px] leading-[0.8] tracking-[-0.06em] md:text-[clamp(80px,8.3vw,120px)]">2019</span>
          </>
        ),
      },
    ],
  },
  {
    dir: "up",
    duration: 75,
    className: "hidden md:block",
    tiles: [
      { type: "photo", src: "/images/placeholder.png", h: 400 },
      {
        type: "block",
        h: 340,
        className: "bg-black text-white font-mono text-[17px] leading-[1.6]",
        node: (
          <pre className="m-0 font-mono">
            <span className="text-sky">dolor sit amet</span> Consectetur {"{"}
            {"\n  "}
            <span className="text-soft">{"// lorem ipsum dolor"}</span>
            {"\n  return <>\n    <Lorem />\n    <Ipsum />\n    <Dolor />\n  </>\n}"}
          </pre>
        ),
      },
      { type: "photo", src: "/images/placeholder.png", h: 380 },
    ],
  },
  {
    dir: "down",
    duration: 95,
    className: "hidden md:block",
    tiles: [
      { type: "photo", src: "/images/placeholder.png", h: 460 },
      {
        type: "block",
        h: 320,
        className: "bg-midnight text-white justify-end text-[44px] leading-none tracking-[-0.04em]",
        node: (
          <>
            <span>Adipiscing</span>
            <span className="text-sky">Elit</span>
            <span>Sed do</span>
            <span className="text-sky">Eiusmod</span>
          </>
        ),
      },
      { type: "photo", src: "/images/placeholder.png", h: 400 },
    ],
  },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Each column drifts forever; scrolling briefly speeds every column up.
        const loops = gsap.utils.toArray<HTMLElement>("[data-column]").map((column) => {
          const up = column.dataset.column === "up";
          return gsap.fromTo(
            column,
            { yPercent: up ? 0 : -50 },
            { yPercent: up ? -50 : 0, duration: Number(column.dataset.duration), ease: "none", repeat: -1 },
          );
        });

        ScrollTrigger.create({
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8);
            loops.forEach((loop) => {
              gsap.killTweensOf(loop, "timeScale");
              loop.timeScale(boost);
              gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out" });
            });
          },
        });

        // As you scroll away, the card lifts and the collage moves slower behind it.
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
          .to("[data-hero-card]", { yPercent: -40, scale: 0.94, ease: "none" }, 0)
          .to("[data-hero-grid]", { yPercent: 18, ease: "none" }, 0);

        gsap.from("[data-hero-card]", { y: 60, autoAlpha: 0, duration: 1.1, ease: "power3.out", delay: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative h-[max(720px,100svh)] overflow-hidden">
      <div data-hero-grid aria-hidden="true" className="grid h-full grid-cols-2 gap-2 md:grid-cols-4">
        {columns.map((column, i) => (
          <div key={i} className={`overflow-hidden ${column.className ?? ""}`}>
            <div data-column={column.dir} data-duration={column.duration} className="flex flex-col gap-2">
              {[0, 1].map((copy) =>
                column.tiles.map((tile, j) =>
                  tile.type === "photo" ? (
                    // Eager: the columns move with transforms, so lazy loading would leave
                    // tiles blank as they drift into view. The second copy reuses the cached files.
                    <div key={`${copy}-${j}`} className="relative w-full shrink-0 bg-fog" style={{ height: tile.h }}>
                      <Image
                        src={tile.src}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover"
                        loading="eager"
                        preload={copy === 0 && j === 0}
                      />
                    </div>
                  ) : (
                    <div key={`${copy}-${j}`} className={`flex shrink-0 flex-col p-6 ${tile.className}`} style={{ height: tile.h }}>
                      {tile.node}
                    </div>
                  ),
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        data-hero-card
        className="absolute bottom-2 left-2 right-2 flex flex-col gap-6 rounded-[12px] bg-white p-5 md:bottom-auto md:left-1/2 md:right-auto md:top-[54%] md:w-[min(640px,calc(100%-32px))] md:-translate-x-1/2 md:-translate-y-1/2 md:gap-7 md:p-9"
      >
        <h1 id="hero-title" className="m-0 text-[clamp(28px,3.4vw,48px)] font-normal leading-[1.04] tracking-[-0.04em]">
          Tempor incididunt ut labore et dolore magna aliqua enim.{" "}
          <span className="text-soft">Ad minim veniam quis nostrud exercitation ullamco laboris nisi.</span>
        </h1>
        <div className="flex flex-wrap gap-1.5">
          <Link href="#join" className="btn btn-primary">Aliquip ex ea</Link>
          <Link href="/events" className="btn btn-quiet">Commodo consequat duis</Link>
        </div>
      </div>
    </section>
  );
}

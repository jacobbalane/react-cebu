"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { Recap } from "@/data/recaps";

const tags = ["All", "Meetups", "Workshops", "Code camps", "Hacktoberfest"];

export function RecapGrid({ recaps }: { recaps: Recap[] }) {
  const [tag, setTag] = useState("All");
  const grid = useRef<HTMLDivElement>(null);
  const shown = recaps.filter((recap) => tag === "All" || recap.tag === tag);

  // Cards rise in on first view, and again (quickly) whenever the filter changes.
  useGSAP(
    () => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.from("[data-card]", { y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", scrollTrigger: { trigger: grid.current, start: "top 85%", once: true } });
    },
    { scope: grid, dependencies: [tag], revertOnUpdate: true },
  );

  return (
    <section aria-labelledby="all-title" className="px-2 pb-28">
      <div className="flex flex-wrap items-end justify-between gap-4 px-4 pb-8">
        <h2 id="all-title" className="display text-[clamp(40px,4.2vw,60px)]">All recaps</h2>
        <div role="group" aria-label="Filter recaps" className="flex flex-wrap gap-1">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tag === t}
              onClick={() => setTag(t)}
              className={`btn min-h-11 px-[18px] text-[15px] ${tag === t ? "bg-ink text-white" : "bg-fog text-ink hover:bg-ink hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div ref={grid} className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((recap) => (
          <a key={recap.title} href="#recap" data-card className="group flex flex-col gap-3.5">
            <div className="tile aspect-[16/10] bg-fog">
              <Image src={recap.image} alt={recap.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105" />
            </div>
            <span className="px-2 text-[21px] leading-[1.3] tracking-[-0.015em]">
              <span className="font-medium">{recap.title}</span> <span className="text-muted">{recap.note}</span>
            </span>
            <span className="flex flex-wrap gap-1.5 px-2">
              {recap.has.map((item) => (
                <span key={item} className="rounded-full bg-fog px-3 py-1.5 text-sm">{item}</span>
              ))}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

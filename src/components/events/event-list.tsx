"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { eventDay, eventMonth, eventWeekday, type CommunityEvent } from "@/data/events";

const filters = [
  { label: "All", match: () => true },
  { label: "Meetups", match: (e: CommunityEvent) => e.kind === "Meetup" },
  { label: "Workshops", match: (e: CommunityEvent) => e.kind === "Workshop" },
  { label: "Code camps", match: (e: CommunityEvent) => e.kind === "Code camp" },
  { label: "Online", match: (e: CommunityEvent) => e.kind === "Online" },
];

export function EventList({ events }: { events: CommunityEvent[] }) {
  const [filter, setFilter] = useState("All");
  const [hovered, setHovered] = useState<CommunityEvent | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const moveTo = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  const groups = useMemo(() => {
    const match = filters.find((f) => f.label === filter)!.match;
    const result: { month: string; items: CommunityEvent[] }[] = [];
    for (const event of events.filter(match)) {
      const month = eventMonth(event.start);
      const last = result.at(-1);
      if (last?.month === month) last.items.push(event);
      else result.push({ month, items: [event] });
    }
    return result;
  }, [events, filter]);

  // The hovered event's photo follows the cursor with a little lag.
  useGSAP(
    () => {
      moveTo.current = {
        x: gsap.quickTo(previewRef.current, "x", { duration: 0.45, ease: "power3.out" }),
        y: gsap.quickTo(previewRef.current, "y", { duration: 0.45, ease: "power3.out" }),
      };
    },
    { scope: listRef },
  );

  useGSAP(
    () => {
      gsap.to(previewRef.current, {
        autoAlpha: hovered ? 1 : 0,
        scale: hovered ? 1 : 0.85,
        rotate: -4,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [hovered], scope: listRef },
  );

  return (
    <section aria-labelledby="upcoming-title" className="px-2 pb-28">
      <div className="flex flex-wrap items-end justify-between gap-4 px-4 pb-6">
        <h2 id="upcoming-title" className="display text-[clamp(40px,4.2vw,60px)]">Upcoming</h2>
        <div role="group" aria-label="Filter events by type" className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.label}
              type="button"
              aria-pressed={filter === f.label}
              onClick={() => setFilter(f.label)}
              className={`btn min-h-11 px-[18px] text-[15px] ${filter === f.label ? "bg-black text-white" : "bg-fog text-black hover:bg-black hover:text-white"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={listRef}
        className="relative"
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse" || !listRef.current || !moveTo.current) return;
          const box = listRef.current.getBoundingClientRect();
          moveTo.current.x(event.clientX - box.left - 160);
          moveTo.current.y(event.clientY - box.top - 110);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        {groups.map((group) => (
          <div key={group.month} className="mt-6">
            <h3 className="border-b border-black px-4 pb-3 text-2xl tracking-[-0.02em] text-muted">{group.month}</h3>
            {group.items.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                onPointerEnter={() => setHovered(event)}
                className="grid items-center gap-x-8 gap-y-3 rounded-[10px] border-b border-line px-4 py-6 transition-colors hover:bg-fog lg:grid-cols-[140px_1fr_300px_auto]"
              >
                <span className="flex flex-col">
                  <span className="text-[64px] leading-[0.85] tracking-[-0.06em]">{eventDay(event.start)}</span>
                  <span className="text-[15px] text-muted">{eventWeekday(event.start)}</span>
                </span>
                <span className="text-[32px] leading-[1.05] tracking-[-0.035em]">{event.title}</span>
                <span className="text-base leading-normal text-muted">
                  {event.kind} at {event.venue}
                  <br />
                  {event.timeLabel}
                </span>
                <span className="btn btn-primary min-h-11 justify-self-start px-[18px] text-[15px]">RSVP</span>
              </Link>
            ))}
          </div>
        ))}

        {groups.length === 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[10px] bg-fog px-6 py-10">
            <span className="max-w-[640px] text-[28px] leading-[1.15] tracking-[-0.03em]">
              No {filter.toLowerCase()} events scheduled yet. Subscribe and you’ll hear about the next one first.
            </span>
            <a href="#subscribe" className="btn btn-primary">Subscribe by email</a>
          </div>
        )}

        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 hidden h-[220px] w-[320px] overflow-hidden rounded-[10px] opacity-0 lg:block"
        >
          {hovered && <Image src={hovered.image} alt="" fill sizes="320px" className="object-cover" />}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { ways } from "@/components/partners/offer";
import { AddPill, grain, lying, rise, shell, tileText, tileTitle, useLift } from "@/components/partners/ways-tile";

const room = ways[0];
const checks = ["Seats for 40 to 80", "Projector", "Wi-Fi", "One evening a month"];

/** A real checklist: the rows tick and untick when pressed, and looking at the card only lifts the paper. */
export function ChecklistTile() {
  const ref = useRef<HTMLDivElement>(null);
  const [ticked, setTicked] = useState<string[]>([]);
  const hover = useLift(ref, "room", (line, box) => rise(line, box, { y: "3.5rem", rotation: -4 }, { y: "1.25rem", rotation: -1 }));

  const flip = (check: string) => setTicked((now) => (now.includes(check) ? now.filter((other) => other !== check) : [...now, check]));

  return (
    <div ref={ref} data-reveal {...hover} className={`${shell} bg-azure text-white lg:col-span-5 min-[80rem]:col-span-3`}>
      <h3 className={tileTitle}>{room.title}</h3>
      <p className={tileText}>{room.text}</p>
      <div><AddPill id="room" title={room.title} tone="btn-white" /></div>
      <div className="flex min-h-[11rem] flex-[1_1_0px] justify-center">
        <div data-object className={`${grain} ${lying} h-max w-[min(21rem,100%)] rounded-[0.1875rem] px-5 pb-16 pt-5 text-ink`}>
          <p className="m-0 mb-2 text-xl tracking-[-0.02em]">Room checklist</p>
          {checks.map((check) => {
            const on = ticked.includes(check);
            return (
              <button key={check} type="button" role="checkbox" aria-checked={on} onClick={() => flip(check)} className="flex w-full cursor-pointer items-center gap-3 border-b border-ink/10 py-2 text-left focus-visible:outline-azure!">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[1.125rem] shrink-0 overflow-visible">
                  <rect x="1" y="1" width="18" height="18" rx="3" fill="none" stroke="var(--color-ink)" strokeOpacity="0.3" strokeWidth="1.5" />
                  <path d="M4 10.5L8.5 15.5L20 1" fill="none" stroke="var(--color-azure)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0 : 1} className="transition-[stroke-dashoffset] duration-300 ease-out" />
                </svg>
                <span>{check}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

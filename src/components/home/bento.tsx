"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/page-transition";
import { useRef, useState } from "react";
import { Draggable, gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { LoopVideo } from "@/components/loop-video";
import { Reveal, SplitHeading } from "@/components/motion";
import { PhotoSlides } from "@/components/photo-slides";
import { FACEBOOK_URL, TALK_EMAIL } from "@/data/site";

/** A clip or a swiping set of photos, with a short caption pinned to its corner. */
function MediaTile({ label, className, children }: { label: string; className: string; children: React.ReactNode }) {
  return (
    <div data-reveal className={`tile col-span-2 min-h-[260px] bg-fog lg:min-h-0 ${className}`}>
      {children}
      <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base text-white">{label}</span>
    </div>
  );
}

// What React Cebu offers at each stage, so a visitor finds their way in from where they are.
const levels = [
  {
    name: "New to React",
    lead: "Learn the basics with people who remember being new.",
    items: ["Training sessions for students writing their first component", "Code camps that take a whole Saturday", "A Facebook group where no question is too basic"],
    cta: { label: "See upcoming events", href: "/events" },
  },
  {
    name: "Building apps",
    lead: "Get unstuck on the parts that trip everyone up.",
    items: ["Hands-on workshops on Server Components, TypeScript and testing", "Hacktoberfest, where you ship real open source", "Mentors at every workshop table"],
    cta: { label: "See upcoming events", href: "/events" },
  },
  {
    name: "Shipping at work",
    lead: "Share what you learned the hard way.",
    items: ["Five-minute lightning talks, on any topic", "A mentor’s seat at the next workshop", "A hand in organizing the next meetup"],
    cta: { label: "Email us a talk idea", href: TALK_EMAIL },
  },
];

const topics = ["Hooks", "Server Components", "Next.js", "TypeScript", "React Native", "Testing", "Accessibility", "Animation", "Careers"];

const rules = [
  { id: "kind", label: "Be kind" },
  { id: "room", label: "Make room for everyone" },
  { id: "beginner", label: "Help a beginner" },
] as const;

const past = [
  { title: "Cebu Hacktoberfest", image: "/images/crowd.jpg", tone: "bg-black text-white" },
  { title: "Server Components, hands-on", tone: "bg-azure text-white" },
  { title: "Panel: careers in frontend", image: "/images/panel.jpg", tone: "bg-black text-white" },
  { title: "Gatsby workshop, 2019", tone: "bg-react text-black" },
  { title: "Student code camp", image: "/images/students.jpg", tone: "bg-black text-white" },
  { title: "The first meetup, 2019", tone: "bg-white text-black" },
];

/** Past events in a strip you drag sideways: it glides to a stop after a flick and resists at either end. */
function PastStrip() {
  const frame = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const frameEl = frame.current;
      const stripEl = strip.current;
      if (!frameEl || !stripEl) return;
      // Recomputed on each press, so a resize since the last drag still stops at the true ends.
      const ends = () => ({ minX: Math.min(0, frameEl.clientWidth - stripEl.scrollWidth), maxX: 0 });
      const [drag] = Draggable.create(stripEl, {
        type: "x",
        bounds: ends(),
        inertia: true,
        edgeResistance: 0.85,
        onPress() {
          this.applyBounds(ends());
        },
      });
      return () => drag.kill();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className="overflow-hidden rounded-lg">
      <ul ref={strip} aria-label="Past events" className="flex w-max cursor-grab gap-2 active:cursor-grabbing">
        {past.map((item) => (
          <li key={item.title} className={`relative h-[200px] w-[180px] shrink-0 overflow-hidden rounded-lg lg:h-[290px] lg:w-[240px] ${item.tone}`}>
            {item.image && <Image src={item.image} alt="" fill sizes="240px" draggable={false} className="pointer-events-none object-cover" />}
            <span className="absolute inset-x-3 bottom-3 select-none text-[22px] leading-[1.05] tracking-[-0.03em]">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pick a level and the tile shows what React Cebu has for you there; the old answer eases out before the new one eases in. */
function LevelPicker() {
  const [current, setCurrent] = useState(0);
  const body = useRef<HTMLDivElement>(null);
  const changed = useRef(false);
  const level = levels[current];

  const choose = (next: number) => {
    if (next === current) return;
    changed.current = true;
    gsap.killTweensOf(body.current);
    if (!window.matchMedia(MOTION_OK).matches) return setCurrent(next);
    gsap.to(body.current, { autoAlpha: 0, y: -12, duration: 0.2, ease: "power2.in", onComplete: () => setCurrent(next) });
  };

  // Ease the new answer in, but only after a choice: on first view the tile's own reveal runs.
  useGSAP(
    () => {
      if (!changed.current || !window.matchMedia(MOTION_OK).matches) return;
      gsap.fromTo(body.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
    },
    { dependencies: [current], scope: body },
  );

  return (
    <div data-reveal className="tile col-span-2 flex flex-col gap-8 bg-azure p-6 text-white sm:p-8 lg:col-span-6 lg:row-span-4">
      <div className="flex flex-col gap-5">
        <h3 className="text-[clamp(32px,3vw,44px)] font-normal leading-none tracking-[-0.04em]">Start where you are</h3>
        <div role="group" aria-label="Your experience with React" className="flex flex-wrap gap-1.5">
          {levels.map((l, i) => (
            <button
              key={l.name}
              type="button"
              aria-pressed={i === current}
              onClick={() => choose(i)}
              className={`btn min-h-11 px-[18px] text-[15px] ${i === current ? "bg-white text-ink" : "text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.6)] hover:bg-white/15"}`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>
      <div ref={body} className="flex flex-1 flex-col justify-between gap-6">
        <div className="flex flex-col gap-5">
          <p className="max-w-[24ch] text-[clamp(24px,2.2vw,32px)] leading-[1.1] tracking-[-0.03em]">{level.lead}</p>
          <ul className="flex flex-col">
            {level.items.map((item) => (
              <li key={item} className="border-t border-white/40 py-2.5 text-base leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </div>
        {level.cta.href.startsWith("mailto:") ? (
          <a href={level.cta.href} className="btn btn-white self-start">{level.cta.label}</a>
        ) : (
          <TransitionLink href={level.cta.href} className="btn btn-white self-start">{level.cta.label}</TransitionLink>
        )}
      </div>
    </div>
  );
}

export function Bento() {
  const [on, setOn] = useState<Record<string, boolean>>({ kind: true, room: true, beginner: true });
  const allOn = rules.every((rule) => on[rule.id]);

  return (
    <section aria-labelledby="grow-title" className="px-2 pb-32 pt-28">
      <SplitHeading id="grow-title" className="display mb-10 px-4 text-[clamp(40px,4.2vw,60px)]">
        Everything you need to grow as a React developer
      </SplitHeading>
      <Reveal className="grid auto-rows-[minmax(220px,auto)] grid-cols-2 gap-2 lg:auto-rows-[150px] lg:grid-cols-12">
        {/* Media alternates sides down the grid (right, left, right, left) so the
            scatter stays balanced. Each band below is one block of rows on desktop. */}

        {/* Rows 1–4: the level picker; a clip, topics, a question tile and mentors to its right */}
        <LevelPicker />

        <MediaTile label="Hands-on workshops" className="lg:col-span-3 lg:row-span-2">
          <LoopVideo src="/videos/workshop.mp4" label="Developers working together at a workshop" />
        </MediaTile>

        <div data-reveal className="tile col-span-2 flex flex-col justify-between gap-5 bg-black p-5 text-white lg:col-span-3 lg:row-span-2">
          <h3 className="text-[28px] font-normal leading-none tracking-[-0.035em]">What we cover</h3>
          <ul className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <li key={topic} className="rounded-full bg-[#262626] px-3 py-1.5 text-[15px]">{topic}</li>
            ))}
          </ul>
        </div>

        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" data-reveal className="tile col-span-2 flex items-end justify-between gap-4 bg-fog p-5 lg:col-span-6">
          <span className="text-[28px] leading-none tracking-[-0.035em]">No question is too basic</span>
          <span className="text-[15px] text-[#555]">Ask in the Facebook group</span>
        </a>

        <TransitionLink href="/community#organizers" data-reveal className="tile group col-span-2 flex items-center justify-between gap-4 bg-react p-5 text-ink lg:col-span-6">
          <span className="flex flex-col gap-1">
            <span className="text-[28px] leading-none tracking-[-0.035em]">Mentors at every table</span>
            <span className="text-[15px]">Meet the organizers</span>
          </span>
          <span className="flex shrink-0">
            {[1, 2, 3, 4].map((n, i) => (
              <Image
                key={n}
                src={`/images/portrait-${n}.jpg`}
                alt=""
                width={48}
                height={48}
                className={`size-12 rounded-full border-2 border-react object-cover transition-[margin] duration-500 ${i ? "-ml-5 group-hover:ml-1.5" : ""}`}
              />
            ))}
          </span>
        </TransitionLink>

        {/* Rows 5–7: photos on the left, then the code of conduct, a talk and volunteering */}
        <MediaTile label="Code camps" className="lg:col-span-4 lg:row-span-3">
          <PhotoSlides
            photos={["laptops", "coder", "react-code"]}
            alt="Students coding together at a code camp"
            direction="up"
            delay={1.8}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="absolute inset-0"
          />
        </MediaTile>

        <div data-reveal className="tile col-span-2 flex flex-col justify-between gap-5 bg-fog p-6 lg:col-span-4 lg:row-span-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-4xl font-normal leading-none tracking-[-0.035em]">Code of conduct</h3>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l7 3v6c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="flex flex-col gap-2.5">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-3 rounded-full bg-white px-4 py-3">
                <span className="text-lg">{rule.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on[rule.id]}
                  aria-label={rule.label}
                  onClick={() => setOn((prev) => ({ ...prev, [rule.id]: !prev[rule.id] }))}
                  className={`inline-flex h-[30px] w-[52px] cursor-pointer rounded-full p-[3px] transition-colors ${on[rule.id] ? "justify-end bg-azure" : "justify-start bg-[#bdbdbd]"}`}
                >
                  <span className="size-6 rounded-full bg-white" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-base leading-snug text-[#555]" aria-live="polite">
              {allOn ? "All three on. That’s the whole idea." : "Switch it back on. These aren’t optional at our events."}
            </span>
            <TransitionLink href="/community#code-of-conduct" className="btn btn-black self-start">Read the code of conduct</TransitionLink>
          </div>
        </div>

        <a href={TALK_EMAIL} data-reveal className="tile col-span-2 flex flex-col justify-between gap-5 bg-black p-6 text-white lg:col-span-4 lg:row-span-2">
          <span className="relative self-start border-[1.5px] border-white px-4 py-3">
            {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
              <span key={pos} aria-hidden="true" className={`absolute size-[9px] bg-white ${pos}`} />
            ))}
            <span className="block text-[clamp(32px,3vw,44px)] leading-none tracking-[-0.04em]">Your first talk</span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="text-lg leading-snug">Five minutes, any topic, any level.</span>
            <span className="text-base leading-snug text-[#bdbdbd]">First-timers get a mentor to shape the idea. Email us yours.</span>
          </span>
        </a>

        <TransitionLink href="/community#organizers" data-reveal className="tile col-span-2 flex flex-col justify-between gap-3 bg-azure p-5 text-white lg:col-span-4">
          <span className="text-2xl leading-tight tracking-[-0.02em]">Volunteer</span>
          <span className="text-[15px] leading-snug">Set up chairs, run the stream or welcome first-timers</span>
        </TransitionLink>

        {/* Rows 8–11: recaps over what it costs, with a tall clip on the right */}
        {/* Not a link as a whole: dragging the strip would otherwise count as a click. */}
        <div data-reveal className="tile col-span-2 flex flex-col justify-between gap-4 bg-black p-5 text-white lg:col-span-7 lg:row-span-3">
          <div className="flex items-start justify-between gap-3">
            <span className="flex flex-col gap-1.5">
              <span className="text-4xl leading-none tracking-[-0.035em]">Missed one?</span>
              <span className="text-[15px] text-[#bdbdbd]">Drag to look back through past events</span>
            </span>
            <TransitionLink href="/events#recaps" className="btn btn-white min-h-11 shrink-0 px-[18px] text-[15px]">Read the recaps</TransitionLink>
          </div>
          <PastStrip />
        </div>

        <MediaTile label="Hacktoberfest" className="lg:col-span-5 lg:row-span-4">
          <LoopVideo src="/videos/hacktoberfest.mp4" label="A team gathered around one laptop at Hacktoberfest" />
        </MediaTile>

        <div data-reveal className="tile col-span-2 flex flex-col justify-between gap-6 bg-azure p-6 text-white lg:col-span-7 lg:flex-row lg:items-center lg:gap-8">
          <span className="text-[clamp(40px,3.6vw,56px)] leading-[0.95] tracking-[-0.045em]">Free, every time</span>
          <span className="max-w-[30ch] text-base leading-snug lg:flex-1">Partners cover the room, the snacks and the occasional pizza.</span>
          <TransitionLink href="/partners" className="btn btn-white shrink-0 self-start lg:self-center">Partner with us</TransitionLink>
        </div>
      </Reveal>
    </section>
  );
}

"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/page-transition";
import { useRef, useState } from "react";
import Matter from "matter-js";
import { Draggable, gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { LoopVideo } from "@/components/loop-video";
import { Reveal, SplitHeading } from "@/components/motion";
import { PhotoSlides } from "@/components/photo-slides";
import { FACEBOOK_URL, TALK_EMAIL } from "@/data/site";

/** A clip or a swiping set of photos, with a short caption pinned to its corner. */
function MediaTile({ label, className, children }: { label: string; className: string; children: React.ReactNode }) {
  return (
    <div data-reveal className={`tile col-span-2 min-h-[16.25rem] bg-fog lg:min-h-0 ${className}`}>
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

const topics = [
  "Hooks",
  "Server Components",
  "Next.js",
  "TypeScript",
  "React Native",
  "Testing",
  "Accessibility",
  "Animation",
  "Careers",
  "State",
  "Performance",
  "Forms",
  "Open source",
];

const rules = [
  { id: "kind", label: "Be kind" },
  { id: "room", label: "Make room for everyone" },
  { id: "beginner", label: "Help a beginner" },
] as const;

// Each with a photo from that kind of night; the Gatsby workshop and the first meetup use the
// same photos as their recaps.
const past = [
  { title: "Cebu Hacktoberfest", image: "/images/crowd.jpg" },
  { title: "Server Components, hands-on", image: "/images/presenter.jpg" },
  { title: "Panel: careers in frontend", image: "/images/panel.jpg" },
  { title: "Gatsby workshop, 2019", image: "/images/workshop.jpg" },
  { title: "Student code camp", image: "/images/students.jpg" },
  { title: "The first meetup, 2019", image: "/images/audience.jpg" },
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
          <li key={item.title} className="relative h-[12.5rem] w-[11.25rem] shrink-0 overflow-hidden rounded-lg bg-black text-white lg:h-[18.125rem] lg:w-[15rem]">
            <Image src={item.image} alt="" fill sizes="240px" draggable={false} className="pointer-events-none object-cover" />
            {/* Darkens the bottom of the photo so the title reads on any of them. */}
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
            <span className="absolute inset-x-3 bottom-3 select-none text-[1.375rem] leading-[1.05] tracking-[-0.03em]">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const { Bodies, Body, Composite, Engine, Sleeping } = Matter;

// The physics runs in fixed steps of a sixtieth of a second, whatever the screen's frame rate.
const STEP = 1000 / 60;
// Gravity, well above Matter's default, which makes pills this small drift down like balloons.
const GRAVITY = 0.0028;
// Each pill's body is a capsule this many pixels wider and taller than the pill, so pills at
// rest keep a small gap between them instead of looking glued together.
const GAP = 6;
// A held pill closes this share of the distance to the pointer each step: close enough to feel
// in hand, eased enough not to jitter.
const FOLLOW = 0.35;
// How much of its speed a pill keeps when let go, so a flick tosses it rather than flinging it.
const THROW = 0.6;
// The fastest a pill may move in a step, so nothing can be flung through a wall.
const TOP_SPEED = 20;

/**
 * The topics as pills in a small physics world. A held pill follows the pointer, shoving
 * whatever is in the way, so lifting a pill from the bottom lifts the ones resting on it. Let go
 * and it falls, tumbles and comes to rest where it lands, tipping off any edge it can't balance
 * on; a flick tosses it. The pills drop into the tile the first time it scrolls into view, and
 * the world only runs while the tile is on screen. Without motion they stay a list.
 */
function TopicPile() {
  const tile = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const box = tile.current;
      const ul = list.current;
      if (!box || !ul) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const pad = parseFloat(getComputedStyle(box).paddingLeft);
        const engine = Engine.create({ positionIterations: 10, velocityIterations: 8, enableSleeping: true, gravity: { x: 0, y: 1, scale: GRAVITY } });

        // Take the pills out of the flow where the list laid them out, keeping the list's height
        // so the tile doesn't change size, and give each a body of its own.
        const pills = gsap.utils.toArray<HTMLElement>("li", ul).map((el) => {
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          const body = Bodies.rectangle(el.offsetLeft + w / 2, el.offsetTop + h / 2, w + GAP, h + GAP, {
            chamfer: { radius: (h + GAP) / 2 },
            friction: 0.3,
            frictionStatic: 0.5,
            restitution: 0.1,
            frictionAir: 0.02,
          });
          return { el, w, h, body };
        });
        ul.style.height = `${ul.offsetHeight}px`;
        gsap.set(
          pills.map(({ el }) => el),
          { position: "absolute", left: 0, top: 0, cursor: "grab", touchAction: "none" },
        );
        Composite.add(
          engine.world,
          pills.map(({ body }) => body),
        );
        const wake = () => pills.forEach(({ body }) => Sleeping.set(body, false));
        const draw = () =>
          pills.forEach(({ el, w, h, body }) => {
            el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
          });

        // A floor and two side walls just inside the tile's padding. The walls reach far above the
        // tile for the drop in; once every pill is below the heading, a ceiling closes just under
        // it, so a pill thrown up bounces back down and the heading always stays clear. They are
        // rebuilt when the tile resizes, and any pill left outside is brought back in.
        const heading = box.querySelector("h3");
        const ceiling = () => (heading ? heading.offsetTop + heading.offsetHeight + 10 : 0);
        let walls: Matter.Body[] = [];
        let closed = false;
        const build = () => {
          const width = box.clientWidth;
          const height = box.clientHeight;
          const thick = 400;
          Composite.remove(engine.world, walls);
          walls = [
            Bodies.rectangle(width / 2, height - pad + thick / 2, width + 2 * thick, thick, { isStatic: true }),
            Bodies.rectangle(pad - thick / 2, -height / 2, thick, height * 4, { isStatic: true }),
            Bodies.rectangle(width - pad + thick / 2, -height / 2, thick, height * 4, { isStatic: true }),
            ...(closed ? [Bodies.rectangle(width / 2, ceiling() - thick / 2, width + 2 * thick, thick, { isStatic: true })] : []),
          ];
          Composite.add(engine.world, walls);
          pills.forEach(({ w, h, body }) => {
            const x = gsap.utils.clamp(pad + w / 2, width - pad - w / 2, body.position.x);
            const y = Math.min(body.position.y, height - pad - h / 2);
            if (x !== body.position.x || y !== body.position.y) Body.setPosition(body, { x, y });
          });
          wake();
        };
        build();
        const resize = new ResizeObserver(build);
        resize.observe(box);

        // Until the drop, the pills wait above the tile, out of sight, in the rows the list laid
        // them out in, each row a little further apart and each pill a little askew. Falling as
        // rows, they land almost as compactly as the list, with a tumble here and there.
        const lift = box.clientHeight;
        pills.forEach(({ h, body }) => {
          const row = Math.round(body.position.y / (h + GAP));
          Body.setPosition(body, { x: body.position.x, y: body.position.y - lift - row * 14 });
          Body.setAngle(body, gsap.utils.random(-0.15, 0.15));
        });
        draw();

        // Steps the world in fixed steps for the time that has passed, then draws the pills.
        let pending = 0;
        let held: { pill: (typeof pills)[number]; offset: Matter.Vector; target: Matter.Vector } | undefined;
        const tick = (_time: number, delta: number) => {
          pending = Math.min(pending + delta, STEP * 4);
          while (pending >= STEP) {
            if (held) {
              // While a pill is held, everything stays awake, so a pill whose support is pulled
              // away falls instead of sleeping in mid-air. The held pill heads for the pointer,
              // kept inside the tile, and barely spins.
              wake();
              const { body, w, h } = held.pill;
              const x = gsap.utils.clamp(pad + w / 2, box.clientWidth - pad - w / 2, held.target.x - held.offset.x);
              const y = gsap.utils.clamp(ceiling() + h / 2, box.clientHeight - pad - h / 2, held.target.y - held.offset.y);
              Body.setVelocity(body, { x: (x - body.position.x) * FOLLOW, y: (y - body.position.y) * FOLLOW });
              Body.setAngularVelocity(body, body.angularVelocity * 0.85);
            }
            Engine.update(engine, STEP);
            pills.forEach(({ body }) => {
              const speed = Math.hypot(body.velocity.x, body.velocity.y);
              if (speed > TOP_SPEED) Body.setVelocity(body, { x: (body.velocity.x / speed) * TOP_SPEED, y: (body.velocity.y / speed) * TOP_SPEED });
            });
            pending -= STEP;
          }
          if (!closed && pills.every(({ body }) => body.bounds.min.y > ceiling())) {
            closed = true;
            build();
          }
          draw();
        };
        let running = false;
        const run = (on: boolean) => {
          if (on === running) return;
          running = on;
          pending = 0;
          if (on) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        };
        let dropped = false;
        ScrollTrigger.create({
          trigger: box,
          start: "top 70%",
          once: true,
          onEnter: () => {
            dropped = true;
            run(true);
          },
        });
        ScrollTrigger.create({
          trigger: box,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => dropped && run(self.isActive),
        });

        // A held pill keeps the spot you grabbed under the pointer. Letting go hands it back to
        // gravity with some of the speed it was moving at.
        let front = 1;
        const at = (event: PointerEvent) => {
          const rect = box.getBoundingClientRect();
          return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        };
        const press = (event: PointerEvent) => {
          const pill = pills.find(({ el }) => el === event.currentTarget);
          if (!pill || !dropped || held) return;
          event.preventDefault();
          // Keeps the pointer's moves coming to this pill even once it slips out from under it.
          try {
            pill.el.setPointerCapture(event.pointerId);
          } catch {
            // A pointer that is no longer down can't be captured; the press still works without it.
          }
          pill.el.style.cursor = "grabbing";
          pill.el.style.zIndex = String(++front);
          const point = at(event);
          held = { pill, offset: { x: point.x - pill.body.position.x, y: point.y - pill.body.position.y }, target: point };
          wake();
        };
        const move = (event: PointerEvent) => {
          if (held?.pill.el === event.currentTarget) held.target = at(event);
        };
        const release = (event: PointerEvent) => {
          if (held?.pill.el !== event.currentTarget) return;
          const { el, body } = held.pill;
          Body.setVelocity(body, { x: body.velocity.x * THROW, y: body.velocity.y * THROW });
          held = undefined;
          el.style.cursor = "grab";
          wake();
        };
        pills.forEach(({ el }) => {
          el.addEventListener("pointerdown", press);
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerup", release);
          el.addEventListener("pointercancel", release);
        });

        return () => {
          run(false);
          resize.disconnect();
          pills.forEach(({ el }) => {
            el.removeEventListener("pointerdown", press);
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerup", release);
            el.removeEventListener("pointercancel", release);
            el.style.transform = "";
            el.style.zIndex = "";
          });
          Engine.clear(engine);
          ul.style.height = "";
        };
      });
      return () => mm.revert();
    },
    { scope: tile },
  );

  return (
    <div ref={tile} data-reveal className="tile col-span-2 flex min-h-[16.25rem] flex-col justify-between gap-5 bg-black p-5 text-white lg:col-span-3 lg:row-span-2 lg:min-h-0">
      <h3 className="text-[1.75rem] font-normal leading-none tracking-[-0.035em]">What we cover</h3>
      <ul ref={list} className="flex flex-wrap gap-1.5">
        {topics.map((topic) => (
          <li key={topic} className="select-none whitespace-nowrap rounded-full bg-[#262626] px-3 py-1 text-[0.875rem]">
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}

// The selection box's corner squares, with which way each one grows the box: -1 is left or up.
const corners = [
  { pos: "-left-[5px] -top-[5px]", x: -1, y: -1, cursor: "cursor-nwse-resize" },
  { pos: "-right-[5px] -top-[5px]", x: 1, y: -1, cursor: "cursor-nesw-resize" },
  { pos: "-bottom-[5px] -left-[5px]", x: -1, y: 1, cursor: "cursor-nesw-resize" },
  { pos: "-bottom-[5px] -right-[5px]", x: 1, y: 1, cursor: "cursor-nwse-resize" },
];

/**
 * "Your first talk" in a selection box, as in a design tool: drag the box anywhere in the tile,
 * or drag a corner square to make the text bigger or smaller while the opposite corner stays put.
 * The text never grows past the room the tile has for it. Not a link as a whole, so dragging
 * doesn't open the email; the email link sits in the copy.
 */
function TalkTile() {
  const tile = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const copy = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const box = tile.current;
      const sel = frame.current;
      const words = text.current;
      const below = copy.current;
      if (!box || !sel || !words || !below) return;
      const pad = parseFloat(getComputedStyle(box).paddingLeft);
      // Where the box may go, as offsets from where the layout puts it: anywhere inside the
      // tile's padding.
      const limits = () => ({
        minX: pad - sel.offsetLeft,
        maxX: box.clientWidth - pad - sel.offsetLeft - sel.offsetWidth,
        minY: pad - sel.offsetTop,
        maxY: box.clientHeight - pad - sel.offsetTop - sel.offsetHeight,
      });
      const [drag] = Draggable.create(sel, {
        type: "x,y",
        bounds: limits(),
        onPress() {
          this.applyBounds(limits());
        },
      });

      const handles = gsap.utils.toArray<HTMLElement>("[data-corner]", sel);
      const cleanups = handles.map((handle, i) => {
        const { x: sx, y: sy } = corners[i];
        let start: { px: number; py: number; font: number; x: number; y: number; w: number; h: number; textW: number; textH: number; most: number } | undefined;
        const down = (event: PointerEvent) => {
          // The box's own drag mustn't start too.
          event.stopPropagation();
          event.preventDefault();
          try {
            handle.setPointerCapture(event.pointerId);
          } catch {
            // A pointer that is no longer down can't be captured; the resize still works without it.
          }
          const font = parseFloat(getComputedStyle(words).fontSize);
          const w = sel.offsetWidth;
          const h = sel.offsetHeight;
          const textW = words.offsetWidth;
          const textH = words.offsetHeight;
          // The biggest the text may get: as wide as the tile's inside, and only as tall as the
          // room above the copy, so the box never pushes the copy out of the tile.
          const roomW = box.clientWidth - 2 * pad - (w - textW);
          const roomH = below.offsetTop - 20 - sel.offsetTop - (h - textH);
          start = { px: event.clientX, py: event.clientY, font, x: drag.x, y: drag.y, w, h, textW, textH, most: Math.min((roomW / textW) * font, (roomH / textH) * font) };
        };
        const move = (event: PointerEvent) => {
          if (!start) return;
          // The text size that puts this corner under the pointer, judged across and down and
          // averaged, so a diagonal drag scales evenly.
          const byWidth = (start.font * (start.textW + (event.clientX - start.px) * sx)) / start.textW;
          const byHeight = (start.font * (start.textH + (event.clientY - start.py) * sy)) / start.textH;
          words.style.fontSize = `${gsap.utils.clamp(20, start.most, (byWidth + byHeight) / 2)}px`;
          // Keep the opposite corner where it was: growing to the left or up shifts the box back.
          const grewW = sel.offsetWidth - start.w;
          const grewH = sel.offsetHeight - start.h;
          gsap.set(sel, { x: start.x - (sx < 0 ? grewW : 0), y: start.y - (sy < 0 ? grewH : 0) });
          drag.update();
          drag.applyBounds(limits());
        };
        const up = () => {
          start = undefined;
        };
        handle.addEventListener("pointerdown", down);
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
        handle.addEventListener("pointercancel", up);
        return () => {
          handle.removeEventListener("pointerdown", down);
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
          handle.removeEventListener("pointercancel", up);
        };
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
        drag.kill();
        words.style.fontSize = "";
      };
    },
    { scope: tile },
  );

  return (
    <div ref={tile} data-reveal className="tile col-span-2 flex flex-col justify-between gap-5 bg-black p-6 text-white lg:col-span-4 lg:row-span-2">
      {/* Filled with the tile's black, so dropped over the copy it covers it like a layer. */}
      <span ref={frame} className="relative cursor-move touch-none select-none self-start border-[1.5px] border-white bg-black px-4 py-3">
        {corners.map((corner) => (
          // Each square has a bigger invisible area around it, so it is easy to catch.
          <span
            key={corner.pos}
            data-corner
            aria-hidden="true"
            className={`absolute size-[0.5625rem] bg-white before:absolute before:-inset-2.5 before:content-[''] ${corner.pos} ${corner.cursor}`}
          />
        ))}
        <span ref={text} className="block whitespace-nowrap text-[clamp(2rem,3vw,2.75rem)] leading-none tracking-[-0.04em]">
          Your first talk
        </span>
      </span>
      <span ref={copy} className="flex flex-col gap-1.5">
        <span className="text-lg leading-snug">Five minutes, any topic, any level.</span>
        <span className="text-base leading-snug text-[#bdbdbd]">
          First-timers get a mentor to shape the idea.{" "}
          <a href={TALK_EMAIL} className="text-white underline underline-offset-4">
            Email us yours
          </a>
          .
        </span>
      </span>
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
        <h3 className="text-[clamp(2rem,3vw,2.75rem)] font-normal leading-none tracking-[-0.04em]">Start where you are</h3>
        <div role="group" aria-label="Your experience with React" className="flex flex-wrap gap-1.5">
          {levels.map((l, i) => (
            <button
              key={l.name}
              type="button"
              aria-pressed={i === current}
              onClick={() => choose(i)}
              className={`btn min-h-11 px-[1.125rem] text-[0.9375rem] ${i === current ? "bg-white text-ink" : "text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.6)] hover:bg-white/15"}`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>
      <div ref={body} className="flex flex-1 flex-col justify-between gap-6">
        <div className="flex flex-col gap-5">
          <p className="max-w-[24ch] text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] tracking-[-0.03em]">{level.lead}</p>
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
      <SplitHeading id="grow-title" className="display mb-10 px-4 text-[clamp(2.5rem,4.2vw,3.75rem)]">
        Everything you need to grow as a React developer
      </SplitHeading>
      <Reveal className="grid auto-rows-[minmax(13.75rem,auto)] grid-cols-2 gap-2 lg:auto-rows-[9.375rem] lg:grid-cols-12">
        {/* Media alternates sides down the grid (right, left, right, left) so the
            scatter stays balanced. Each band below is one block of rows on desktop. */}

        {/* Rows 1–4: the level picker; a clip, topics, a question tile and mentors to its right */}
        <LevelPicker />

        <MediaTile label="Hands-on workshops" className="lg:col-span-3 lg:row-span-2">
          <LoopVideo src="/videos/workshop.mp4" label="Developers working together at a workshop" />
        </MediaTile>

        <TopicPile />

        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" data-reveal className="tile col-span-2 flex items-end justify-between gap-4 bg-fog p-5 lg:col-span-6">
          <span className="text-[1.75rem] leading-none tracking-[-0.035em]">No question is too basic</span>
          <span className="text-[0.9375rem] text-[#555]">Ask in the Facebook group</span>
        </a>

        <TransitionLink href="/community#organizers" data-reveal className="tile group col-span-2 flex items-center justify-between gap-4 bg-react p-5 text-ink lg:col-span-6">
          <span className="flex flex-col gap-1">
            <span className="text-[1.75rem] leading-none tracking-[-0.035em]">Mentors at every table</span>
            <span className="text-[0.9375rem]">Meet the organizers</span>
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
          <h3 className="text-4xl font-normal leading-none tracking-[-0.035em]">Code of conduct</h3>
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
                  className={`inline-flex h-[1.875rem] w-[3.25rem] shrink-0 cursor-pointer rounded-full p-[3px] transition-colors duration-300 ${on[rule.id] ? "bg-azure" : "bg-[#bdbdbd]"}`}
                >
                  {/* The knob slides across (52 wide, less 3 of padding a side and its own 24) as the track's colour fades, both ways. */}
                  <span
                    className={`size-6 rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${on[rule.id] ? "translate-x-[1.375rem]" : "translate-x-0"}`}
                  />
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

        <TalkTile />

        <TransitionLink href="/community#volunteer" data-reveal className="tile col-span-2 flex flex-col justify-between gap-3 bg-azure p-5 text-white lg:col-span-4">
          <span className="text-2xl leading-tight tracking-[-0.02em]">Volunteer</span>
          <span className="text-[0.9375rem] leading-snug">Set up chairs, run the stream or welcome first-timers</span>
        </TransitionLink>

        {/* Rows 8–11: recaps over what it costs, with a tall clip on the right */}
        {/* Not a link as a whole: dragging the strip would otherwise count as a click. */}
        <div data-reveal className="tile col-span-2 flex flex-col justify-between gap-4 bg-black p-5 text-white lg:col-span-7 lg:row-span-3">
          <div className="flex items-start justify-between gap-3">
            <span className="flex flex-col gap-1.5">
              <span className="text-4xl leading-none tracking-[-0.035em]">Missed one?</span>
              <span className="text-[0.9375rem] text-[#bdbdbd]">Drag to look back through past events</span>
            </span>
            <TransitionLink href="/events#recaps" className="btn btn-white min-h-11 shrink-0 px-[1.125rem] text-[0.9375rem]">Read the recaps</TransitionLink>
          </div>
          <PastStrip />
        </div>

        <MediaTile label="Hacktoberfest" className="lg:col-span-5 lg:row-span-4">
          <LoopVideo src="/videos/hacktoberfest.mp4" label="A team gathered around one laptop at Hacktoberfest" />
        </MediaTile>

        {/* React cyan carries ink, never white; the button goes ink so it still stands out. */}
        <div data-reveal className="tile col-span-2 flex flex-col justify-between gap-6 bg-react p-6 text-ink lg:col-span-7 lg:flex-row lg:items-center lg:gap-8">
          <span className="text-[clamp(2.5rem,3.6vw,3.5rem)] leading-[0.95] tracking-[-0.045em]">Free, every time</span>
          <span className="max-w-[30ch] text-base leading-snug lg:flex-1">Partners cover the room, the snacks and the occasional pizza.</span>
          <TransitionLink href="/partners" className="btn btn-black shrink-0 self-start lg:self-center">Partner with us</TransitionLink>
        </div>
      </Reveal>
    </section>
  );
}

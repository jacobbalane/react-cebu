"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal, SplitHeading } from "@/components/motion";
import { TransitionLink } from "@/components/page-transition";
import { TALK_EMAIL } from "@/data/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const calm = () => !window.matchMedia(MOTION_OK).matches;

// Each card's text runs the promise, a small control to test it with, what that means in practice,
// then somewhere to go next, which sits at the bottom so the buttons in a row line up.
const cardText = "flex flex-col gap-3 p-6 [&>a:last-child]:mt-auto";
const cardTitle = "title m-0 text-[clamp(1.75rem,3vw,2.5rem)]";
// A line that changes keeps the height of its longest version, and sits at the bottom of that space,
// so it stays right on top of the detail.
const lead = "m-0 text-[clamp(1.375rem,1.9vw,1.75rem)] leading-[1.12] tracking-[-0.03em]";
const detail = "m-0 -mt-2 text-base leading-[1.45]";
// Links that stand alone are pills, as on the homepage.
const action = "btn mt-2 self-start justify-self-start";

/** Lines stacked in one spot, so changing the line fades rather than jumps and nothing shifts. A negative `shown` hides them all. */
function Swap({ lines, shown, className = "" }: { lines: React.ReactNode[]; shown: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`grid ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className={`col-start-1 row-start-1 transition-opacity duration-300 ${i === shown ? "opacity-100" : "opacity-0"}`}>
          {line}
        </span>
      ))}
    </span>
  );
}

// Each reply gets a turn, so testing a tile twice doesn't get the same answer twice.
const nextReply = (turn: number, replies: string[]) => 1 + (turn % replies.length);
// How long a reply stays up before the tile goes back to its resting line.
const REPLY_MS = 2400;

// What a visitor might expect to pay for, all of it ₱0 however far the slider below is pulled.
const bill = ["Your seat", "The room", "The snacks", "The occasional pizza"];

// The most the slider can show. The pull weakens towards it, so no drag ever gets there.
const TOP_PRICE = 5000;
// How far the knob could ever go, as a share of the track, were the pointer to keep going. It
// starts out right under the pointer and falls behind, reaching about 70% at the track's end.
const GIVE = 1.4;
const pesos = new Intl.NumberFormat("en-PH");
const priceReplies = ["Still free", "Nope, free", "Free, always"];
const priceLines = ["Drag to raise it", ...priceReplies];

/**
 * A price you can't raise. The knob follows a drag, harder the further it goes, and the price
 * climbs with it; let go and it snaps back to ₱0 and bounces off the end of the track.
 */
function PriceSlider({ onPull }: { onPull: (pull: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const price = useRef<HTMLSpanElement>(null);
  const [line, setLine] = useState(0);

  useGSAP(
    () => {
      const box = track.current;
      const handle = knob.current;
      const bar = fill.current;
      const readout = price.current;
      if (!box || !handle || !bar || !readout) return;

      // How far along the knob is, from 0 to 1. Below 0 is the rebound off the end of the track.
      const state = { pull: 0 };
      const inset = handle.offsetLeft;
      const room = () => box.clientWidth - handle.offsetWidth - 2 * inset;
      const moveKnob = gsap.quickSetter(handle, "x", "px");
      const draw = () => {
        const pull = Math.abs(state.pull);
        const moved = pull * room();
        moveKnob(moved);
        bar.style.width = `${moved + handle.offsetWidth / 2}px`;
        readout.textContent = `₱${pesos.format(Math.round((pull * TOP_PRICE) / 10) * 10)}`;
        onPull(pull);
      };

      let turn = 0;
      let timer: ReturnType<typeof setTimeout>;
      const reply = () => {
        clearTimeout(timer);
        setLine(nextReply(turn++, priceReplies));
        timer = setTimeout(() => setLine(0), REPLY_MS);
      };
      const springBack = () => {
        reply();
        if (calm()) {
          gsap.killTweensOf(state);
          state.pull = 0;
          draw();
          return;
        }
        gsap.to(state, { pull: 0, duration: 1.3, ease: "elastic.out(1, 0.4)", overwrite: true, onUpdate: draw });
      };

      // Where a drag is measured from, in the viewport.
      let anchor: number | null = null;
      const follow = (event: PointerEvent) => {
        if (anchor === null) return;
        const moved = Math.max(0, event.clientX - anchor);
        const pull = GIVE * (1 - Math.exp(-moved / (room() * GIVE)));
        if (calm()) {
          state.pull = pull;
          draw();
          return;
        }
        gsap.to(state, { pull, duration: 0.25, ease: "power3.out", overwrite: true, onUpdate: draw });
      };
      const press = (event: PointerEvent) => {
        if (event.button !== 0) return;
        clearTimeout(timer);
        setLine(-1);
        // A grab on the knob keeps it where it is, even mid-bounce; anywhere else, it heads for the pointer.
        const grabbed = handle.contains(event.target as Node);
        const distance = -Math.log(1 - Math.abs(state.pull) / GIVE) * room() * GIVE;
        anchor = grabbed ? event.clientX - distance : box.getBoundingClientRect().left + inset + handle.offsetWidth / 2;
        try {
          box.setPointerCapture(event.pointerId);
        } catch {
          // A pointer that is no longer down can't be captured; the drag still works without it.
        }
        follow(event);
      };
      const release = () => {
        if (anchor === null) return;
        anchor = null;
        springBack();
      };
      // Arrow keys get the same answer: a small push, and back it comes.
      const key = (event: KeyboardEvent) => {
        if (!["ArrowRight", "ArrowUp", "PageUp", "End"].includes(event.key)) return;
        event.preventDefault();
        if (calm()) return reply();
        setLine(-1);
        gsap.to(state, { pull: 0.2, duration: 0.2, ease: "power2.out", overwrite: true, onUpdate: draw, onComplete: springBack });
      };

      box.addEventListener("pointerdown", press);
      box.addEventListener("pointermove", follow);
      box.addEventListener("pointerup", release);
      box.addEventListener("pointercancel", release);
      handle.addEventListener("keydown", key);
      return () => {
        clearTimeout(timer);
        box.removeEventListener("pointerdown", press);
        box.removeEventListener("pointermove", follow);
        box.removeEventListener("pointerup", release);
        box.removeEventListener("pointercancel", release);
        handle.removeEventListener("keydown", key);
      };
    },
    { scope: track },
  );

  return (
    <div
      ref={track}
      className="relative h-14 cursor-grab touch-pan-y select-none overflow-hidden rounded-full bg-ink active:cursor-grabbing"
    >
      <span className="absolute inset-y-0 right-5 flex items-center text-sm text-white">
        <Swap lines={priceLines} shown={line} className="text-right" />
      </span>
      <div
        ref={knob}
        role="slider"
        tabIndex={0}
        aria-label="Price of an event"
        aria-valuemin={0}
        aria-valuemax={0}
        aria-valuenow={0}
        aria-valuetext="₱0, free"
        className="absolute inset-y-1.5 left-1.5 w-[5.5rem] rounded-full focus-visible:outline-offset-[-5px]! focus-visible:outline-ink!"
      >
        {/* Reaches back from the knob to where it started, so pulling it stretches the pill. */}
        <span ref={fill} aria-hidden="true" className="absolute inset-y-0 right-1/2 w-1/2 rounded-l-full bg-white" />
        <span
          ref={price}
          className="relative flex h-full items-center justify-center rounded-full bg-white text-[1.375rem] tabular-nums tracking-[-0.035em] text-ink"
        >
          ₱0
        </span>
      </div>
      <span role="status" className="sr-only">
        {line > 0 ? priceLines[line] : ""}
      </span>
    </div>
  );
}

const COMPONENTS = 50;
// How strong a bar is until the count reaches it.
const BAR_FAINT = 0.28;
// How wide the swell is, in bars.
const SWELL = 4;
// At rest the bars climb from left to right, as a share of their full height.
const barRest = (i: number) => 0.1 + 0.56 * (i / (COMPONENTS - 1)) ** 1.4;

// Where a visitor might be, a third of the ruler each, and what's there for them. `bar` is where
// picking the stage by name lands on the ruler.
const stages = [
  { name: "New to React", bar: 0, lead: "Learn the basics with people who remember being new.", more: "Training sessions and Saturday code camps." },
  { name: "Building apps", bar: 24, lead: "Get unstuck on the parts that trip everyone up.", more: "Hands-on workshops, with mentors at every table." },
  { name: "Shipping at work", bar: 49, lead: "Share what you learned the hard way.", more: "Lightning talks, and a mentor’s seat at the next workshop." },
];
const stageAt = (count: number) => Math.min(stages.length - 1, Math.floor(((count - 1) / COMPONENTS) * stages.length));

const ordinal = (n: number) => {
  const suffix = ["th", "st", "nd", "rd"];
  return `${n}${suffix[((n % 100) - 20) % 10] ?? suffix[n % 100] ?? suffix[0]}`;
};

/**
 * Fifty bars climbing left to right, one for each component you might have built. A swell follows
 * the pointer along them, filling them in as the count climbs, and the tile says what's there for
 * someone that far along. The count stays where it's left, so the answer can be read. It runs the
 * whole length once as it comes into view, to show there's something to find.
 */
function ComponentRuler({ onStage }: { onStage: (stage: number) => void }) {
  const ruler = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const pick = useRef<(bar: number) => void>(() => {});
  const [stage, setStage] = useState(0);

  useEffect(() => onStage(stage), [stage, onStage]);

  useGSAP(
    () => {
      const box = ruler.current;
      const readout = count.current;
      if (!box || !readout) return;
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", box);

      // Which bar the swell is over, and how tall it stands, from 0 to 1.
      const state = { at: 0, swell: 0 };
      let shown = 1;
      const draw = () => {
        bars.forEach((bar, i) => {
          const near = Math.exp(-((i - state.at) ** 2) / (2 * SWELL ** 2)) * state.swell;
          const rest = barRest(i);
          bar.style.transform = `scaleY(${rest + (1 - rest) * near})`;
          bar.style.opacity = String(BAR_FAINT + (1 - BAR_FAINT) * gsap.utils.clamp(0, 1, state.at + 1 - i));
        });
        const value = Math.round(state.at) + 1;
        if (value === shown) return;
        shown = value;
        readout.textContent = ordinal(value);
        setStage(stageAt(value));
        box.setAttribute("aria-valuenow", String(value));
        box.setAttribute("aria-valuetext", `${ordinal(value)} component: ${stages[stageAt(value)].name}`);
      };

      let intro: gsap.core.Timeline | undefined;
      const go = (to: typeof state, vars: gsap.TweenVars) => {
        intro?.kill();
        if (calm()) {
          Object.assign(state, to);
          draw();
          return;
        }
        gsap.to(state, { ...to, ...vars, overwrite: true, onUpdate: draw });
      };
      const seek = (index: number) => go({ at: index, swell: 1 }, { duration: 0.4, ease: "power3.out" });
      const settle = () => go({ at: Math.round(state.at), swell: 0 }, { duration: 0.7, ease: "power3.out" });
      pick.current = (bar) => go({ at: bar, swell: 0 }, { duration: 0.9, ease: "power3.inOut" });

      const indexAt = (event: PointerEvent) => {
        const { left, width } = box.getBoundingClientRect();
        return gsap.utils.clamp(0, COMPONENTS - 1, ((event.clientX - left) / width) * COMPONENTS - 0.5);
      };
      // A mouse only has to pass over; a finger has to be on the ruler.
      let pressed = false;
      const press = (event: PointerEvent) => {
        pressed = true;
        seek(indexAt(event));
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType === "mouse" || pressed) seek(indexAt(event));
      };
      const lift = (event: PointerEvent) => {
        pressed = false;
        if (event.pointerType !== "mouse") settle();
      };
      const leave = (event: PointerEvent) => {
        if (event.pointerType === "mouse") settle();
      };
      const key = (event: KeyboardEvent) => {
        const steps: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 5, PageDown: -5 };
        const last = COMPONENTS - 1;
        const to = event.key === "Home" ? 0 : event.key === "End" ? last : event.key in steps ? gsap.utils.clamp(0, last, Math.round(state.at) + steps[event.key]) : null;
        if (to === null) return;
        event.preventDefault();
        seek(to);
      };

      box.addEventListener("pointerdown", press);
      box.addEventListener("pointermove", move);
      box.addEventListener("pointerup", lift);
      box.addEventListener("pointercancel", lift);
      box.addEventListener("pointerleave", leave);
      box.addEventListener("keydown", key);
      box.addEventListener("blur", settle);

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        intro = gsap
          .timeline({ scrollTrigger: { trigger: box, start: "top 80%", once: true }, onUpdate: draw })
          .to(state, { swell: 1, duration: 0.4, ease: "power2.out" }, 0)
          .to(state, { at: COMPONENTS - 1, duration: 2.2, ease: "power1.inOut" }, 0)
          .to(state, { at: 0, swell: 0, duration: 1.1, ease: "power3.inOut" });
      });

      return () => {
        mm.revert();
        box.removeEventListener("pointerdown", press);
        box.removeEventListener("pointermove", move);
        box.removeEventListener("pointerup", lift);
        box.removeEventListener("pointercancel", lift);
        box.removeEventListener("pointerleave", leave);
        box.removeEventListener("keydown", key);
        box.removeEventListener("blur", settle);
      };
    },
    { scope: ruler },
  );

  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={cardTitle}>Every level</h3>
        <span ref={count} aria-hidden="true" className={`${cardTitle} shrink-0 tabular-nums`}>
          1st
        </span>
      </div>

      <div
        ref={ruler}
        role="slider"
        tabIndex={0}
        aria-label="How many components you have built"
        aria-valuemin={1}
        aria-valuemax={COMPONENTS}
        aria-valuenow={1}
        aria-valuetext={`1st component: ${stages[0].name}`}
        className="flex h-14 cursor-ew-resize touch-pan-y items-end justify-between rounded-sm"
      >
        {Array.from({ length: COMPONENTS }, (_, i) => (
          <span key={i} data-bar className="block h-full w-[3px] origin-bottom bg-ink" style={{ transform: `scaleY(${barRest(i)})`, opacity: i === 0 ? 1 : BAR_FAINT }} />
        ))}
      </div>

      <div role="group" aria-label="Your experience with React" className="flex items-center justify-between gap-2 text-[0.8125rem]">
        {stages.map((item, i) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={i === stage}
            onClick={() => pick.current(item.bar)}
            className={`cursor-pointer whitespace-nowrap py-1 transition-colors duration-300 ${i === stage ? "text-ink" : "text-[#666] hover:text-ink"}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <Swap lines={stages.map((item) => item.lead)} shown={stage} className={`${lead} items-end`} />

      <div className={`${detail} text-[#555]`}>
        <p className="m-0">First component or fiftieth, you belong in the room.</p>
        <Swap lines={stages.map((item) => item.more)} shown={stage} />
      </div>
      <span role="status" className="sr-only">
        {stages[stage].lead} {stages[stage].more}
      </span>

      <TransitionLink href="/events" className={`${action} btn-black`}>
        See upcoming events
      </TransitionLink>
    </>
  );
}

const WAVE_BARS = 27;
const WAVE_HEIGHT = 40;
// As tall as the bars are wide, so a silent wave is a row of dots.
const WAVE_MIN = 4;
// The moment the speaking wave holds on when there's no movement.
const WAVE_STILL = 1.7;
// A first talk is five minutes. Holding the button runs through all of them in this many seconds.
const TALK_SECONDS = 300;
const TALK_HOLD = 4.5;

const clock = (seconds: number) => {
  const whole = Math.ceil(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

// Three sines out of step read as speech. Tapered at both ends, like a clip of someone talking.
function voice(i: number, time: number) {
  const taper = Math.sin((Math.PI * (i + 0.5)) / WAVE_BARS) ** 0.8;
  const speech = 0.5 * Math.sin(time * 7.3 + i * 0.9) + 0.3 * Math.sin(time * 11.1 - i * 1.7) + 0.2 * Math.sin(time * 2.3 + i * 0.25);
  return taper * Math.min(1, Math.abs(speech) * 1.5);
}

/**
 * A mic that's always open to you. Silent, the wave is a row of dots. Hold the button and it comes
 * alive while five minutes run down; hold on to the end and that's a talk. Let go and it falls
 * back to dots. It only runs while it's moving.
 */
function OpenMic({ onHold }: { onHold: (on: boolean) => void }) {
  const wave = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const hold = useRef<(on: boolean) => void>(() => {});
  const [mic, setMic] = useState<"idle" | "live" | "done">("idle");

  useGSAP(
    () => {
      const bars = gsap.utils.toArray<HTMLElement>("[data-wave]", wave.current);
      const state = { level: 0 };
      const draw = (time: number) => {
        bars.forEach((bar, i) => {
          bar.style.height = `${WAVE_MIN + state.level * voice(i, time) * (WAVE_HEIGHT - WAVE_MIN)}px`;
        });
      };

      const tick = (time: number) => draw(time);
      const run = (on: boolean) => {
        gsap.ticker.remove(tick);
        if (on) gsap.ticker.add(tick);
      };
      const quieten = () =>
        gsap.to(state, {
          level: 0,
          duration: 0.7,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            run(false);
            draw(0);
          },
        });

      let talk: gsap.core.Tween | undefined;
      hold.current = (on) => {
        talk?.kill();
        if (left.current) left.current.textContent = clock(TALK_SECONDS);
        if (calm()) {
          // No movement: the wave simply stands taller while held, and the clock stays put.
          state.level = on ? 1 : 0;
          draw(WAVE_STILL);
          return;
        }
        if (!on) {
          quieten();
          return;
        }
        run(true);
        gsap.to(state, { level: 1, duration: 0.25, ease: "power2.out", overwrite: true });
        const time = { left: TALK_SECONDS };
        talk = gsap.to(time, {
          left: 0,
          duration: TALK_HOLD,
          ease: "none",
          onUpdate: () => {
            if (left.current) left.current.textContent = clock(time.left);
          },
          onComplete: () => {
            setMic("done");
            quieten();
          },
        });
      };
      return () => {
        talk?.kill();
        run(false);
      };
    },
    { scope: wave },
  );

  const press = (on: boolean) => {
    setMic(on ? "live" : "idle");
    hold.current(on);
    onHold(on);
  };
  const held = mic !== "idle";

  return (
    <>
      <div ref={wave} aria-hidden="true" className="flex h-10 items-center justify-between">
        {Array.from({ length: WAVE_BARS }, (_, i) => (
          <span key={i} data-wave className="block max-w-1 flex-1 rounded-full bg-react" style={{ height: WAVE_MIN }} />
        ))}
      </div>

      <div className="flex">
        <button
          type="button"
          aria-label="Hold to speak"
          aria-pressed={held}
          onPointerDown={() => press(true)}
          onPointerUp={() => press(false)}
          onPointerCancel={() => press(false)}
          onPointerLeave={() => held && press(false)}
          onKeyDown={(event) => {
            if ((event.key === " " || event.key === "Enter") && !event.repeat) press(true);
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") press(false);
          }}
          onBlur={() => held && press(false)}
          onContextMenu={(event) => event.preventDefault()}
          className="btn btn-primary touch-none select-none justify-center tabular-nums transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-ink active:scale-[0.97]"
        >
          <Swap
            lines={[
              "Hold to speak",
              <>
                <span ref={left}>{clock(TALK_SECONDS)}</span> left
              </>,
              "That’s a talk",
            ]}
            shown={["idle", "live", "done"].indexOf(mic)}
            className="text-center"
          />
        </button>
      </div>

      <p className={lead}>Five minutes, any topic, any level.</p>
      <p className={`${detail} text-[#bdbdbd]`}>Most talks come from members. First-timers get a mentor.</p>

      <a href={TALK_EMAIL} className={`${action} btn-white`}>
        Email us a talk idea
      </a>
    </>
  );
}

const switchReplies = ["It doesn’t turn off", "Still on", "Nice try"];
const switchLines = ["Always on", ...switchReplies];

/**
 * A switch that won't stay off: flick it and it slides across, greys out, then comes back on by
 * itself. Every flick turns up another of the rules that come with it.
 */
function KindSwitch({ rules, onRule }: { rules: string[]; onRule: (rule: number) => void }) {
  const track = useRef<HTMLButtonElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  const flick = useRef<() => void>(() => {});
  const [line, setLine] = useState(0);
  const [rule, setRule] = useState(0);

  useEffect(() => onRule(rule), [rule, onRule]);

  useGSAP(
    () => {
      const azure = getComputedStyle(document.documentElement).getPropertyValue("--color-azure").trim();
      const travel = () => (track.current?.clientWidth ?? 0) - (knob.current?.offsetWidth ?? 0) - 2 * (knob.current?.offsetTop ?? 0);
      let turn = 0;
      let timer: ReturnType<typeof setTimeout>;
      const reply = () => {
        clearTimeout(timer);
        setLine(nextReply(turn++, switchReplies));
        setRule(turn % rules.length);
        timer = setTimeout(() => setLine(0), REPLY_MS);
      };

      let moving = false;
      flick.current = () => {
        if (moving) return;
        if (calm()) return reply();
        moving = true;
        gsap
          .timeline({ onComplete: () => (moving = false) })
          .to(knob.current, { x: -travel(), duration: 0.26, ease: "power2.out" }, 0)
          .to(track.current, { backgroundColor: "#bdbdbd", duration: 0.26, ease: "power2.out" }, 0)
          .add(reply, 0.3)
          .to(knob.current, { x: 0, duration: 0.55, ease: "back.out(2.4)" }, 0.42)
          .to(track.current, { backgroundColor: azure, duration: 0.4, ease: "power2.out" }, 0.42);
      };
      return () => clearTimeout(timer);
    },
    { scope: track, dependencies: [rules.length] },
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          ref={track}
          type="button"
          role="switch"
          aria-checked="true"
          aria-label="Kind by default"
          onClick={() => flick.current()}
          className="relative h-10 w-[4.5rem] shrink-0 cursor-pointer rounded-full bg-azure"
        >
          <span ref={knob} className="absolute inset-y-1 right-1 aspect-square rounded-full bg-white" />
        </button>
        <Swap lines={switchLines} shown={line} className="text-base" />
      </div>

      <Swap lines={rules} shown={rule} className={`${lead} items-end`} />
      <span role="status" className="sr-only">
        {line > 0 ? `${switchLines[line]}. ${rules[rule]}` : ""}
      </span>
    </>
  );
}

type Photo = { src: string; alt: string };

const levelPhotos: Photo[] = [
  { src: "/images/mentor-lean.jpg", alt: "A mentor leaning in to help two members at a laptop" },
  { src: "/images/table-laptops.jpg", alt: "Members coding around a long table in a bright office" },
  { src: "/images/enspace-talk.jpg", alt: "A member giving a talk to a room of developers" },
];
const kindPhotos: Photo[] = [
  { src: "/images/workshop-smiles.jpg", alt: "Members smiling at a workshop" },
  { src: "/images/peace-pair.jpg", alt: "Two members throwing peace signs" },
  { src: "/images/thumbs-up.jpg", alt: "Members giving a thumbs up at a table" },
  { src: "/images/peace-signs.jpg", alt: "Members smiling with peace signs" },
];

// A landscape photo in a tall frame is drawn by its height, so these run past the frame's own width.
const wideCardPhoto = "(min-width: 1024px) 52vw, 100vw";
const narrowCardPhoto = "(min-width: 1408px) 55vw, (min-width: 1024px) 45vw, 100vw";
// The narrower cards put their photo beside the text only where there's room, and on top of it until then.
const narrowCard = "tile grid lg:col-span-5";
const narrowPhoto = "h-36 min-[88rem]:h-auto";

/** Photos in one spot, easing from one to the next. */
function PhotoStack({ photos, shown, sizes, className = "" }: { photos: Photo[]; shown: number; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {photos.map((photo, i) => (
        <Image key={photo.src} src={photo.src} alt={i === shown ? photo.alt : ""} fill sizes={sizes} className={`object-cover transition-opacity duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${i === shown ? "opacity-100" : "opacity-0"}`} />
      ))}
    </div>
  );
}

/**
 * Everything here is a promise that doesn't move ("always", "every", "anyone", "default"), so each
 * one is a control a visitor can try to change, and none of them will give. Testing it is also how
 * it explains itself: what's covered, what's there at your level, how long a talk is, what the
 * rules are. Each promise has a photo that answers the control: the room goes dark as the price
 * climbs, each level shows who's there for it, the speaker comes into colour while you hold the
 * mic, and every flick of the switch brings up new faces. The page's answer to "is this for me?",
 * right after the claim it backs up.
 */
export function Principles({ rules }: { rules: string[] }) {
  const room = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [rule, setRule] = useState(0);
  // The higher the price, the darker the room, and it lights up again as the price snaps back.
  const dim = useCallback((pull: number) => {
    const share = Math.min(1, pull / 0.7);
    if (room.current) room.current.style.filter = `grayscale(${share}) brightness(${1 - 0.7 * share})`;
  }, []);

  return (
    <section aria-labelledby="values-title" className="px-2 pb-32 max-md:pb-20 pt-28 max-md:pt-20">
      <div className="mb-10 flex flex-col items-center gap-3 px-4 text-center">
        <SplitHeading id="values-title" className="display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]">How we run things</SplitHeading>
        <p className="m-0 text-base text-muted">Four things that never change. Go on, test them.</p>
      </div>

      <Reveal className="grid gap-2 lg:grid-cols-12">
        <div data-reveal className="tile grid bg-react text-ink sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:col-span-7">
          <div className={cardText}>
            <h3 className={cardTitle}>Free, always</h3>
            <PriceSlider onPull={dim} />
            <p className={lead}>Every event is free to attend.</p>
            <p className={detail}>Partners cover the room, the snacks and the occasional pizza.</p>
            <ul className="m-0 grid list-none gap-x-6 p-0 sm:grid-cols-2">
              {bill.map((item) => (
                <li key={item} className="flex justify-between gap-3 border-t border-ink/25 py-1.5 text-sm">
                  <span>{item}</span>
                  <span className="tabular-nums">₱0</span>
                </li>
              ))}
            </ul>
            <TransitionLink href="/partners" className={`${action} btn-black focus-visible:outline-ink!`}>
              Partner with us
            </TransitionLink>
          </div>
          <div ref={room} className="relative min-h-[14rem] max-sm:order-first">
            <Image src="/images/hall-full-room.jpg" alt="A full hall of people watching a talk" fill sizes={wideCardPhoto} className="object-cover object-bottom" />
          </div>
        </div>

        <div data-reveal className={`${narrowCard} bg-fog min-[88rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]`}>
          <div className={cardText}>
            <ComponentRuler onStage={setLevel} />
          </div>
          <PhotoStack photos={levelPhotos} shown={level} sizes={narrowCardPhoto} className={`${narrowPhoto} max-[87.99rem]:order-first`} />
        </div>

        <div data-reveal className={`${narrowCard} bg-black text-white min-[88rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]`}>
          <div className={`relative overflow-hidden ${narrowPhoto}`}>
            <Image src="/images/blue-shirt-talk.jpg" alt="A member giving a talk beside a projected slide" fill sizes={narrowCardPhoto} className={`object-cover transition-[filter] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${speaking ? "" : "grayscale"}`} />
          </div>
          <div className={cardText}>
            <h3 className={cardTitle}>Anyone can speak</h3>
            <OpenMic onHold={setSpeaking} />
          </div>
        </div>

        <div data-reveal className="tile grid bg-fog sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:col-span-7">
          <PhotoStack photos={kindPhotos} shown={rule} sizes={wideCardPhoto} className="min-h-[14rem]" />
          <div className={cardText}>
            <h3 className={cardTitle}>Kind by default</h3>
            <KindSwitch rules={rules} onRule={setRule} />
            <p className={`${detail} text-[#555]`}>The same code of conduct applies at every event, in the Facebook group, and anywhere else we meet.</p>
            <a href="#code-of-conduct" className={`${action} btn-black`}>
              Read the code of conduct
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion";

type Tone = "keyword" | "string" | "tag" | "attr" | "fn" | "number";
type Token = { text: string; tone?: Tone };
type CodeLine = { indent: number; tokens: Token[] };

const t = (text: string, tone?: Tone): Token => ({ text, tone });

// The component typed into the editor.
const code: CodeLine[] = [
  { indent: 0, tokens: [t("import", "keyword"), t(" { useState } "), t("from", "keyword"), t(" "), t('"react"', "string"), t(";")] },
  { indent: 0, tokens: [t("import", "keyword"), t(" Card "), t("from", "keyword"), t(" "), t('"./Card"', "string"), t(";")] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [t("export default function", "keyword"), t(" "), t("Meetup", "fn"), t("() {")] },
  { indent: 2, tokens: [t("const", "keyword"), t(" [rsvps, setRsvps] = "), t("useState", "fn"), t("("), t("41", "number"), t(");")] },
  { indent: 2, tokens: [t("const", "keyword"), t(" rsvp = () => "), t("setRsvps", "fn"), t("(rsvps + "), t("1", "number"), t(");")] },
  { indent: 0, tokens: [] },
  { indent: 2, tokens: [t("return", "keyword"), t(" (")] },
  { indent: 4, tokens: [t("<"), t("Card", "tag"), t(" "), t("title", "attr"), t("="), t('"Hello, Cebu!"', "string"), t(">")] },
  { indent: 6, tokens: [t("<"), t("button", "tag"), t(" "), t("onClick", "attr"), t("={rsvp}>")] },
  { indent: 8, tokens: [t("RSVPs {rsvps}")] },
  { indent: 6, tokens: [t("</"), t("button", "tag"), t(">")] },
  { indent: 4, tokens: [t("</"), t("Card", "tag"), t(">")] },
  { indent: 2, tokens: [t(");")] },
  { indent: 0, tokens: [t("}")] },
];
const lengthOf = (line: CodeLine) => line.indent + line.tokens.reduce((sum, token) => sum + token.text.length, 0);
// A quiet dark theme in the brand's blues, with warm accents for strings and numbers.
const toneClass: Record<Tone, string> = {
  keyword: "text-[#ff7ab2]",
  string: "text-[#ff9b85]",
  tag: "text-react",
  attr: "text-[#8ce6ff]",
  fn: "text-[#7fd8c4]",
  number: "text-[#e5c07b]",
};

// The files shown in the editor's sidebar, by depth.
const files = [
  { name: "react-cebu-workshop", depth: 0, kind: "folder" },
  { name: "public", depth: 1, kind: "folder" },
  { name: "src", depth: 1, kind: "folder" },
  { name: "Card.jsx", depth: 2, kind: "react" },
  { name: "Meetup.jsx", depth: 2, kind: "react", active: true },
  { name: "page.jsx", depth: 2, kind: "react" },
  { name: "package.json", depth: 1, kind: "file" },
] as const;

// Background grid size in cells; it is centred, so it always covers the section.
const CELL = 44;
const COLUMNS = 60;
const ROWS = 32;
// React's cyans a square can light up in.
const TWINKLE = ["#00d8ff", "#087ea4", "#61dafb"];

function Atom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="#00d8ff" strokeWidth="8">
        <ellipse rx="42" ry="16" />
        <ellipse rx="42" ry="16" transform="rotate(60)" />
        <ellipse rx="42" ry="16" transform="rotate(120)" />
      </g>
      <circle r="9" fill="#00d8ff" />
    </svg>
  );
}

function Folder() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" aria-hidden="true">
      <path d="M1.5 4.5a1 1 0 0 1 1-1h3.6l1.4 1.5h6a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" fill="#61dafb" />
    </svg>
  );
}

/**
 * The demo section pins while you scroll. A clean dark editor sits on a light grid:
 * scrolling types a component into it line by line, then its preview pane renders the
 * result and someone presses RSVP. Grid squares light up under the mouse, and now and
 * then on their own.
 */
export function LiveCoding() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current!;
      const grid = section.querySelector<SVGSVGElement>("[data-grid]")!;
      const squares = gsap.utils.toArray<SVGRectElement>("[data-square]", section);

      // The mouse trail on the grid. The browser reports the pointer only so often, so a fast
      // cursor would skip squares; instead every report (and the in-between ones the browser
      // coalesces) is joined to the last by a line, and each square along it lights up. The
      // square under the cursor stays lit; the ones it leaves fade out over a second.
      const light = (square: SVGRectElement) => {
        gsap.killTweensOf(square);
        gsap.set(square, { fill: "#00d8ff", fillOpacity: 0.8 });
      };
      const fade = (square: SVGRectElement) =>
        gsap.to(square, {
          fillOpacity: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => gsap.set(square, { clearProps: "fill,fillOpacity" }),
        });
      const cellAt = (x: number, y: number, box: DOMRect) => {
        const column = Math.floor((x - box.left) / CELL);
        const row = Math.floor((y - box.top) / CELL);
        return column >= 0 && column < COLUMNS && row >= 0 && row < ROWS ? row * COLUMNS + column : -1;
      };
      let current = -1;
      let last: { x: number; y: number } | null = null;
      const trace = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const box = grid.getBoundingClientRect();
        const samples = event.getCoalescedEvents?.() ?? [];
        for (const sample of samples.length ? samples : [event]) {
          const to = { x: sample.clientX, y: sample.clientY };
          const from = last ?? to;
          // A step every third of a square, so no square on the line is missed.
          const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / (CELL / 3)));
          for (let step = 1; step <= steps; step++) {
            const index = cellAt(from.x + ((to.x - from.x) * step) / steps, from.y + ((to.y - from.y) * step) / steps, box);
            if (index === current) continue;
            if (current >= 0) fade(squares[current]);
            current = index;
            if (index >= 0) light(squares[index]);
          }
          last = to;
        }
      };
      const untrace = () => {
        if (current >= 0) fade(squares[current]);
        current = -1;
        last = null;
      };
      section.addEventListener("pointermove", trace);
      section.addEventListener("pointerleave", untrace);

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=1800", pin: true, scrub: 0.6 },
        });
        // Each line types out a character at a time: the caret rides on its right edge,
        // the row is highlighted while it types, and a change bar marks it in the gutter.
        gsap.utils.toArray<HTMLElement>("[data-code-line]").forEach((line, i, all) => {
          const length = Number(line.dataset.length);
          const row = line.closest<HTMLElement>("[data-code-row]")!;
          const last = i === all.length - 1;
          tl.set(row, { backgroundColor: "rgba(255,255,255,0.05)" })
            .set(line, { borderRightColor: "#00d8ff" })
            .set(row.querySelector("[data-change]"), { autoAlpha: 1 });
          if (length) tl.fromTo(line, { width: "0ch" }, { width: `${length}ch`, ease: `steps(${length})`, duration: length * 0.03 });
          else tl.to({}, { duration: 0.1 });
          if (!last) tl.set(row, { backgroundColor: "rgba(255,255,255,0)" }).set(line, { borderRightColor: "transparent" });
        });
        tl.to("[data-status='compiling']", { autoAlpha: 0, duration: 0.2 })
          .to("[data-status='ready']", { autoAlpha: 1, duration: 0.2 }, "<")
          .to("[data-preview-empty]", { autoAlpha: 0, duration: 0.3 }, "<")
          .from("[data-card]", { y: 20, autoAlpha: 0, scale: 0.97, duration: 0.6, ease: "power3.out" })
          .to("[data-button]", { scale: 0.93, duration: 0.15 })
          .to("[data-button]", { scale: 1, duration: 0.15 })
          .to("[data-count='41']", { autoAlpha: 0, duration: 0.01 }, "<")
          .to("[data-count='42']", { autoAlpha: 1, duration: 0.01 }, "<")
          .to({}, { duration: 0.6 });

        // The editor leans a few degrees toward the mouse, the side nearest it easing back,
        // and settles flat again when the mouse leaves the section.
        const editor = section.querySelector<HTMLElement>("[data-editor]")!;
        gsap.set(editor, { transformPerspective: 1600 });
        const follow = { duration: 1.1, ease: "power3.out" };
        const turnTo = gsap.quickTo(editor, "rotationY", follow);
        const leanTo = gsap.quickTo(editor, "rotationX", follow);
        const shiftX = gsap.quickTo(editor, "x", follow);
        const shiftY = gsap.quickTo(editor, "y", follow);
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const box = section.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width - 0.5;
          const y = (event.clientY - box.top) / box.height - 0.5;
          turnTo(x * 6);
          leanTo(y * -5);
          shiftX(x * 14);
          shiftY(y * 10);
        };
        const settle = () => {
          turnTo(0);
          leanTo(0);
          shiftX(0);
          shiftY(0);
        };
        section.addEventListener("pointermove", move);
        section.addEventListener("pointerleave", settle);

        // While the section is on screen, a random square lights up in a brand colour now
        // and then and fades out.
        let timer: gsap.core.Tween | null = null;
        const twinkle = () => {
          const square = squares[Math.floor(Math.random() * squares.length)];
          gsap.fromTo(
            square,
            { fill: TWINKLE[Math.floor(Math.random() * TWINKLE.length)], fillOpacity: 0.9 },
            { fillOpacity: 0, duration: 2.4, ease: "power2.out", clearProps: "fill,fillOpacity" },
          );
          timer = gsap.delayedCall(0.35 + Math.random() * 0.6, twinkle);
        };
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => {
            timer?.kill();
            timer = isActive ? gsap.delayedCall(0.2, twinkle) : null;
          },
        });
        return () => {
          timer?.kill();
          section.removeEventListener("pointermove", move);
          section.removeEventListener("pointerleave", settle);
        };
      });
      return () => {
        mm.revert();
        section.removeEventListener("pointermove", trace);
        section.removeEventListener("pointerleave", untrace);
      };
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="demo-title"
      // Top padding clears the fixed nav, so the heading never slides under it.
      className="relative flex h-svh min-h-[680px] flex-col items-center justify-center gap-4 overflow-hidden bg-white px-4 pb-6 pt-16 md:gap-6 md:pt-20"
    >
      {/* The grid behind everything. The mouse trail and the twinkles light its squares. */}
      <svg
        aria-hidden="true"
        data-grid
        width={COLUMNS * CELL}
        height={ROWS * CELL}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {Array.from({ length: COLUMNS * ROWS }, (_, i) => (
          <rect
            key={i}
            data-square
            x={(i % COLUMNS) * CELL + 0.5}
            y={Math.floor(i / COLUMNS) * CELL + 0.5}
            width={CELL}
            height={CELL}
            className="fill-transparent stroke-[#ebebeb]"
          />
        ))}
      </svg>

      <div className="pointer-events-none relative flex flex-col items-center gap-3 text-center">
        {/* Like the other headings, but a touch smaller on phones and short screens, so the
            pinned editor always fits below it. */}
        <SplitHeading id="demo-title" className="display max-w-[900px] text-[clamp(34px,min(4.2vw,7vh),60px)]">
          Come with a question. Leave with something you built.
        </SplitHeading>
        <p className="m-0 hidden text-base text-muted sm:block">What a workshop afternoon looks like</p>
      </div>

      {/* The editor window, as tall as its code. It leans a little toward the mouse. */}
      <div
        data-editor
        className="relative flex w-full max-w-[1280px] flex-col overflow-hidden rounded-[16px] border-[3px] border-[#333333] bg-[#222222] text-[#e6e6e6] shadow-[0_40px_100px_rgba(0,0,0,0.25)]"
      >
        {/* Title bar */}
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[#333333] px-4 text-[13px] lg:text-[14px]">
          <span className="flex gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-3 hidden flex-col leading-tight sm:flex">
            <span className="font-medium">react-cebu-workshop</span>
            <span className="text-[11px] text-[#8b8e94]">main</span>
          </span>
          <span className="mx-auto flex items-center gap-2 rounded-md bg-[#2e2e2e] px-3 py-1 text-[12px] text-[#b4b7bd] lg:text-[13px]">
            <span className="relative inline-grid">
              <span data-status="compiling" className="col-start-1 row-start-1 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#febc2e]" />
                npm run dev · Compiling
              </span>
              <span data-status="ready" className="invisible col-start-1 row-start-1 flex items-center gap-1.5 opacity-0">
                <span className="size-2 rounded-full bg-[#28c840]" />
                npm run dev · Ready on :3000
              </span>
            </span>
          </span>
          <svg viewBox="0 0 16 16" className="size-4 text-[#8b8e94]" fill="currentColor" aria-hidden="true">
            <path d="M5 3.5v9l7-4.5z" />
          </svg>
        </div>

        {/* Sidebar, code and preview side by side; on phones the preview sits under the code. */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <div aria-hidden="true" className="hidden w-[230px] shrink-0 flex-col gap-0.5 border-r border-[#333333] bg-[#1b1b1b] p-3 text-[14px] lg:flex">
            {files.map((file) => (
              <span
                key={file.name}
                className={`flex items-center gap-2 rounded-md py-1 pr-2 ${"active" in file ? "bg-[#333333] text-white" : "text-[#b4b7bd]"}`}
                style={{ paddingLeft: 8 + file.depth * 14 }}
              >
                {file.kind === "folder" ? <Folder /> : file.kind === "react" ? <Atom className="size-3.5 shrink-0" /> : <span className="w-3.5 text-center text-[10px] text-[#8b8e94]">{"{}"}</span>}
                {file.name}
              </span>
            ))}
          </div>

          {/* Code */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div aria-hidden="true" className="flex h-[38px] shrink-0 items-stretch border-b border-[#333333] text-[12px] lg:h-[42px] lg:text-[13px]">
              <span className="flex items-center gap-2 border-r border-[#333333] bg-[#222222] px-4 text-white shadow-[inset_0_2px_0_#00d8ff]">
                <Atom className="size-3.5" /> Meetup.jsx
              </span>
              <span className="flex items-center gap-2 border-r border-[#333333] bg-[#1b1b1b] px-4 text-[#8b8e94]">
                <Atom className="size-3.5 opacity-60" /> Card.jsx
              </span>
              <span className="hidden items-center gap-2 border-r border-[#333333] bg-[#1b1b1b] px-4 text-[#8b8e94] sm:flex">
                <Atom className="size-3.5 opacity-60" /> page.jsx
              </span>
              <span className="flex-1 bg-[#1b1b1b]" />
            </div>
            <pre
              aria-label="A Meetup component with an RSVP counter"
              // On desktop the code grows with the screen's height (13px to 17px), so the pinned
              // editor always fits.
              className="m-0 min-h-0 flex-1 overflow-hidden py-3 font-mono text-[11px] leading-[1.6] sm:text-[13px] lg:py-3.5 lg:text-[clamp(13px,1.85vh,17px)]"
            >
              {code.map((line, i) => (
                <span key={i} data-code-row className="flex">
                  <span aria-hidden="true" className="relative w-11 shrink-0 select-none pr-3 text-right text-[#5c6068] sm:w-12 lg:w-14 lg:pr-4">
                    <span data-change className="invisible absolute inset-y-0 left-1 w-[3px] rounded-full bg-react opacity-0" />
                    {i + 1}
                  </span>
                  <span
                    data-code-line
                    data-length={lengthOf(line)}
                    // content-box, so a width of N ch holds N characters with the caret outside them.
                    className="box-content block overflow-hidden whitespace-pre border-r-2 border-transparent"
                  >
                    {" ".repeat(line.indent)}
                    {line.tokens.map((token, j) => (
                      <span key={j} className={token.tone ? toneClass[token.tone] : undefined}>
                        {token.text}
                      </span>
                    ))}
                    {/* So copied code keeps its line breaks and blank lines. A trailing newline
                        adds no extra line on screen and takes no width. */}
                    {"\n"}
                  </span>
                </span>
              ))}
            </pre>
          </div>

          {/* Preview, inside the editor */}
          <div aria-hidden="true" className="flex shrink-0 flex-col border-t border-[#333333] md:w-[min(400px,38%)] md:border-l md:border-t-0">
            <div className="flex h-[38px] shrink-0 items-center gap-2 border-b border-[#333333] bg-[#1b1b1b] px-3 text-[12px] text-[#8b8e94] lg:h-[42px] lg:text-[13px]">
              <span>Preview</span>
              <span className="ml-auto truncate rounded-md bg-[#2e2e2e] px-2.5 py-1 text-[#b4b7bd]">localhost:3000</span>
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v3h-3" />
              </svg>
            </div>
            <div className="relative flex flex-1 items-center justify-center bg-[#f4f5f7] p-4 text-black md:p-6">
              <span data-preview-empty className="absolute text-[13px] text-[#8b8e94]">Waiting for changes…</span>
              <div data-card className="flex w-full max-w-[300px] flex-col gap-4 rounded-[12px] border border-[#e3e3e3] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:gap-5 md:p-6">
                <span className="text-[28px] leading-none tracking-[-0.04em] md:text-[34px] lg:text-[38px]">Hello, Cebu!</span>
                <span data-button className="inline-flex min-h-11 items-center gap-2.5 self-start rounded-full bg-react px-5 text-[15px] font-medium text-ink lg:min-h-12 lg:text-[16px]">
                  RSVPs
                  <span className="relative inline-block w-[2ch]">
                    <span data-count="41" className="absolute left-0">41</span>
                    <span data-count="42" className="invisible absolute left-0">42</span>
                    &nbsp;
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

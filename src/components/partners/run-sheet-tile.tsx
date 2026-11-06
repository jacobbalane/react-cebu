"use client";

import { useRef, useState } from "react";
import { teamName, useOffer, ways } from "@/components/partners/offer";
import { AddPill, follow, grain, lying, onLight, rise, rootSize, shell, tileText, tileTitle, useLift, zoomOf } from "@/components/partners/ways-tile";
import { useGSAP } from "@/lib/gsap";

const engineers = ways[3];

const INK = "#00d8ff";
// Stroke widths in rem. The eraser is a little wider, so it clears a line in one pass.
const PEN = 1.15;
const RUBBER = 1.6;
// The canvas draws at twice its size, so strokes stay sharp on high-density screens.
const SHARPNESS = 2;

const afternoon = [
  ["1:00", "Doors open"],
  ["2:30", "Workshop"],
  ["4:30", "Show and tell"],
];

const tools = {
  pen: {
    label: "Highlighter",
    icon: <path d="M15 2.5l6.5 6.5-11 11-6.5-6.5zM4 13.5L10.5 20l-3 2.5H1.5v-6z" />,
    cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath d='M18 3l7 7-12 12-7-7z' fill='%23222'/%3E%3Cpath d='M6 15l7 7-3 3H3v-7z' fill='%2300d8ff' stroke='%23222' stroke-width='1.5'/%3E%3C/svg%3E") 3 25, crosshair`,
  },
  eraser: {
    label: "Eraser",
    icon: <path d="M14 3l8 8-10 10H7l-5-5zM8.5 8.5l8 8" />,
    cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath d='M16 4l8 8-11 11H8l-5-5z' fill='%23fff' stroke='%23222' stroke-width='2' stroke-linejoin='round'/%3E%3Cpath d='M10 10l8 8' stroke='%23222' stroke-width='2'/%3E%3C/svg%3E") 8 22, crosshair`,
  },
};

type Tool = keyof typeof tools;

function Slot({ time, label }: { time: string; label: string }) {
  return (
    <div className="pointer-events-none relative flex gap-3 py-1.5">
      <span className="tabular-nums">{time}</span>
      <span>{label}</span>
    </div>
  );
}

/**
 * A run sheet you can mark up. The highlighter and eraser draw on a canvas under the text, so ink can
 * never leave the paper. The line on "Talk by" sweeps in on hover as it always has, until the first
 * mark, when it's painted onto the canvas and becomes ink like any other.
 */
export function RunSheetTile() {
  const { team } = useOffer();
  const ref = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const inHand = useRef<Tool>("pen");
  const hover = useLift(ref, "engineers", (line, box) => {
    rise(line, box, { y: "3.5rem", rotation: 3 }, { y: "1.25rem", rotation: 0.5 });
    line.fromTo(box.querySelector("[data-marker]"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "power2.inOut" }, 0.25);
  });
  const [doors, ...rest] = afternoon;

  const pick = (next: Tool) => {
    inHand.current = next;
    setTool(next);
  };

  useGSAP(
    () => {
      const canvas = ref.current?.querySelector("canvas");
      const marker = ref.current?.querySelector<HTMLElement>("[data-marker]");
      const row = marker?.parentElement;
      const paint = canvas?.getContext("2d");
      if (!canvas || !marker || !row || !paint) return;

      canvas.width = canvas.clientWidth * SHARPNESS;
      canvas.height = canvas.clientHeight * SHARPNESS;
      paint.lineCap = "round";
      paint.lineJoin = "round";
      paint.strokeStyle = INK;
      paint.fillStyle = INK;

      const scale = () => canvas.width / canvas.clientWidth;

      // The default line becomes ink the first time the paper is marked, so it can be erased like the rest.
      let baked = false;
      const bake = () => {
        if (baked) return;
        baked = true;
        const k = scale();
        const x = (row.offsetLeft + marker.offsetLeft) * k;
        const y = (row.offsetTop + marker.offsetTop) * k;
        paint.save();
        paint.translate(x, y);
        paint.transform(1, 0, -Math.tan((6 * Math.PI) / 180), 1, 0, 0);
        paint.beginPath();
        paint.roundRect(0, 0, marker.offsetWidth * k, marker.offsetHeight * k, 3 * k);
        paint.fill();
        paint.restore();
        marker.style.visibility = "hidden";
      };

      const press = (down: PointerEvent) => {
        if (down.button) return;
        bake();
        const k = scale();
        const erasing = inHand.current === "eraser";
        paint.globalCompositeOperation = erasing ? "destination-out" : "source-over";
        paint.lineWidth = (erasing ? RUBBER : PEN) * rootSize() * k;

        // offsetX and offsetY already allow for the paper's tilt, but they still include the grid's zoom.
        const zoom = zoomOf(canvas);
        const at = (event: PointerEvent) => ({ x: (event.offsetX / zoom) * k, y: (event.offsetY / zoom) * k });
        let last = at(down);
        const stroke = (event: PointerEvent) => {
          const next = at(event);
          paint.beginPath();
          paint.moveTo(last.x, last.y);
          paint.lineTo(next.x, next.y);
          paint.stroke();
          last = next;
        };
        stroke(down);
        canvas.addEventListener("pointermove", stroke);
        follow(canvas, down, () => {}, () => canvas.removeEventListener("pointermove", stroke));
      };

      canvas.addEventListener("pointerdown", press);
      return () => canvas.removeEventListener("pointerdown", press);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal {...hover} className={`${shell} bg-fog text-ink lg:order-1 lg:col-span-4`}>
      <h3 className={tileTitle}>{engineers.title}</h3>
      <p className={tileText}>{engineers.text}</p>
      <div><AddPill id="engineers" title={engineers.title} tone={onLight} /></div>
      <div className="flex min-h-[11rem] flex-[1_1_0px] justify-center">
        <div data-object className={`${grain} ${lying} relative h-max w-[min(21rem,100%)] select-none rounded-[0.1875rem] px-4 pb-16 pt-5 text-ink`}>
          <canvas aria-label="Workshop afternoon, marked up with a highlighter" className="absolute inset-0 size-full touch-pan-y" style={{ cursor: tools[tool].cursor }} />
          <p className="pointer-events-none relative m-0 mb-2 whitespace-nowrap text-xl tracking-[-0.02em]">Workshop afternoon</p>
          <Slot time={doors[0]} label={doors[1]} />
          <div className="pointer-events-none relative flex gap-3 py-1.5">
            <span aria-hidden="true" data-marker className="absolute -inset-x-2 inset-y-0.5 -skew-x-6 rounded-[0.1875rem] bg-react" style={{ clipPath: "inset(0 100% 0 0)" }} />
            <span className="relative tabular-nums">1:30</span>
            <span className="relative min-w-0 truncate">Talk by {teamName(team)}</span>
          </div>
          {rest.map(([time, label]) => (
            <Slot key={time} time={time} label={label} />
          ))}
        </div>
      </div>

      {/* Black so it reads on both the card and the paper, which it overlaps on narrower cards. */}
      <div className="absolute bottom-3 right-3 z-10 flex gap-0.5 rounded-full bg-ink p-1">
        {(Object.keys(tools) as Tool[]).map((name) => (
          <button key={name} type="button" aria-pressed={tool === name} aria-label={tools[name].label} onClick={() => pick(name)} className={`grid size-8 cursor-pointer place-items-center rounded-full transition-colors duration-300 focus-visible:outline-white! ${tool === name ? "bg-white text-ink" : "text-white"}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              {tools[name].icon}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

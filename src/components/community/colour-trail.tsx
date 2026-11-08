"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

// The brush's radius as a share of the photo's width, and how much of it is solid before it softens.
const BRUSH = 0.075;
const SOLID = 0.35;
// The gap between dabs along the path, as a share of the brush.
const SPACING = 0.3;
// How long a dab of colour lasts, in seconds.
const LIFE = 1.1;
// How small a dab has shrunk by the end of its life, as a share of its size.
const TAIL = 0.3;
const MOST_DABS = 400;

type Dab = { x: number; y: number; born: number };

/**
 * Leaves a trail of the photo's colour behind the pointer, which narrows and closes up again, so
 * the room is back to grey soon after the pointer stops. Without a pointer, one trail crosses the
 * photo as the page opens to show there's colour under the grey, and a sideways drag makes more.
 * Phones (below 768px) get no trail at all; their photo stays grey.
 * Sits beside the photo's <img>, which it paints from. It only runs while there's a trail to draw,
 * and with reduced motion there's nothing to run, as the photo stays in colour.
 */
export function ColourTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const stage = canvas?.closest("section");
    const photo = host?.querySelector("img");
    const ctx = canvas?.getContext("2d");
    // One soft dab, drawn once and stamped along the path.
    const brush = document.createElement("canvas");
    const pen = brush.getContext("2d");
    if (!canvas || !host || !stage || !photo || !ctx || !pen) return;
    if (!window.matchMedia(MOTION_OK).matches) return;
    // Phones keep the photo grey with no trail: none on arrival and none from touch.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let radius = 0;
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(host.offsetWidth * scale);
      canvas.height = Math.round(host.offsetHeight * scale);
      radius = canvas.width * BRUSH;
      brush.width = brush.height = Math.ceil(radius * 2);
      const soft = pen.createRadialGradient(radius, radius, radius * SOLID, radius, radius, radius);
      soft.addColorStop(0, "#000");
      soft.addColorStop(1, "transparent");
      pen.fillStyle = soft;
      pen.fillRect(0, 0, brush.width, brush.height);
    };
    resize();
    const watch = new ResizeObserver(resize);
    watch.observe(host);

    let dabs: Dab[] = [];
    let running = false;

    // The photo, placed as object-cover places it, kept only along the trail.
    const fillTrail = () => {
      ctx.globalCompositeOperation = "source-in";
      const cover = Math.max(canvas.width / photo.naturalWidth, canvas.height / photo.naturalHeight);
      const width = photo.naturalWidth * cover;
      const height = photo.naturalHeight * cover;
      const [across, down] = getComputedStyle(photo).objectPosition.split(" ").map((share) => parseFloat(share) / 100);
      ctx.drawImage(photo, (canvas.width - width) * across, (canvas.height - height) * down, width, height);
    };

    const frame = () => {
      const now = gsap.ticker.time;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dabs = dabs.filter((dab) => now - dab.born < LIFE);
      if (!dabs.length) {
        gsap.ticker.remove(frame);
        running = false;
        return;
      }

      for (const dab of dabs) {
        const left = 1 - (now - dab.born) / LIFE;
        const size = brush.width * (TAIL + (1 - TAIL) * left);
        ctx.globalAlpha = Math.min(1, left * 1.8);
        ctx.drawImage(brush, dab.x - size / 2, dab.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      fillTrail();
    };

    let last: { x: number; y: number } | null = null;
    const travel = (x: number, y: number) => {
      if (!photo.naturalWidth) return;
      const from = last ?? { x, y };
      const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (radius * SPACING)));
      for (let i = 1; i <= steps; i++) {
        dabs.push({ x: from.x + ((x - from.x) * i) / steps, y: from.y + ((y - from.y) * i) / steps, born: gsap.ticker.time });
      }
      if (dabs.length > MOST_DABS) dabs = dabs.slice(-MOST_DABS);
      last = { x, y };
      if (!running) {
        running = true;
        gsap.ticker.add(frame);
      }
    };
    const lift = () => {
      last = null;
    };

    let opening: gsap.core.Tween | undefined;
    const follow = (event: PointerEvent) => {
      opening?.kill();
      const box = host.getBoundingClientRect();
      travel(((event.clientX - box.left) * canvas.width) / box.width, ((event.clientY - box.top) * canvas.height) / box.height);
    };
    stage.addEventListener("pointermove", follow);
    stage.addEventListener("pointerleave", lift);
    stage.addEventListener("pointercancel", lift);

    let live = true;
    photo
      .decode()
      .catch(() => {})
      .then(() => {
        if (!live || !window.matchMedia("(hover: none)").matches) return;
        const place = { at: 0 };
        opening = gsap.to(place, {
          at: 1,
          duration: 1.6,
          delay: 0.6,
          ease: "sine.inOut",
          onUpdate: () => travel(canvas.width * (0.08 + 0.84 * place.at), canvas.height * (0.34 + 0.06 * Math.sin(place.at * Math.PI * 2))),
          onComplete: lift,
        });
      });

    return () => {
      live = false;
      opening?.kill();
      watch.disconnect();
      gsap.ticker.remove(frame);
      stage.removeEventListener("pointermove", follow);
      stage.removeEventListener("pointerleave", lift);
      stage.removeEventListener("pointercancel", lift);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full max-md:hidden" />;
}

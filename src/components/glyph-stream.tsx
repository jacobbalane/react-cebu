"use client";

import { useEffect, useRef } from "react";

// A stream of dust poured from the pointer and carried off to the right by a steady current,
// drawn on a grid of small tiles: each tile lights up while dust passes over it and shows a
// random glyph. Whichever way the cursor moves, the dust always flows right. A click bursts
// dust outward, and the current then sweeps it right too.

const CELL = 22; // grid pitch
const TILE = 17; // tile size inside a cell
// Tiles draw their letters from the community's name.
const GLYPHS = "REACTCEBU";
const LIT = 0.35; // brightness above which a tile shows its glyph
const MAX_DUST = 1400;
const CURRENT = 3.4; // the rightward speed dust settles to, in px per frame at 60fps

type Mote = { x: number; y: number; vx: number; vy: number; life: number; span: number; current: number };

export function GlyphStream({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let offX = 0;
    let offY = 0;
    let dpr = 1;
    let glow = new Float32Array(0); // what each tile shows, eased toward the dust over it
    let dust = new Float32Array(0); // how much dust is over each tile this frame
    let glyph = new Uint8Array(0);
    let font = "600 10px sans-serif";

    const pointer = { x: 0, y: 0, px: 0, py: 0, inside: false };
    const motes: Mote[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      offX = (width - cols * CELL) / 2;
      offY = (height - rows * CELL) / 2;
      glow = new Float32Array(cols * rows);
      dust = new Float32Array(cols * rows);
      glyph = new Uint8Array(cols * rows);
      font = `600 10px ${getComputedStyle(host).fontFamily}`;
    };

    // Each speck gets its own share of the current, so the stream spreads out as it flows.
    const spawn = (x: number, y: number, vx: number, vy: number, span: number) => {
      if (motes.length >= MAX_DUST) motes.shift();
      motes.push({ x, y, vx, vy, life: 1, span, current: CURRENT * (0.6 + Math.random() * 0.8) });
    };

    // The pointer pours a thin stream while it rests, and throws more along the stretch it
    // just covered while it moves. New dust starts out heading right; moving right throws it
    // harder, and up or down tilts it a little, but nothing ever sets off to the left.
    const pour = (dt: number) => {
      const dx = pointer.x - pointer.px;
      const dy = pointer.y - pointer.py;
      const speed = Math.hypot(dx, dy);
      const count = Math.min(26, Math.ceil(speed * 0.5 * dt) + Math.ceil(1.5 * dt));
      const spread = Math.min(44, 12 + speed * 1.2);
      for (let k = 0; k < count; k++) {
        const t = Math.random();
        spawn(
          pointer.px + dx * t,
          pointer.py + dy * t + (Math.random() - 0.5) * spread,
          1 + Math.random() * 2.5 + Math.max(0, dx) * 0.35,
          (Math.random() - 0.5) * 1.4 + dy * 0.15,
          45 + Math.random() * 50,
        );
      }
    };

    const burst = (x: number, y: number) => {
      for (let k = 0; k < 140; k++) {
        const a = Math.random() * Math.PI * 2;
        const v = 2 + Math.random() * 7;
        spawn(x, y, Math.cos(a) * v, Math.sin(a) * v, 40 + Math.random() * 45);
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const inset = (CELL - TILE) / 2;
      for (let i = 0; i < glow.length; i++) {
        const e = glow[i];
        if (e < 0.025) continue;
        const x = offX + (i % cols) * CELL + inset;
        const y = offY + Math.floor(i / cols) * CELL + inset;
        // Dim teal where the dust is thin, full React cyan where it's thick.
        ctx.fillStyle = `rgba(0, 216, 255, ${Math.min(1, 0.05 + e * 0.95)})`;
        ctx.beginPath();
        ctx.roundRect(x, y, TILE, TILE, 3);
        ctx.fill();
        if (e > LIT) {
          // Cyan carries ink: the glyphs are near-black, fading in as the tile brightens.
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (e - LIT) / (1 - LIT)) * 0.85})`;
          ctx.fillText(GLYPHS[glyph[i]], x + TILE / 2, y + TILE / 2 + 0.5);
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / (1000 / 60), 3) : 1;
      last = now;

      if (pointer.inside) pour(dt);
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      // The current eases every speck toward its rightward speed while its sideways drift dies
      // down; a little wander keeps the stream loose, and dust thins out as it ages.
      dust.fill(0);
      const settle = 1 - Math.pow(0.95, dt);
      const calm = Math.pow(0.95, dt);
      for (let m = motes.length - 1; m >= 0; m--) {
        const mote = motes[m];
        mote.life -= dt / mote.span;
        if (mote.life <= 0 || mote.x > width + CELL) {
          motes.splice(m, 1);
          continue;
        }
        mote.vx += (mote.current - mote.vx) * settle + (Math.random() - 0.5) * 0.25 * dt;
        mote.vy = mote.vy * calm + (Math.random() - 0.5) * 0.3 * dt;
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;
        const c = Math.floor((mote.x - offX) / CELL);
        const r = Math.floor((mote.y - offY) / CELL);
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        dust[r * cols + c] += 0.28 * mote.life;
      }

      // Tiles rise quickly to the dust over them and fall away a little slower, so the light
      // reads as motion rather than flicker; lit tiles now and then swap their glyph.
      let active = motes.length > 0;
      const rise = 1 - Math.pow(0.45, dt);
      const fall = 1 - Math.pow(0.86, dt);
      for (let i = 0; i < glow.length; i++) {
        const target = Math.min(1, dust[i]);
        const before = glow[i];
        if (target < 0.01 && before < 0.01) {
          glow[i] = 0;
          continue;
        }
        glow[i] += (target - before) * (target > before ? rise : fall);
        if (before < LIT && glow[i] >= LIT) glyph[i] = Math.floor(Math.random() * GLYPHS.length);
        else if (glow[i] > LIT && Math.random() < 0.03 * dt) glyph[i] = Math.floor(Math.random() * GLYPHS.length);
        active = true;
      }

      draw();
      if (active || pointer.inside) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const locate = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const onEnter = (event: PointerEvent) => {
      locate(event);
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.inside = true;
      wake();
    };
    const onMove = (event: PointerEvent) => {
      if (!pointer.inside) onEnter(event);
      locate(event);
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onDown = (event: PointerEvent) => {
      locate(event);
      burst(pointer.x, pointer.y);
      wake();
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      wake();
    });
    observer.observe(host);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 block h-full w-full ${className}`} />;
}

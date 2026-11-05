"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// In CSS pixels: the distance from one square to the next, and the size of a square.
const CELL = 12;
const SQUARE = 7;

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// Cebby's purple (#9333EA), with a deeper step for fading squares and a lighter one for the brightest.
const FRAGMENT = `
precision highp float;
uniform vec2 u_size;
uniform float u_time;
uniform float u_cell;
uniform float u_square;
uniform vec2 u_words; // How far right and how high the card's words reach, from 0 to 1.
uniform vec3 u_pointer; // x and y from 0 to 1 across the card, z is how present the pointer is.

const vec3 DEEP = vec3(0.231, 0.027, 0.392);
const vec3 CEBBY = vec3(0.576, 0.2, 0.918);
const vec3 LILAC = vec3(0.753, 0.518, 0.988);

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 p = gl_FragCoord.xy - floor(mod(u_size - u_square, u_cell) * 0.5);
  vec2 inside = mod(p, u_cell);
  if (p.x < 0.0 || p.y < 0.0 || inside.x > u_square || inside.y > u_square) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }
  vec2 cell = floor(p / u_cell);
  vec2 uv = (cell * u_cell + u_square * 0.5) / u_size;

  // Each square fades in and out at its own pace, and rolls again for its place while it's dark.
  float turn = u_time * (0.5 + 1.3 * hash(cell + 3.1)) + hash(cell) * 6.2832;
  float blink = pow(0.5 + 0.5 * sin(turn), 2.0);
  float roll = hash(cell + floor(turn / 6.2832 + 0.25) * 1.7);

  // The squares gather on the right and keep clear of the words.
  float edge = mix(u_words.x + 0.06, 0.38, smoothstep(u_words.y - 0.02, u_words.y + 0.2, uv.y));
  float chance = smoothstep(edge, 1.05, uv.x);

  // The pointer wakes the squares around it.
  vec2 gap = (uv - u_pointer.xy) * vec2(u_size.x / u_size.y, 1.0);
  float near = u_pointer.z * exp(-dot(gap, gap) * 34.0);

  float shown = smoothstep(roll - 0.06, roll + 0.06, chance + near) * smoothstep(0.0, 0.04, chance + near);
  float level = shown * mix(blink, 1.0, near * 0.75);
  vec3 colour = mix(DEEP, CEBBY, smoothstep(0.1, 0.6, level));
  colour = mix(colour, LILAC, smoothstep(0.8, 1.0, level) * 0.6);
  gl_FragColor = vec4(colour * smoothstep(0.0, 0.16, level), 1.0);
}
`;

/**
 * A field of little squares in Cebby's purple that quietly blink, gathered on the right of the card
 * and waking around the pointer. It measures the card's h3 and p so it can keep clear of them. It
 * stops off screen, and reduced motion gets one still frame. Fills the nearest positioned parent.
 */
export function BlinkingSquares() {
  const ref = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = ref.current;
      const card = canvas?.parentElement;
      const gl = canvas?.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
      if (!canvas || !card || !gl) return;

      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      };
      const vertex = compile(gl.VERTEX_SHADER, VERTEX);
      const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) return;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.useProgram(program);

      // One triangle big enough to cover the whole canvas.
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const size = gl.getUniformLocation(program, "u_size");
      const time = gl.getUniformLocation(program, "u_time");
      const cell = gl.getUniformLocation(program, "u_cell");
      const square = gl.getUniformLocation(program, "u_square");
      const words = gl.getUniformLocation(program, "u_words");
      const place = gl.getUniformLocation(program, "u_pointer");
      const pointer = { x: 0.5, y: 0.5, z: 0 };

      let now = 30;
      const draw = () => {
        gl.uniform1f(time, now);
        gl.uniform3f(place, pointer.x, pointer.y, pointer.z);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      // A range measures the text itself, not the wider box around it.
      const range = document.createRange();
      const measureWords = () => {
        const frame = card.getBoundingClientRect();
        let right = 0;
        let high = 0;
        card.querySelectorAll("h3, p").forEach((line) => {
          range.selectNodeContents(line);
          const box = range.getBoundingClientRect();
          right = Math.max(right, box.right - frame.left);
          high = Math.max(high, frame.bottom - box.top);
        });
        gl.uniform2f(words, right / frame.width, high / frame.height);
      };
      const fit = () => {
        const density = Math.min(window.devicePixelRatio, 2);
        canvas.width = Math.max(1, Math.round(card.clientWidth * density));
        canvas.height = Math.max(1, Math.round(card.clientHeight * density));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(size, canvas.width, canvas.height);
        // Whole device pixels keep every square's edges crisp.
        gl.uniform1f(cell, Math.round(CELL * density));
        gl.uniform1f(square, Math.round(SQUARE * density));
        measureWords();
        draw();
      };
      const resize = new ResizeObserver(fit);
      resize.observe(card);
      fit();
      // The words change width once the font arrives.
      document.fonts.ready.then(fit);

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tick = (seconds: number) => {
          now = 30 + seconds;
          draw();
        };
        const watch = new IntersectionObserver(([entry]) => {
          gsap.ticker.remove(tick);
          if (entry.isIntersecting) gsap.ticker.add(tick);
        });
        watch.observe(card);

        const follow = { duration: 0.7, ease: "power3.out" };
        const moveX = gsap.quickTo(pointer, "x", follow);
        const moveY = gsap.quickTo(pointer, "y", follow);
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const box = card.getBoundingClientRect();
          moveX((event.clientX - box.left) / box.width);
          moveY(1 - (event.clientY - box.top) / box.height);
          gsap.to(pointer, { z: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        };
        const leave = () => gsap.to(pointer, { z: 0, duration: 1.2, ease: "power2.inOut", overwrite: "auto" });
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          gsap.ticker.remove(tick);
          watch.disconnect();
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });

      return () => {
        mm.revert();
        resize.disconnect();
        gl.deleteProgram(program);
        gl.deleteBuffer(buffer);
      };
    },
    { scope: ref },
  );

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}

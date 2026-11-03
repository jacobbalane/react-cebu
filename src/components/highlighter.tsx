"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import { gsap } from "@/lib/gsap";

type Action = Parameters<typeof annotate>[1]["type"];

/**
 * Magic UI's Highlighter: a hand-drawn rough-notation mark behind or around some text.
 * Instead of drawing once on view, it draws in while the nearest `.group` ancestor (or
 * the text itself) is hovered or focused, and fades out after. Each hover draws a new stroke.
 */
export function Highlighter({
  children,
  action = "highlight",
  color = "#00d8ff",
  strokeWidth = 1.5,
  animationDuration = 500,
  iterations = 2,
  padding = 2,
  multiline = true,
}: {
  children: React.ReactNode;
  action?: Action;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const trigger = element.closest<HTMLElement>(".group") ?? element;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const config = { type: action, color, strokeWidth, animationDuration, iterations, padding, multiline, animate: !still };
    let annotation: ReturnType<typeof annotate> | null = null;
    let svg: Element | null = null;
    let hovered = false;
    let focused = false;

    // Every annotation picks its own random seed, so a fresh one draws a different stroke each hover.
    const draw = () => {
      annotation = annotate(element, config);
      // rough-notation draws into an svg it places just before a highlight and just after other marks.
      svg = action === "highlight" ? element.previousElementSibling : element.nextElementSibling;
      annotation.show();
    };
    const erase = () => {
      annotation?.remove();
      annotation = null;
      svg = null;
    };

    const update = () => {
      if (svg) gsap.killTweensOf(svg);
      if (hovered || focused) {
        // Back before the fade finished: bring the same mark back rather than drawing a new one.
        if (svg) gsap.to(svg, { opacity: 1, duration: still ? 0 : 0.15, ease: "power1.out" });
        else draw();
      } else if (svg) {
        gsap.to(svg, { opacity: 0, duration: still ? 0 : 0.25, ease: "power1.out", onComplete: erase });
      }
    };
    const enter = () => ((hovered = true), update());
    const leave = () => ((hovered = false), update());
    const focus = () => ((focused = true), update());
    const blur = () => ((focused = false), update());

    trigger.addEventListener("pointerenter", enter);
    trigger.addEventListener("pointerleave", leave);
    trigger.addEventListener("focusin", focus);
    trigger.addEventListener("focusout", blur);
    return () => {
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      trigger.removeEventListener("focusin", focus);
      trigger.removeEventListener("focusout", blur);
      if (svg) gsap.killTweensOf(svg);
      erase();
    };
  }, [action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

  return (
    <span ref={ref} className="relative">
      {children}
    </span>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ChecklistTile } from "@/components/partners/checklist-tile";
import { SplitHeading, Reveal } from "@/components/motion";
import { useOffer } from "@/components/partners/offer";
import { PARTNER_EMAIL } from "@/data/site";
import { ReceiptTile } from "@/components/partners/receipt-tile";
import { retype } from "@/components/partners/retype";
import { RunSheetTile } from "@/components/partners/run-sheet-tile";
import { StickerTile } from "@/components/partners/sticker-tile";
import { TicketTile } from "@/components/partners/ticket-tile";

// British rules, so a list has no comma before its "and", like the rest of the site's copy.
const list = new Intl.ListFormat("en-GB", { type: "conjunction" });

/**
 * Every way to help leaves something real behind, and each card holds that thing to play with: a
 * checklist to tick, a receipt to tear, stickers to peel, a run sheet to mark up and a ticket to rip.
 * None of that touches the offer. The black card's sentence grows into one as ways are picked, and
 * whatever goes into it, the price at the door doesn't move.
 */
export function Ways() {
  const { picked } = useOffer();
  const sentence = picked.length ? `You’ll bring ${list.format(picked.map((way) => way.brings))}. The door stays ₱0.` : "Whatever you pick, the door stays ₱0.";
  const email = picked.length ? `${PARTNER_EMAIL}&body=${encodeURIComponent(`We’d like to help with: ${list.format(picked.map((way) => way.title))}.`)}` : PARTNER_EMAIL;
  // The letters are handed over to `retype` after the first render, so React keeps writing only what it wrote first.
  const [first] = useState(sentence);
  const typed = useRef<HTMLSpanElement>(null);
  const typist = useRef<ReturnType<typeof retype> | null>(null);

  useEffect(() => {
    if (!typed.current) return;
    const typing = retype(typed.current);
    typist.current = typing;
    return () => typing.stop();
  }, []);

  useEffect(() => {
    typist.current?.write(sentence);
  }, [sentence]);

  return (
    <section id="ways" aria-labelledby="ways-title" className="scroll-mt-24 px-2 pb-32 pt-28">
      <SplitHeading id="ways-title" className="display m-0 mb-10 px-4 text-[clamp(2.5rem,4.2vw,3.75rem)]">Five ways to keep the next event free</SplitHeading>

      {/*
        The two rows split at different points, so four card corners never meet at one spot.
        Past 2200px the whole grid scales up in steps, so it lays out as it does at about 1920 and the cards never stretch around their contents.
      */}
      <Reveal className="grid gap-2 lg:grid-cols-12 min-[137.5rem]:[zoom:1.15] min-[150rem]:[zoom:1.25] min-[160rem]:[zoom:1.33] min-[180rem]:[zoom:1.5] min-[240rem]:[zoom:2]">
        <ChecklistTile />
        <ReceiptTile />
        <StickerTile />
        <TicketTile />
        <RunSheetTile />
        <div data-reveal className="tile flex flex-col items-start justify-between gap-8 bg-black p-7 text-white sm:p-10 lg:order-3 lg:col-span-12 lg:flex-row lg:items-end lg:p-7 min-[80rem]:col-span-4 min-[80rem]:flex-col min-[80rem]:items-start min-[88rem]:p-10">
          <p className="title m-0 max-w-[26ch] text-[clamp(2rem,3.4vw,3.25rem)] min-[80rem]:text-[clamp(2rem,2.8vw,2.75rem)]">
            <span ref={typed} aria-hidden="true">{first}</span>
            <span aria-live="polite" className="sr-only">{sentence}</span>
          </p>
          <a href={email} className="btn btn-primary shrink-0 hover:bg-white hover:text-ink">{picked.length ? "Email my offer" : "Email us"}</a>
        </div>
      </Reveal>
    </section>
  );
}

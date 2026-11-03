"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Draggable, gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Reveal, SplitHeading } from "@/components/motion";

// Desktop stickers sit over the whole grid; on phones they live inside their own tile.
const stickers = [
  { label: "minim", className: "bg-electric text-white", desktop: { left: "35%", top: "40%" }, mobile: { left: "6%", top: "10%" }, rotate: -7 },
  { label: "veniam", className: "bg-black text-white", desktop: { left: "38%", top: "50%" }, mobile: { left: "30%", top: "34%" }, rotate: 4 },
  { label: "quis", className: "bg-sky text-black", desktop: { left: "47%", top: "42%" }, mobile: { left: "14%", top: "58%" }, rotate: -3 },
];

function Sticker({ sticker, place, className }: { sticker: (typeof stickers)[number]; place: { left: string; top: string }; className: string }) {
  return (
    <button
      type="button"
      data-sticker
      data-rotate={sticker.rotate}
      aria-label={`${sticker.label}, draggable sticker`}
      className={`absolute cursor-grab touch-none select-none whitespace-nowrap px-6 pb-2.5 pt-1 tracking-[-0.045em] active:cursor-grabbing ${sticker.className} ${className}`}
      style={place}
    >
      {sticker.label}
    </button>
  );
}

const rules = [
  { id: "kind", label: "Nostrud exercitation" },
  { id: "room", label: "Ullamco laboris nisi aliquip" },
  { id: "beginner", label: "Ex ea commodo" },
] as const;

const past = [
  { title: "Consequat duis", image: "/images/placeholder.png", tone: "bg-black text-white" },
  { title: "Aute irure in", tone: "bg-electric text-white" },
  { title: "Reprehenderit voluptate velit esse", image: "/images/placeholder.png", tone: "bg-black text-white" },
  { title: "Cillum fugiat nulla", tone: "bg-sky text-black" },
  { title: "Pariatur excepteur sint", image: "/images/placeholder.png", tone: "bg-black text-white" },
  { title: "Occaecat cupidatat non proident", tone: "bg-white text-black" },
];

export function Bento() {
  const stage = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<Record<string, boolean>>({ kind: true, room: true, beginner: true });
  const allOn = rules.every((rule) => on[rule.id]);

  // Stickers can be thrown anywhere on the grid and slide to a stop.
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-sticker]");
      items.forEach((item) => gsap.set(item, { rotate: Number(item.dataset.rotate) }));
      const draggables = items.flatMap((item) =>
        Draggable.create(item, {
          type: "x,y",
          bounds: item.closest("[data-sticker-bounds]") ?? stage.current,
          inertia: true,
          onPress() {
            gsap.to(this.target, { rotate: 0, scale: 1.06, duration: 0.2 });
          },
          onRelease() {
            gsap.to(this.target, { rotate: Number(this.target.dataset.rotate), scale: 1, duration: 0.4, ease: "back.out(2)" });
          },
        }),
      );
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(items, {
          scale: 0,
          rotate: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(2)",
          scrollTrigger: { trigger: stage.current, start: "40% bottom", once: true },
        });
      });
      return () => {
        draggables.forEach((d) => d.kill());
        mm.revert();
      };
    },
    { scope: stage },
  );

  return (
    <section aria-labelledby="grow-title" className="px-2 pb-32 pt-28">
      <SplitHeading id="grow-title" className="display mb-10 px-4 text-[clamp(40px,4.2vw,60px)]">
        Sunt culpa qui officia deserunt mollit anim id est
      </SplitHeading>
      <div ref={stage} className="relative">
        <Reveal className="grid auto-rows-[minmax(220px,auto)] grid-cols-2 gap-2 lg:auto-rows-[150px] lg:grid-cols-12">
          <Link href="/events" data-reveal className="tile col-span-2 bg-electric p-[22px] text-white lg:col-span-4 lg:row-span-2">
            <span className="block text-[40px] leading-none tracking-[-0.04em]">Laborum</span>
            <span className="mt-2 block max-w-[200px] text-base leading-snug text-on-electric">Lorem ipsum dolor sit amet consectetur adipiscing</span>
            <div className="absolute bottom-4 right-4 h-[58%] w-[56%] overflow-hidden rounded-lg">
              <Image src="/images/placeholder.png" alt="Elit sed do eiusmod tempor incididunt" fill sizes="20vw" className="object-cover" />
            </div>
          </Link>

          <Link href="/events" data-reveal className="tile reel col-span-2 min-h-[360px] bg-black text-white lg:col-span-5 lg:row-span-3">
            {["workshop", "laptops", "coder"].map((photo, i) => (
              <Image key={photo} src={"/images/placeholder.png"} alt={i === 0 ? "Ut labore et dolore magna aliqua" : ""} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            ))}
            <span className="absolute left-4 top-4 rounded-lg bg-black px-4 py-2.5 text-[40px] leading-none tracking-[-0.04em]">Enim</span>
            <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base">Ad minim veniam quis nostrud exercitation ullamco laboris.</span>
          </Link>

          <div data-reveal className="tile flex flex-col justify-between bg-fog p-5 lg:col-span-3">
            <span className="text-[15px] text-[#555]">Nisi aliquip ex</span>
            <span className="text-[48px] leading-none tracking-[-0.045em]">Ea</span>
          </div>

          <Link href="/events" data-reveal className="tile flex flex-col justify-between bg-sky p-5 lg:col-span-3 lg:row-span-2">
            <span aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,.12)_0_1px,transparent_1px_36px),repeating-linear-gradient(0deg,rgba(0,0,0,.12)_0_1px,transparent_1px_36px)]" />
            <span className="relative text-[15px]">Commodo consequat duis</span>
            <span className="relative text-[40px] leading-none tracking-[-0.04em]">Aute irure</span>
          </Link>

          <Link href="/community" data-reveal className="tile group flex flex-col justify-between bg-midnight p-[18px] text-white lg:col-span-2">
            <span className="text-2xl tracking-[-0.02em]">In</span>
            <span className="flex">
              {[1, 2, 3, 4].map((n, i) => (
                <Image
                  key={n}
                  src={"/images/placeholder.png"}
                  alt=""
                  width={44}
                  height={44}
                  className={`size-11 rounded-full border-2 border-midnight object-cover transition-[margin] duration-500 ${i ? "-ml-5 group-hover:ml-1.5" : ""}`}
                />
              ))}
            </span>
          </Link>

          <div data-reveal className="tile flex flex-col gap-2 bg-black p-4 text-white lg:col-span-2">
            <span className="text-lg">Reprehenderit voluptate</span>
            <span className="rounded-md bg-[#262626] px-2.5 py-1.5 text-sm">Velit esse cillum</span>
            <span className="rounded-md bg-electric px-2.5 py-1.5 text-sm">Fugiat</span>
            <span className="rounded-md bg-[#262626] px-2.5 py-1.5 text-sm">Nulla pariatur</span>
          </div>

          <Link href="/speak" data-reveal className="tile col-span-2 flex flex-col justify-between gap-5 bg-electric p-6 text-white lg:col-span-4 lg:row-span-3">
            <span className="relative border-[1.5px] border-white p-4">
              {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
                <span key={pos} aria-hidden="true" className={`absolute size-[9px] bg-white ${pos}`} />
              ))}
              <span className="block text-[clamp(28px,2.5vw,36px)] leading-[1.12] tracking-[-0.035em]">
                Excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum lorem
              </span>
            </span>
            <span className="text-base text-on-electric">Ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.</span>
          </Link>

          <div data-reveal data-sticker-bounds className="tile col-span-2 flex min-h-[280px] flex-col justify-end bg-fog p-5 lg:col-span-4 lg:row-span-2 lg:[&>[data-sticker]]:hidden">
            {stickers.map((sticker) => (
              <Sticker key={sticker.label} sticker={sticker} place={sticker.mobile} className="text-[40px]" />
            ))}
            <span className="relative text-base text-[#555]">Tempor incididunt ut labore et dolore magna.</span>
          </div>

          <div data-reveal className="tile col-span-2 flex flex-col justify-between gap-5 bg-black p-6 text-white lg:col-span-4 lg:row-span-3">
            <div className="flex items-start justify-between gap-3">
              <span className="text-4xl leading-none tracking-[-0.035em]">Aliqua enim ad</span>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l7 3v6c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="flex flex-col gap-2.5">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between gap-3 rounded-full bg-white px-4 py-3 text-black">
                  <span className="text-lg">{rule.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on[rule.id]}
                    aria-label={rule.label}
                    onClick={() => setOn((prev) => ({ ...prev, [rule.id]: !prev[rule.id] }))}
                    className={`inline-flex h-[30px] w-[52px] cursor-pointer rounded-full p-[3px] transition-colors ${on[rule.id] ? "justify-end bg-electric" : "justify-start bg-[#bdbdbd]"}`}
                  >
                    <span className="size-6 rounded-full bg-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-base leading-snug text-[#bdbdbd]" aria-live="polite">
                {allOn ? "All three on. That’s the whole idea." : "Switch it back on. These aren’t optional at our events."}
              </span>
              <Link href="/community#code-of-conduct" className="btn btn-white self-start">Minim veniam quis nostrud exercitation</Link>
            </div>
          </div>

          <a href="#facebook" data-reveal className="tile flex flex-col justify-between bg-sky p-[18px] lg:col-span-2">
            <span className="text-[22px] tracking-[-0.02em]">Ullamco laboris</span>
            <span className="text-[15px] leading-snug">Nisi aliquip ex ea commodo consequat duis</span>
          </a>

          <div data-reveal className="tile flex flex-col justify-between bg-fog p-[18px] lg:col-span-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
            <span className="text-[15px] leading-snug">Aute irure in reprehenderit voluptate velit esse</span>
          </div>

          <Link href="/community#organizers" data-reveal className="tile flex flex-col justify-between bg-black p-5 text-white lg:col-span-2 lg:row-span-2">
            <span className="text-4xl leading-none tracking-[-0.035em]">Cillum</span>
            <span className="text-[15px] leading-snug text-[#bdbdbd]">Fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt</span>
          </Link>

          <Link href="/recaps" data-reveal className="tile group col-span-2 flex flex-col justify-between gap-4 bg-midnight p-5 text-white lg:col-span-6 lg:row-span-2">
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-4xl leading-none tracking-[-0.035em]">Culpa qui</span>
              <span className="hidden text-[15px] text-on-midnight lg:inline">Officia deserunt mollit anim</span>
            </span>
            <span className="overflow-hidden rounded-lg">
              <span className="grid grid-cols-2 gap-2 lg:flex lg:transition-transform lg:duration-[1200ms] lg:ease-[cubic-bezier(.2,.8,.2,1)] lg:group-hover:-translate-x-[38%]">
                {past.map((item, i) => (
                  <span key={item.title} className={`relative block h-[150px] shrink-0 overflow-hidden rounded-lg lg:h-[170px] lg:w-[230px] ${item.tone} ${i > 3 ? "hidden lg:block" : ""}`}>
                    {item.image && <Image src={item.image} alt="" fill sizes="230px" className="object-cover" />}
                    <span className="absolute inset-x-3 bottom-3 text-[22px] leading-[1.05] tracking-[-0.03em]">{item.title}</span>
                  </span>
                ))}
              </span>
            </span>
          </Link>

          <Link href="/recaps" data-reveal className="tile flex flex-col justify-between bg-fog p-5 lg:col-span-2 lg:row-span-2">
            <span className="text-[15px] text-[#555]">Id est laborum</span>
            <span className="text-6xl leading-[0.9] tracking-[-0.05em]">Lorem</span>
          </Link>

          <Link href="/recaps" data-reveal className="tile min-h-[220px] bg-black text-white lg:col-span-2 lg:row-span-2">
            <Image src="/images/placeholder.png" alt="Ipsum dolor sit amet consectetur" fill sizes="(min-width: 1024px) 16vw, 50vw" className="object-cover" />
            <span aria-hidden="true" className="absolute left-1/2 top-[42%] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
              <svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="#000" /></svg>
            </span>
            <span className="absolute bottom-3.5 left-3.5 rounded-lg bg-black px-3 py-2 text-lg">Adipiscing</span>
          </Link>
        </Reveal>

        {stickers.map((sticker) => (
          <Sticker key={sticker.label} sticker={sticker} place={sticker.desktop} className="hidden text-[56px] lg:block" />
        ))}
      </div>
    </section>
  );
}

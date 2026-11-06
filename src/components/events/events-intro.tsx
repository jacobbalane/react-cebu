import Image from "next/image";
import { ColourTrail } from "@/components/community/colour-trail";
import { SplitHeading } from "@/components/motion";

/**
 * The room sits in grey shadow, and the pointer leaves a trail of its colour, as on the Community
 * page. With reduced motion the room is simply in colour.
 */
export function EventsIntro() {
  return (
    <section
      aria-labelledby="page-title"
      className="relative flex h-[max(640px,100svh)] touch-pan-y flex-col items-center justify-end gap-5 overflow-hidden bg-black px-4 pb-20 text-center text-white md:pb-24"
    >
      <div className="absolute inset-0">
        <Image src="/images/hall-full-room.jpg" alt="A full hall watching a talk at the first React Cebu meetup" fill preload sizes="100vw" className="object-cover object-bottom motion-safe:brightness-[.45] motion-safe:grayscale" />
        <ColourTrail />
      </div>
      {/* Darkens the lower half so the white copy reads over the room. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-45% to-transparent" />

      <SplitHeading as="h1" id="page-title" animation="rise" by="line" className="display relative m-0 text-balance text-[clamp(2.75rem,6.4vw,7rem)] leading-[0.92]">
        Come to the next one.
      </SplitHeading>
      {/* A sentence to each row, where there's room for them. */}
      <p className="relative m-0 text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug text-white/80">
        Free meetups, workshops and code camps around Cebu. <br className="max-sm:hidden" />
        Everyone is welcome, whatever your level.
      </p>
    </section>
  );
}

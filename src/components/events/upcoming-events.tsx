import Image from "next/image";
import { BlinkingSquares } from "@/components/events/blinking-squares";
import { Reveal, SplitHeading } from "@/components/motion";
import { CEBBY_URL } from "@/data/site";
import { PhotoSlides } from "@/components/photo-slides";

// All group photos. None of them are in the recaps just below, so the page doesn't repeat itself.
const photos = ["first-meetup-group", "big-group", "the-company-group", "office-crowd", "zero-to-hero-group", "office-group", "lobby-group", "zero-to-hero-crowd"];

/** Upcoming dates live on Cebby, so this section points there: a real room beside the way in. */
export function UpcomingEvents() {
  return (
    <section id="upcoming" aria-labelledby="upcoming-title" className="scroll-mt-24 px-2 pb-32 pt-28">
      <SplitHeading id="upcoming-title" className="display m-0 mb-10 px-4 text-[clamp(2.5rem,4.2vw,3.75rem)]">
        Upcoming events
      </SplitHeading>
      <Reveal className="grid gap-2 lg:grid-cols-12">
        <div data-reveal className="tile min-h-[clamp(20rem,62svh,38.75rem)] bg-fog lg:col-span-7">
          <PhotoSlides photos={photos} alt="Everyone at the first React Cebu meetup, gathered in front of the screen" direction="up" sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 85vw, (min-width: 640px) 145vw, 250vw" className="absolute inset-0" />
        </div>
        <div data-reveal className="tile flex flex-col items-start justify-between gap-12 bg-black p-7 text-white sm:p-10 lg:col-span-5">
          <BlinkingSquares />
          <Image src="/images/cebby-icon.png" alt="" width={512} height={512} sizes="104px" className="relative size-[clamp(4rem,7vw,6.5rem)]" />
          <div className="relative flex flex-col items-start gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="title m-0 text-balance text-[clamp(1.75rem,3vw,2.5rem)]">
                Find our next event on{" "}
                <Image src="/images/cebby-logo-white.svg" alt="Cebby" width={214} height={101} className="inline-block h-[1.3em] w-auto align-[-0.32em]" />
              </h3>
              <p className="m-0 max-w-[46ch] text-balance text-lg leading-normal">It lists the rest of Cebu’s tech events too.</p>
            </div>
            <a href={CEBBY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-white min-h-14 whitespace-nowrap px-5 text-base sm:px-7 sm:text-lg">
              See upcoming events on Cebby
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

import Image from "next/image";
import { BlinkingSquares } from "@/components/events/blinking-squares";
import { Reveal, SplitHeading } from "@/components/motion";
import { CEBBY_URL } from "@/data/site";

/** Upcoming dates live on Cebby, so this section points there: a real room beside the way in. */
export function UpcomingEvents() {
  return (
    <section id="upcoming" aria-labelledby="upcoming-title" className="scroll-mt-24 px-2 pb-32 pt-28">
      <SplitHeading id="upcoming-title" className="display m-0 mb-10 px-4 text-[clamp(40px,4.2vw,60px)]">
        Upcoming events
      </SplitHeading>
      <Reveal className="grid gap-2 lg:grid-cols-12">
        <div data-reveal className="tile group min-h-[clamp(320px,62svh,620px)] bg-fog lg:col-span-7">
          <Image
            src="/images/workshop.jpg"
            alt="Developers working together around a table at a workshop"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-[scale] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
          />
        </div>
        <div data-reveal className="tile flex flex-col items-start justify-between gap-12 bg-black p-7 text-white sm:p-10 lg:col-span-5">
          <BlinkingSquares />
          <Image src="/images/cebby-icon.png" alt="" width={512} height={512} sizes="104px" className="relative size-[clamp(64px,7vw,104px)]" />
          <div className="relative flex flex-col items-start gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="title m-0 text-balance text-[clamp(28px,3vw,40px)]">
                Find our next event on{" "}
                {/* eslint-disable-next-line @next/next/no-img-element -- TEMPORARY: straight from Cebby until there's a local copy. */}
                <img src="https://www.getcebby.com/brand/cebby-logo-white.svg" alt="Cebby" width={214} height={101} className="inline-block h-[1.3em] w-auto align-[-0.32em]" />
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

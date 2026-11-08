import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCard, closingButton } from "@/components/closing-card";
import { DoMore } from "@/components/events/do-more";
import { EventsIntro } from "@/components/events/events-intro";
import { FirstEvent } from "@/components/events/first-event";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { Reveal, SplitHeading } from "@/components/motion";
import { recaps } from "@/data/recaps";
import { CEBBY_URL, FACEBOOK_URL } from "@/data/site";
import { pageAddress } from "@/lib/page-address";

export const metadata: Metadata = {
  title: "Events",
  description: "Free React meetups, workshops and code camps around Cebu. Find the next one on Cebby, and see what we’ve run since 2019.",
  ...pageAddress("/events"),
};

const heading = "display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]";

/**
 * The page answers a visitor's questions in order: what's next, what are they like, what happens
 * if I show up, can I do more, and what do I do now. Upcoming dates live on Cebby, not here.
 */
export default function EventsPage() {
  return (
    <>
      <EventsIntro />

      <UpcomingEvents />

      <section id="recaps" aria-labelledby="recaps-title" className="scroll-mt-24 px-2 pb-32 max-md:pb-20">
        <SplitHeading id="recaps-title" className={`${heading} mb-10 px-4`}>Some of the events we’ve run since 2019</SplitHeading>
        <Reveal className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recaps.map((recap) => (
            <div key={recap.title} data-reveal className="tile aspect-[16/10] bg-fog">
              <Image src={recap.image} alt={recap.alt} fill sizes="(min-width: 1024px) 42vw, (min-width: 640px) 60vw, 120vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 text-white">
                <span className="text-base">{recap.when}</span>
                <h3 className="m-0 text-[1.75rem] font-normal leading-[1.1] tracking-[-0.03em]">{recap.title}</h3>
                <p className="m-0 text-base leading-normal">{recap.note}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <FirstEvent />

      <DoMore />

      <ClosingCard id="next-one" title="See you at the next one." description="Find the next event on Cebby, and join the Facebook page to keep up with the community.">
        <a href={CEBBY_URL} target="_blank" rel="noopener noreferrer" className={`${closingButton} btn-primary hover:bg-white hover:text-ink`}>
          See upcoming events on Cebby
        </a>
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`${closingButton} btn-white`}>
          Join the Facebook page
        </a>
      </ClosingCard>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCard, closingButton } from "@/components/closing-card";
import { EventsIntro } from "@/components/events/events-intro";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { Reveal, SplitHeading } from "@/components/motion";
import { TransitionLink } from "@/components/page-transition";
import { recaps } from "@/data/recaps";
import { CEBBY_URL, FACEBOOK_URL, TALK_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Events",
  description: "Free React meetups, workshops and code camps around Cebu. Find the next one on Cebby, and see what we’ve run since 2019.",
};

const expectations = [
  { title: "It’s free", text: "You don’t pay to get in. Partners cover the room and the snacks." },
  { title: "Any level is fine", text: "New to React or shipping it at work, there’s a place for you." },
  { title: "Questions are welcome", text: "Nobody expects you to know it all. Everyone here was new once." },
  { title: "Bring a laptop to workshops", text: "For a talk or a meetup, just bring yourself." },
];

const heading = "display m-0 text-[clamp(40px,4.2vw,60px)]";
const cardTitle = "title m-0 text-[clamp(28px,3vw,40px)]";

/**
 * The page answers a visitor's questions in order: what's next, what are they like, what happens
 * if I show up, can I do more, and what do I do now. Upcoming dates live on Cebby, not here.
 */
export default function EventsPage() {
  return (
    <>
      <EventsIntro />

      <UpcomingEvents />

      <section id="recaps" aria-labelledby="recaps-title" className="scroll-mt-24 px-2 pb-32">
        <div className="mb-10 flex flex-col gap-3 px-4">
          <SplitHeading id="recaps-title" className={heading}>Recaps</SplitHeading>
          <p className="m-0 text-base text-muted">Some of the events we’ve run since 2019.</p>
        </div>
        <Reveal className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {recaps.map((recap) => (
            <div key={recap.title} data-reveal className="flex flex-col gap-3.5">
              <div className="tile aspect-[16/10] bg-fog">
                <Image src={recap.image} alt={recap.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-1 px-2">
                <span className="text-base text-muted">{recap.when}</span>
                <h3 className="m-0 text-[28px] font-normal leading-[1.1] tracking-[-0.03em]">{recap.title}</h3>
                <p className="m-0 text-base leading-normal text-muted">{recap.note}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="expect-title" className="px-2 pb-32">
        <SplitHeading id="expect-title" className={`${heading} mb-10 px-4`}>What to expect at your first event</SplitHeading>
        <ul className="m-0 grid list-none gap-x-6 gap-y-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {expectations.map((item) => (
            <li key={item.title} className="flex flex-col gap-2">
              <h3 className="m-0 text-[28px] font-normal leading-[1.1] tracking-[-0.03em]">{item.title}</h3>
              <p className="m-0 text-base leading-normal text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="involved-title" className="px-2 pb-32">
        <SplitHeading id="involved-title" className={`${heading} mb-10 px-4`}>Want to do more?</SplitHeading>
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="tile flex min-h-[320px] flex-col justify-between gap-6 bg-fog p-8">
            <div className="flex flex-col gap-2">
              <h3 className={cardTitle}>Give a talk</h3>
              <p className="m-0 text-lg leading-normal text-muted">Five minutes, any topic, any level.</p>
            </div>
            <a href={TALK_EMAIL} className="btn btn-black self-start">Email us a talk idea</a>
          </div>
          <div className="tile flex min-h-[320px] flex-col justify-between gap-6 bg-fog p-8">
            <div className="flex flex-col gap-2">
              <h3 className={cardTitle}>Host a meetup</h3>
              <p className="m-0 text-lg leading-normal text-muted">Have a room for 40 people? We’d love to use it.</p>
            </div>
            <TransitionLink href="/partners" className="btn btn-black self-start">Offer a venue</TransitionLink>
          </div>
        </div>
      </section>

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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/motion";
import { EventList } from "@/components/events/event-list";
import { SubscribeForm } from "@/components/subscribe-form";
import { eventShortDate, eventWeekday, pastEvents, upcomingEvents } from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
  description: "Free React meetups, workshops and code camps around Cebu. Everyone is welcome, whatever your level.",
};

export default function EventsPage() {
  const next = upcomingEvents[0];
  const seatsLeft = next.seats - next.taken;

  return (
    <>
      <PageIntro lead="Events." rest="Free meetups, workshops and code camps around Cebu. Everyone is welcome, whatever your level.">
        <a href="#subscribe" className="btn btn-quiet">Get events by email</a>
      </PageIntro>

      <section aria-labelledby="next-title" className="px-2 pb-24">
        <div className="grid gap-2 lg:grid-cols-12">
          <Link href={`/events/${next.slug}`} className="tile reel h-[420px] bg-black lg:col-span-8 lg:h-[600px]" aria-label={`${next.title}: event details`}>
            {[next.image, "/images/laptops.jpg", "/images/coder.jpg"].map((src, i) => (
              <Image key={src} src={src} alt={i === 0 ? next.imageAlt : ""} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" preload={i === 0} />
            ))}
            <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base text-white">Photos from our last workshop. Hover to flip through.</span>
          </Link>
          <div className="tile flex flex-col justify-between gap-7 bg-electric p-7 text-white lg:col-span-4 lg:min-h-[600px]">
            <div className="flex flex-col gap-1.5">
              <span className="text-base text-on-electric">Next up</span>
              <span className="text-[96px] leading-[0.85] tracking-[-0.06em]">{eventShortDate(next.start)}</span>
              <span className="text-lg text-on-electric">{eventWeekday(next.start)}, {next.timeLabel}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <h2 id="next-title" className="title text-[40px]">{next.title}</h2>
              <span className="text-lg text-on-electric">{next.kind} at {next.venue}, {next.area}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-[15px]">
                <span>{next.taken} of {next.seats} seats taken</span>
                <span>{seatsLeft} left</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-electric-deep">
                <div className="h-full rounded-full bg-sky" style={{ width: `${(next.taken / next.seats) * 100}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Link href={`/events/${next.slug}`} className="btn btn-white">RSVP, it’s free</Link>
              <a href={`/events/${next.slug}/calendar`} download className="btn btn-black">Add to calendar</a>
            </div>
          </div>
        </div>
      </section>

      <EventList events={upcomingEvents} />

      <section id="past" aria-labelledby="past-title" className="scroll-mt-24 px-2 pb-28">
        <h2 id="past-title" className="display mb-10 px-4 text-[clamp(40px,4.2vw,60px)]">Past events</h2>
        <Reveal className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <Link key={event.title} href="/recaps" data-reveal className="flex flex-col gap-3.5">
              <div className="tile aspect-[16/10] bg-fog">
                <Image src={event.image} alt={event.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <span className="px-2 text-[21px] leading-[1.3] tracking-[-0.015em]">
                <span className="font-medium">{event.title}</span> <span className="text-muted">{event.note}</span>
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      <section id="subscribe" aria-label="Host or subscribe" className="scroll-mt-24 px-2 pb-2">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="tile flex min-h-[360px] flex-col justify-between gap-6 bg-fog p-8">
            <h2 className="display text-[48px]">
              Have a room for 40 people? <span className="text-muted">Host a meetup.</span>
            </h2>
            <Link href="/partners" className="btn btn-black self-start">Offer a venue</Link>
          </div>
          <div className="tile flex min-h-[360px] flex-col justify-between gap-6 bg-black p-8 text-white">
            <h2 className="display text-[48px]">
              Get new events by email. <span className="text-soft">About one a month.</span>
            </h2>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}

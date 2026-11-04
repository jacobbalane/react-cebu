import type { Metadata } from "next";
import Image from "next/image";
import { TransitionLink } from "@/components/page-transition";
import { PageIntro } from "@/components/page-intro";
import { EventList } from "@/components/events/event-list";
import { RecapGrid } from "@/components/events/recap-grid";
import { SubscribeForm } from "@/components/subscribe-form";
import { eventShortDate, eventWeekday, upcomingEvents } from "@/data/events";
import { recaps } from "@/data/recaps";
import { FACEBOOK_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Events",
  description: "Free React meetups, workshops and code camps around Cebu, plus slides, recordings and photos from every event since 2019.",
};

export default function EventsPage() {
  const next = upcomingEvents[0];
  const seatsLeft = next.seats - next.taken;

  return (
    <>
      <PageIntro title="Events." description="Free meetups, workshops and code camps around Cebu. Everyone is welcome, whatever your level.">
        <a href="#recaps" className="btn btn-quiet">See the recaps</a>
        <a href="#subscribe" className="btn btn-quiet">Get events by email</a>
      </PageIntro>

      <section aria-labelledby="next-title" className="px-2 pb-24">
        <div className="grid gap-2 lg:grid-cols-12">
          <div className="tile reel h-[420px] bg-black lg:col-span-8 lg:h-[600px]">
            {[next.image, "/images/laptops.jpg", "/images/coder.jpg"].map((src, i) => (
              <Image key={src} src={src} alt={i === 0 ? next.imageAlt : ""} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" preload={i === 0} />
            ))}
            <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base text-white">Photos from our last workshop. Hover to flip through.</span>
          </div>
          <div className="tile flex flex-col justify-between gap-7 bg-azure p-7 text-white lg:col-span-4 lg:min-h-[600px]">
            <div className="flex flex-col gap-1.5">
              <span className="text-base text-on-azure">Next up</span>
              <span className="text-[96px] leading-[0.85] tracking-[-0.06em]">{eventShortDate(next.start)}</span>
              <span className="text-lg text-on-azure">{eventWeekday(next.start)}, {next.timeLabel}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <h2 id="next-title" className="title text-[40px]">{next.title}</h2>
              <span className="text-lg text-on-azure">{next.kind} at {next.venue}, {next.area}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-[15px]">
                <span>{next.taken} of {next.seats} seats taken</span>
                <span>{seatsLeft} left</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-azure-deep">
                <div className="h-full rounded-full bg-react" style={{ width: `${(next.taken / next.seats) * 100}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn btn-white">RSVP, it’s free</a>
              <a href={`/events/${next.slug}/calendar`} download className="btn btn-black">Add to calendar</a>
            </div>
          </div>
        </div>
      </section>

      <EventList events={upcomingEvents} />

      <section id="recaps" aria-labelledby="recaps-title" className="scroll-mt-24 px-2 pb-24">
        <h2 id="recaps-title" className="display mb-10 max-w-[1100px] px-4 text-[clamp(40px,4.2vw,60px)]">
          Recaps. <span className="text-muted">Slides, recordings, code and photos from every event since 2019.</span>
        </h2>
        <div className="grid gap-2 lg:grid-cols-12">
          <div className="tile h-[420px] bg-black lg:col-span-8 lg:h-[600px]">
            <Image src="/images/crowd.jpg" alt="A full room at Cebu Hacktoberfest" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          </div>
          <div className="tile flex flex-col justify-between gap-6 bg-black p-7 text-white lg:col-span-4 lg:min-h-[600px]">
            <span className="text-base text-[#bdbdbd]">October 2025</span>
            <div className="flex flex-col gap-3.5">
              <h3 className="display text-[56px] leading-[0.95]">Cebu Hacktoberfest</h3>
              <p className="text-lg leading-normal text-[#bdbdbd]">
                A month of talks, workshops and hack nights co-led by JavaScript Cebu, PizzaPy and Ethereum Philippines. Here’s what got merged, who spoke, and the photos.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <a href="#recap" className="btn btn-white">Read the recap</a>
              <a href="#photos" className="btn border border-[#4d4d4d] text-white hover:bg-white hover:text-black">See the photos</a>
            </div>
          </div>
        </div>
      </section>

      <RecapGrid recaps={recaps} />

      <section id="subscribe" aria-label="Host or subscribe" className="scroll-mt-24 px-2 pb-2">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="tile flex min-h-[360px] flex-col justify-between gap-6 bg-fog p-8">
            <h2 className="display text-[48px]">
              Have a room for 40 people? <span className="text-muted">Host a meetup.</span>
            </h2>
            <TransitionLink href="/partners" className="btn btn-black self-start">Offer a venue</TransitionLink>
          </div>
          <div className="tile flex min-h-[360px] flex-col justify-between gap-6 bg-black p-8 text-white">
            <h2 className="display text-[48px]">
              Get new events and recaps by email. <span className="text-soft">About one a month.</span>
            </h2>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}

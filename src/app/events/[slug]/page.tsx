import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/events/countdown";
import { CopyLink } from "@/components/events/copy-link";
import { Faq } from "@/components/faq";
import { Reveal, SplitHeading } from "@/components/motion";
import { formatEventDate, getEvent, upcomingEvents } from "@/data/events";
import { SITE_URL } from "@/data/site";

export function generateStaticParams() {
  return upcomingEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: "aliqua enim ad minim veniam quis nostrud exercitation",
    openGraph: { images: [{ url: event.image, alt: event.imageAlt }] },
  };
}

const faq = [
  { q: "Ullamco laboris nisi aliquip?", a: "Ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint." },
  { q: "Occaecat cupidatat non proident sunt culpa?", a: "Qui officia deserunt mollit anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt." },
  { q: "Ut labore et dolore?", a: "Magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat." },
  { q: "Duis aute irure in reprehenderit voluptate?", a: "Velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id." },
];

// The URL is read inside a Suspense boundary so navigating between events stays instant:
// the black hero placeholder shows while the page for the new slug streams in.
export default function EventPage({ params }: PageProps<"/events/[slug]">) {
  return (
    <Suspense fallback={<section aria-hidden="true" className="h-[max(640px,88svh)] bg-black" />}>
      <EventContent params={params} />
    </Suspense>
  );
}

async function EventContent({ params }: Pick<PageProps<"/events/[slug]">, "params">) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const seatsLeft = event.seats - event.taken;
  const date = formatEventDate(event.start);
  const shareUrl = `${SITE_URL}/events/${event.slug}`;

  return (
    <>
      <section aria-labelledby="event-title" className="relative h-[max(640px,88svh)] bg-black">
        <Image src={event.image} alt={event.imageAlt} fill preload sizes="100vw" className="object-cover" />
        <div className="absolute bottom-4 left-4 flex w-[min(680px,calc(100%-32px))] flex-col gap-7 rounded-[12px] bg-white p-6 sm:p-9">
          <Link href="/events" className="self-start text-[15px] font-medium text-electric">Est laborum</Link>
          <h1 id="event-title" className="m-0 text-[clamp(30px,3.6vw,52px)] font-normal leading-[1.02] tracking-[-0.04em]">
            {event.title}.{" "}
            <span className="text-soft">
              Lorem ipsum {event.kind.toLowerCase()} dolor {event.venue} sit {date}, {event.timeLabel}.
            </span>
          </h1>
          <div className="flex flex-wrap gap-1.5">
            <a href="#rsvp" className="btn btn-primary">Amet consectetur adipiscing</a>
            <a href={`/events/${event.slug}/calendar`} download className="btn btn-quiet">Elit sed do</a>
          </div>
        </div>
      </section>

      <section aria-label="Quis nostrud" className="px-2 pb-28 pt-2">
        <Reveal className="grid auto-rows-[minmax(220px,auto)] gap-2 lg:grid-cols-12">
          <div data-reveal className="tile flex flex-col justify-between gap-6 bg-electric p-7 text-white lg:col-span-6 lg:row-span-2">
            <span className="text-lg text-on-electric">Eiusmod tempor</span>
            <Countdown start={event.start} />
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-sky p-6 lg:col-span-3">
            <span className="text-[40px] leading-none tracking-[-0.04em]">{seatsLeft} incididunt ut</span>
            <div className="flex flex-col gap-2.5">
              <div className="h-2.5 overflow-hidden rounded-full bg-black/15">
                <div className="h-full rounded-full bg-black" style={{ width: `${(event.taken / event.seats) * 100}%` }} />
              </div>
              <span className="text-[15px]">{event.taken} labore {event.seats} et</span>
            </div>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-fog p-6 lg:col-span-3">
            <span className="text-[15px] text-[#555]">{date}</span>
            <span className="text-[56px] leading-[0.95] tracking-[-0.05em]">{event.timeLabel}</span>
          </div>
          <a href="#directions" data-reveal className="tile min-h-[220px] bg-black text-white lg:col-span-6">
            <Image src="/images/placeholder.png" alt="Dolore magna aliqua enim ad minim veniam quis" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <span className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-2">
              <span className="rounded-lg bg-black px-[18px] py-3.5 text-[28px] leading-[1.1] tracking-[-0.03em]">
                {event.venue}
                <br />
                <span className="text-base tracking-normal text-[#bdbdbd]">{event.area}</span>
              </span>
              <span className="btn btn-white min-h-11">Nostrud exercitation</span>
            </span>
          </a>
        </Reveal>
      </section>

      <section aria-labelledby="about-title" className="grid gap-8 px-6 pb-24 lg:grid-cols-2">
        <SplitHeading id="about-title" className="display text-[clamp(40px,4.2vw,60px)]">Ullamco laboris {event.kind.toLowerCase()}</SplitHeading>
        <p className="max-w-[34ch] text-[clamp(24px,2.2vw,32px)] leading-[1.2] tracking-[-0.025em] text-soft">
          <span className="text-black">{event.summary.split(". ")[0]}.</span> {event.summary.split(". ").slice(1).join(". ")}
        </p>
      </section>

      {event.build && (
        <section aria-label="Consectetur adipiscing" className="px-2 pb-28">
          <Reveal className="grid gap-2 md:grid-cols-3">
            <div data-reveal className="tile flex min-h-[320px] flex-col justify-between gap-5 bg-sky p-7">
              <h3 className="title text-[40px]">Nisi aliquip</h3>
              <p className="text-lg leading-normal">{event.build}</p>
            </div>
            <div data-reveal className="tile flex min-h-[320px] flex-col justify-between gap-5 bg-fog p-7">
              <h3 className="title text-[40px]">Ex</h3>
              <ul className="flex flex-wrap gap-1.5">
                {event.bring?.map((item) => (
                  <li key={item} className="rounded-full bg-white px-4 py-2.5 text-base">{item}</li>
                ))}
              </ul>
            </div>
            <div data-reveal className="tile flex min-h-[320px] flex-col justify-between gap-5 bg-midnight p-7 text-white">
              <h3 className="title text-[40px]">Ea commodo consequat</h3>
              <p className="text-lg leading-normal text-on-midnight">{event.audience}</p>
            </div>
          </Reveal>
        </section>
      )}

      {event.agenda && (
        <section aria-labelledby="agenda-title" className="px-2 pb-28">
          <SplitHeading id="agenda-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Duis</SplitHeading>
          <ol className="border-t border-black">
            {event.agenda.map((item) => (
              <li key={item.time} className="grid items-baseline gap-x-8 gap-y-2 border-b border-line px-4 py-6 lg:grid-cols-[160px_1fr_260px]">
                <span className="text-4xl tracking-[-0.04em] text-electric tabular-nums">{item.time}</span>
                <span className="text-[30px] leading-[1.1] tracking-[-0.03em]">{item.title}</span>
                <span className="text-[17px] text-muted">{item.who}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {event.teachers && (
        <section aria-labelledby="teach-title" className="px-2 pb-28">
          <SplitHeading id="teach-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Aute irure</SplitHeading>
          <Reveal className="grid gap-2 md:grid-cols-3">
            {event.teachers.map((person) => (
              <div key={person.name} data-reveal className="tile group flex flex-col bg-fog">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={person.image} alt={`Portrait of ${person.name}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                </div>
                <div className="flex flex-col gap-1.5 p-[22px]">
                  <span className="text-[32px] tracking-[-0.035em]">{person.name}</span>
                  <span className="text-[17px] text-[#555]">{person.role}</span>
                </div>
              </div>
            ))}
            <div data-reveal className="tile flex flex-col justify-between gap-6 bg-midnight p-7 text-white">
              <span className="text-[40px] leading-[1.02] tracking-[-0.04em]">In reprehenderit voluptate velit esse cillum fugiat nulla</span>
              <span className="text-base text-on-midnight">Pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui.</span>
            </div>
          </Reveal>
        </section>
      )}

      <section aria-labelledby="faq-title" className="grid gap-8 px-6 pb-28 lg:grid-cols-2">
        <h2 id="faq-title" className="display text-[clamp(40px,4.2vw,60px)]">Officia</h2>
        <Faq items={faq} />
      </section>

      <section id="rsvp" aria-label="Dolore magna" className="scroll-mt-24 px-2 pb-2">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="tile flex min-h-[360px] flex-col justify-between gap-6 bg-electric p-8 text-white">
            <h2 className="display text-[clamp(40px,3.6vw,52px)]">
              {seatsLeft} deserunt mollit. <span className="text-[#9db5ff]">Anim id est {date.split(", ")[1] ?? date}?</span>
            </h2>
            <a href="#rsvp" className="btn btn-white self-start">Laborum lorem ipsum</a>
          </div>
          <div className="tile flex min-h-[360px] flex-col justify-between gap-6 bg-fog p-8">
            <h2 className="display text-[clamp(40px,3.6vw,52px)]">
              Dolor sit amet. <span className="text-muted">Consectetur adipiscing elit sed do.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              <CopyLink path={`/events/${event.slug}`} />
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="btn btn-white">
                Eiusmod tempor incididunt
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="btn btn-white">
                Ut labore et
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { PersonPlaceholder } from "@/components/person-placeholder";
import { PhotoIntro } from "@/components/photo-intro";
import { Reveal, SplitHeading } from "@/components/motion";
import { CodeOfConduct } from "@/components/community/code-of-conduct";
import { PhotoFan } from "@/components/community/photo-fan";
import { Principles } from "@/components/community/principles";
import { Timeline } from "@/components/community/timeline";
import { ClosingCard, closingButton } from "@/components/closing-card";
import { organizers } from "@/data/people";
import { FACEBOOK_URL, VOLUNTEER_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Community",
  description: "Students, career-shifters and working engineers in Cebu learning React together since 2019.",
};

const rules = [
  "Be kind, especially to beginners.",
  "Make room for everyone in the conversation.",
  "No harassment, in any form, ever.",
  "Respect people’s ideas and boundaries.",
];

/**
 * The page answers a newcomer's questions in order: who are you, is it for me, will it last,
 * who runs it, what are the rules, and how do I help.
 */
export default function CommunityPage() {
  return (
    <>
      <PhotoIntro
        title={
          <>
            We’re a community,
            <br />
            not an audience.
          </>
        }
        description="Students, career-shifters and working engineers in Cebu, learning React together since 2019."
        src="/images/big-group.jpg"
        alt="Dozens of React Cebu members packed together for a group photo"
      />

      {/* Right after the claim, what backs it up. */}
      <Principles rules={rules} />

      <Timeline />

      <section id="organizers" aria-labelledby="org-title" className="scroll-mt-24 px-2 pb-32">
        <div className="mb-10 flex flex-col items-center gap-3 px-4 text-center">
          <SplitHeading id="org-title" className="display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]">The people leading React Cebu</SplitHeading>
          <p className="m-0 text-base text-muted">Organizers, speakers and mentors</p>
        </div>
        <Reveal className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {organizers.map((person, i) => (
            <div key={i} data-reveal className={`tile group aspect-[4/5] bg-fog ${person.photo ? "text-white" : "text-ink"}`}>
              {person.photo ? (
                <>
                  <Image
                    src={person.photo.src}
                    alt={person.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 63vw, 125vw"
                    style={{ objectPosition: person.photo.position }}
                    className="object-cover transition-[filter,scale] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105 group-hover:grayscale-0 [@media(hover:hover)]:grayscale"
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                </>
              ) : (
                <PersonPlaceholder className="absolute inset-0 size-full transition-[scale] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105" />
              )}
              <div className="absolute inset-x-5 bottom-5 flex flex-col gap-1">
                <span className="text-[1.75rem] leading-[1.1] tracking-[-0.03em]">{person.name}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <PhotoFan />

      <CodeOfConduct rules={rules} />

      <ClosingCard
        id="volunteer"
        title="Help us run the next one."
        description="Every event runs on volunteer time. Set up chairs, run the stream or welcome first-timers."
      >
        <a href={VOLUNTEER_EMAIL} className={`${closingButton} btn-primary hover:bg-white hover:text-ink`}>
          Email us to volunteer
        </a>
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`${closingButton} btn-white`}>
          Join the Facebook page
        </a>
      </ClosingCard>
    </>
  );
}

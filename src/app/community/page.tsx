import type { Metadata } from "next";
import Image from "next/image";
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
  "Ask before you photograph someone.",
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
        src="/images/crowd.jpg"
        alt="A full room of developers at a community event in Cebu"
      />

      {/* Right after the claim, what backs it up. */}
      <Principles rules={rules} />

      <Timeline />

      <section id="organizers" aria-labelledby="org-title" className="scroll-mt-24 px-2 pb-32">
        <div className="mb-10 flex flex-col items-center gap-3 px-4 text-center">
          <SplitHeading id="org-title" className="display m-0 text-[clamp(40px,4.2vw,60px)]">The people who run it</SplitHeading>
          <p className="m-0 text-base text-muted">Volunteers, every one of them</p>
        </div>
        <Reveal className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {organizers.map((person) => (
            <div key={person.name} data-reveal className="tile group aspect-[4/5] bg-fog text-white">
              <Image
                src={person.image}
                alt={`Portrait of ${person.name}`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover grayscale transition-[filter,scale] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105 group-hover:grayscale-0"
              />
              {/* Darkens the bottom so the white text reads over any photo. */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex flex-col gap-1">
                <span className="text-[28px] leading-[1.1] tracking-[-0.03em]">{person.name}</span>
                <span className="text-base">{person.role}</span>
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

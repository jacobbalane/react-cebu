import type { Metadata } from "next";
import Image from "next/image";
import { TransitionLink } from "@/components/page-transition";
import { PageIntro } from "@/components/page-intro";
import { Reveal, SplitHeading } from "@/components/motion";
import { Timeline } from "@/components/community/timeline";
import { organizers } from "@/data/people";

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

export default function CommunityPage() {
  return (
    <>
      <PageIntro
        lead="We’re a community, not an audience."
        rest="Students, career-shifters and working engineers in Cebu, learning React together since 2019."
      />

      <section className="px-2 pb-28">
        <div className="tile h-[420px] bg-black lg:h-[640px]">
          <Image src="/images/crowd.jpg" alt="A full room of developers at a community event in Cebu" fill preload sizes="100vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base text-white">Cebu Hacktoberfest, October 2025</span>
        </div>
      </section>

      <Timeline />

      <section id="organizers" aria-labelledby="org-title" className="scroll-mt-24 px-2 pb-28 lg:pt-28">
        <SplitHeading id="org-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">
          The people who run it. <span className="text-soft">Volunteers, every one of them.</span>
        </SplitHeading>
        <Reveal className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {organizers.map((person) => (
            <div key={person.name} data-reveal className="tile group flex flex-col bg-fog">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={person.image} alt={`Portrait of ${person.name}`} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0" />
              </div>
              <div className="flex flex-col gap-1 p-5">
                <span className="text-[28px] tracking-[-0.03em]">{person.name}</span>
                <span className="text-base text-[#555]">{person.role}</span>
              </div>
            </div>
          ))}
          <a href="#volunteer" data-reveal className="tile flex min-h-[420px] flex-col justify-between bg-azure p-7 text-white">
            <span className="text-[44px] leading-none tracking-[-0.045em]">Help us run the next one</span>
            <span className="btn btn-white self-start">Volunteer</span>
          </a>
        </Reveal>
      </section>

      <section aria-labelledby="values-title" className="px-2 pb-28">
        <SplitHeading id="values-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">How we run things</SplitHeading>
        <Reveal className="grid auto-rows-[minmax(220px,auto)] gap-2 lg:grid-cols-12 lg:auto-rows-[200px]">
          <div data-reveal className="tile flex flex-col justify-between bg-azure p-8 text-white lg:col-span-6 lg:row-span-2">
            <span className="text-[clamp(64px,7vw,112px)] leading-[0.85] tracking-[-0.06em]">Free, always</span>
            <span className="max-w-[34ch] text-xl leading-[1.45] text-on-azure">Every event is free to attend. Partners cover the room, the snacks and the occasional pizza.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-fog p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Every level</span>
            <span className="text-base leading-[1.45] text-[#555]">First component or fiftieth, you belong in the room.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-react p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Anyone can speak</span>
            <span className="text-base leading-[1.45]">Every talk comes from a member. First-timers get a mentor.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-fog p-6 lg:col-span-6">
            <span className="text-5xl tracking-[-0.04em]">Kind by default</span>
            <span className="text-base leading-[1.45] text-[#555]">The same code of conduct applies at every event, in the Facebook group, and anywhere else we meet.</span>
          </div>
        </Reveal>
      </section>

      <section id="code-of-conduct" aria-labelledby="coc-title" className="scroll-mt-16 bg-black px-6 py-28 text-white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SplitHeading id="coc-title" className="display text-[clamp(40px,4.2vw,60px)]">Code of conduct</SplitHeading>
            <p className="max-w-[46ch] text-lg leading-normal text-[#bdbdbd]">
              The short version is below. If something makes you uncomfortable at an event or online, tell any organizer or email react@jscebu.org. We read every report.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <a href="#full-code-of-conduct" className="btn btn-white">Read the full code of conduct</a>
              <a href="mailto:react@jscebu.org" className="btn btn-black border border-[#4d4d4d]">Report a problem</a>
            </div>
          </div>
          <ul className="border-t border-[#4d4d4d]">
            {rules.map((rule) => (
              <li key={rule} className="border-b border-[#333] py-5 text-[32px] tracking-[-0.03em]">{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="family" aria-labelledby="family-title" className="scroll-mt-24 px-2 pb-2 pt-28">
        <div className="grid items-end gap-6 px-4 pb-8 lg:grid-cols-2">
          <SplitHeading id="family-title" className="display text-[clamp(40px,4.2vw,60px)]">The JavaScript Cebu family</SplitHeading>
          <p className="max-w-[52ch] text-lg leading-normal text-[#4d4d4d]">
            JavaScript Cebu grew out of the Laravel Cebu and Vue.js Cebu communities. Today it is home to three groups that share events, speakers and a lot of pizza.
          </p>
        </div>
        <Reveal className="grid gap-2 md:grid-cols-3">
          <div data-reveal className="tile flex min-h-[300px] flex-col justify-between bg-fog p-7">
            <span className="text-5xl tracking-[-0.045em]">Angular Cebu</span>
            <a href="#angular-cebu" className="text-base font-medium text-azure-deep">Visit Angular Cebu</a>
          </div>
          <div data-reveal className="tile flex min-h-[300px] flex-col justify-between bg-azure p-7 text-white">
            <span className="text-5xl tracking-[-0.045em]">React Cebu</span>
            <span className="text-base text-on-azure">You are here</span>
          </div>
          <div data-reveal className="tile flex min-h-[300px] flex-col justify-between bg-fog p-7">
            <span className="text-5xl tracking-[-0.045em]">Vue.js Cebu</span>
            <a href="#vuejs-cebu" className="text-base font-medium text-azure-deep">Visit Vue.js Cebu</a>
          </div>
        </Reveal>
        <p className="px-4 pt-6 text-[15px] text-muted">
          Want to help organize? <TransitionLink href="/partners" className="text-azure">Partners</TransitionLink> and volunteers keep every event free.
        </p>
      </section>
    </>
  );
}

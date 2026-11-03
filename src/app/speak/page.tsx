import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, SplitHeading } from "@/components/motion";
import { TalkSection } from "@/components/speak/talk-form";
import { recentSpeakers } from "@/data/people";

export const metadata: Metadata = {
  title: "Speak",
  description: "Give your first talk at React Cebu. Lightning talks, talks and workshops, with a mentor to help you shape it.",
};

const steps = [
  { title: "Send an idea", text: "Use the form below. A title and two sentences is plenty." },
  { title: "Get a mentor", text: "We pair you with someone who has spoken at React Cebu before." },
  { title: "Do a dry run", text: "A relaxed online run-through the week before, with friendly notes." },
  { title: "Give the talk", text: "We handle the room, the mic and the recording, if you want one." },
];

const ideas = [
  { label: "Your first open-source pull request", tone: "bg-white text-black" },
  { label: "State you don’t actually need", tone: "bg-sky text-black" },
  { label: "React Native in production", tone: "bg-electric text-white" },
  { label: "Accessibility basics", tone: "bg-white text-black" },
  { label: "Testing that doesn’t hurt", tone: "bg-[#1a3170] text-white" },
  { label: "Animations with GSAP", tone: "bg-white text-black" },
  { label: "Shipping my first app", tone: "bg-sky text-black" },
  { label: "From call center to frontend", tone: "bg-[#1a3170] text-white" },
];

export default function SpeakPage() {
  return (
    <>
      <section aria-labelledby="speak-title" className="px-2 pb-28 pt-[72px]">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="tile flex min-h-[560px] flex-col justify-between gap-10 bg-fog p-7 sm:p-10 lg:min-h-[700px]">
            <SplitHeading as="h1" id="speak-title" className="display text-[clamp(44px,4.8vw,72px)] leading-[0.98]">
              Give your first talk at React Cebu. <span className="text-muted">Five minutes or a whole afternoon. We’ll help you shape it.</span>
            </SplitHeading>
            <div className="flex flex-wrap gap-1.5">
              <a href="#submit" className="btn btn-primary">Send a talk idea</a>
              <Link href="/recaps" className="btn btn-white">Watch past talks</Link>
            </div>
          </div>
          <div className="tile reel min-h-[420px] bg-black lg:min-h-[700px]">
            {["speaker", "presenter", "panel"].map((photo, i) => (
              <Image key={photo} src={`/images/${photo}.jpg`} alt={i === 0 ? "A speaker presenting to a room" : ""} fill preload={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ))}
            <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base text-white">Every talk here was given by a member. Hover for a few.</span>
          </div>
        </div>
      </section>

      <TalkSection />

      <section aria-labelledby="how-title" className="px-2 pb-28">
        <SplitHeading id="how-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">How it works</SplitHeading>
        <ol className="border-t border-black">
          {steps.map((step, i) => (
            <li key={step.title} className="grid items-baseline gap-x-8 gap-y-2 border-b border-line px-4 py-7 lg:grid-cols-[120px_1fr_1fr]">
              <span className="text-[56px] leading-[0.9] tracking-[-0.05em] text-electric">{i + 1}</span>
              <span className="text-[32px] leading-[1.05] tracking-[-0.03em]">{step.title}</span>
              <span className="text-lg leading-normal text-[#4d4d4d]">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="ideas-title" className="px-2 pb-28">
        <div className="tile flex flex-col gap-8 bg-midnight p-7 text-white sm:p-10">
          <h2 id="ideas-title" className="display text-[clamp(36px,3.6vw,52px)]">
            Stuck for a topic? <span className="text-[#9db5ff]">Members asked for these.</span>
          </h2>
          <ul className="flex flex-wrap gap-2">
            {ideas.map((idea) => (
              <li key={idea.label} className={`rounded-full px-[22px] py-3.5 text-2xl tracking-[-0.02em] ${idea.tone}`}>{idea.label}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="speakers-title" className="px-2 pb-2">
        <SplitHeading id="speakers-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Recent speakers</SplitHeading>
        <Reveal className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {recentSpeakers.map((person) => (
            <Link key={person.name} href="/recaps" data-reveal className="tile group flex flex-col bg-fog">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={person.image} alt={`Portrait of ${person.name}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0" />
              </div>
              <div className="flex flex-col gap-1.5 p-5">
                <span className="text-[26px] tracking-[-0.03em]">{person.name}</span>
                <span className="text-base leading-snug text-[#555]">{person.talk}</span>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}

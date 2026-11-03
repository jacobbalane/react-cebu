import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, SplitHeading } from "@/components/motion";
import { TalkSection } from "@/components/speak/talk-form";
import { recentSpeakers } from "@/data/people";

export const metadata: Metadata = {
  title: "Amet",
  description: "Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud.",
};

const steps = [
  { title: "Exercitation ullamco laboris", text: "Nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit." },
  { title: "Voluptate velit esse", text: "Cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa." },
  { title: "Qui officia deserunt mollit", text: "Anim id est laborum lorem ipsum dolor sit amet consectetur." },
  { title: "Adipiscing elit sed", text: "Do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim." },
];

const ideas = [
  { label: "Veniam quis nostrud exercitation ullamco", tone: "bg-white text-black" },
  { label: "Laboris nisi aliquip ex ea", tone: "bg-sky text-black" },
  { label: "Commodo consequat duis aute", tone: "bg-electric text-white" },
  { label: "Irure in", tone: "bg-white text-black" },
  { label: "Reprehenderit voluptate velit esse", tone: "bg-[#1a3170] text-white" },
  { label: "Cillum fugiat nulla", tone: "bg-white text-black" },
  { label: "Pariatur excepteur sint occaecat", tone: "bg-sky text-black" },
  { label: "Cupidatat non proident sunt culpa", tone: "bg-[#1a3170] text-white" },
];

export default function SpeakPage() {
  return (
    <>
      <section aria-labelledby="speak-title" className="px-2 pb-28 pt-[72px]">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="tile flex min-h-[560px] flex-col justify-between gap-10 bg-fog p-7 sm:p-10 lg:min-h-[700px]">
            <SplitHeading as="h1" id="speak-title" className="display text-[clamp(44px,4.8vw,72px)] leading-[0.98]">
              Qui officia deserunt mollit anim id est. <span className="text-muted">Laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do.</span>
            </SplitHeading>
            <div className="flex flex-wrap gap-1.5">
              <a href="#submit" className="btn btn-primary">Eiusmod tempor incididunt ut</a>
              <Link href="/recaps" className="btn btn-white">Labore et dolore</Link>
            </div>
          </div>
          <div className="tile reel min-h-[420px] bg-black lg:min-h-[700px]">
            {["speaker", "presenter", "panel"].map((photo, i) => (
              <Image key={photo} src={"/images/placeholder.png"} alt={i === 0 ? "Magna aliqua enim ad minim veniam" : ""} fill preload={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ))}
            <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base text-white">Quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis.</span>
          </div>
        </div>
      </section>

      <TalkSection />

      <section aria-labelledby="how-title" className="px-2 pb-28">
        <SplitHeading id="how-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Aute irure in</SplitHeading>
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
            Reprehenderit voluptate velit esse? <span className="text-[#9db5ff]">Cillum fugiat nulla pariatur.</span>
          </h2>
          <ul className="flex flex-wrap gap-2">
            {ideas.map((idea) => (
              <li key={idea.label} className={`rounded-full px-[22px] py-3.5 text-2xl tracking-[-0.02em] ${idea.tone}`}>{idea.label}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="speakers-title" className="px-2 pb-2">
        <SplitHeading id="speakers-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Excepteur sint</SplitHeading>
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

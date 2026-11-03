import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { Reveal, SplitHeading } from "@/components/motion";
import { Timeline } from "@/components/community/timeline";
import { organizers } from "@/data/people";

export const metadata: Metadata = {
  title: "Lorem",
  description: "Ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.",
};

const rules = [
  "Ut labore et dolore magna.",
  "Aliqua enim ad minim veniam quis nostrud.",
  "Exercitation ullamco laboris nisi aliquip ex.",
  "Ea commodo consequat duis aute.",
];

export default function CommunityPage() {
  return (
    <>
      <PageIntro
        lead="Irure in reprehenderit voluptate velit esse."
        rest="Cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa."
      />

      <section className="px-2 pb-28">
        <div className="tile h-[420px] bg-black lg:h-[640px]">
          <Image src="/images/placeholder.png" alt="Qui officia deserunt mollit anim id est laborum lorem ipsum dolor" fill preload sizes="100vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 rounded-lg bg-black px-3.5 py-2.5 text-base text-white">Sit amet consectetur adipiscing</span>
        </div>
      </section>

      <Timeline />

      <section id="organizers" aria-labelledby="org-title" className="scroll-mt-24 px-2 pb-28 lg:pt-28">
        <SplitHeading id="org-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">
          Elit sed do eiusmod tempor. <span className="text-soft">Incididunt ut labore et dolore.</span>
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
          <a href="#volunteer" data-reveal className="tile flex min-h-[420px] flex-col justify-between bg-electric p-7 text-white">
            <span className="text-[44px] leading-none tracking-[-0.045em]">Magna aliqua enim ad minim veniam</span>
            <span className="btn btn-white self-start">Quis</span>
          </a>
        </Reveal>
      </section>

      <section aria-labelledby="values-title" className="px-2 pb-28">
        <SplitHeading id="values-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Nostrud exercitation ullamco laboris</SplitHeading>
        <Reveal className="grid auto-rows-[minmax(220px,auto)] gap-2 lg:grid-cols-12 lg:auto-rows-[200px]">
          <div data-reveal className="tile flex flex-col justify-between bg-electric p-8 text-white lg:col-span-6 lg:row-span-2">
            <span className="text-[clamp(64px,7vw,112px)] leading-[0.85] tracking-[-0.06em]">Nisi aliquip</span>
            <span className="max-w-[34ch] text-xl leading-[1.45] text-on-electric">Ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-fog p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Excepteur sint</span>
            <span className="text-base leading-[1.45] text-[#555]">Occaecat cupidatat non proident sunt culpa qui officia deserunt.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-sky p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Mollit anim id</span>
            <span className="text-base leading-[1.45]">Est laborum lorem ipsum dolor sit amet consectetur adipiscing elit.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-midnight p-6 text-white lg:col-span-6">
            <span className="text-5xl tracking-[-0.04em]">Sed do eiusmod</span>
            <span className="text-base leading-[1.45] text-on-midnight">Tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi.</span>
          </div>
        </Reveal>
      </section>

      <section id="code-of-conduct" aria-labelledby="coc-title" className="scroll-mt-16 bg-black px-6 py-28 text-white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SplitHeading id="coc-title" className="display text-[clamp(40px,4.2vw,60px)]">Aliquip ex ea</SplitHeading>
            <p className="max-w-[46ch] text-lg leading-normal text-[#bdbdbd]">
              Commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <a href="#full-code-of-conduct" className="btn btn-white">Mollit anim id est laborum lorem</a>
              <a href="mailto:react@jscebu.org" className="btn btn-black border border-[#4d4d4d]">Ipsum dolor sit</a>
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
          <SplitHeading id="family-title" className="display text-[clamp(40px,4.2vw,60px)]">Amet consectetur adipiscing elit</SplitHeading>
          <p className="max-w-[52ch] text-lg leading-normal text-[#4d4d4d]">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute.
          </p>
        </div>
        <Reveal className="grid gap-2 md:grid-cols-3">
          <div data-reveal className="tile flex min-h-[300px] flex-col justify-between bg-fog p-7">
            <span className="text-5xl tracking-[-0.045em]">Irure in</span>
            <a href="#angular-cebu" className="text-base font-medium text-electric">Reprehenderit voluptate velit</a>
          </div>
          <div data-reveal className="tile flex min-h-[300px] flex-col justify-between bg-electric p-7 text-white">
            <span className="text-5xl tracking-[-0.045em]">Esse cillum</span>
            <span className="text-base text-on-electric">Fugiat nulla pariatur</span>
          </div>
          <div data-reveal className="tile flex min-h-[300px] flex-col justify-between bg-fog p-7">
            <span className="text-5xl tracking-[-0.045em]">Excepteur sint</span>
            <a href="#vuejs-cebu" className="text-base font-medium text-electric">Occaecat cupidatat non</a>
          </div>
        </Reveal>
        <p className="px-4 pt-6 text-[15px] text-muted">
          Proident sunt culpa qui? <Link href="/partners" className="text-electric">Officia</Link> deserunt mollit anim id est laborum.
        </p>
      </section>
    </>
  );
}

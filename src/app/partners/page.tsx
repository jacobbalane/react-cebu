import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { Reveal, SplitHeading } from "@/components/motion";
import { PartnerForm } from "@/components/partners/partner-form";

export const metadata: Metadata = {
  title: "Pariatur excepteur sint",
  description: "Occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum lorem ipsum dolor.",
};

const perks = [
  { title: "Sit amet consectetur adipiscing elit sed do", text: "Eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam." },
  { title: "Quis nostrud exercitation ullamco", text: "Laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate." },
  { title: "Velit esse cillum fugiat nulla", text: "Pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia." },
  { title: "Deserunt mollit anim id", text: "Est laborum lorem ipsum dolor sit amet consectetur." },
];

const hosts = [
  { name: "Adipiscing elit", weight: 700 },
  { name: "Sed do", weight: 500 },
  { name: "Eiusmod tempor", weight: 400 },
  { name: "Incididunt", weight: 800 },
  { name: "Ut labore", weight: 300 },
  { name: "Et dolore", weight: 700 },
  { name: "Magna aliqua", weight: 500 },
  { name: "Enim ad minim", weight: 400 },
];

export default function PartnersPage() {
  return (
    <>
      <PageIntro lead="Veniam quis nostrud exercitation ullamco." rest="Laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit.">
        <a href="#contact" className="btn btn-primary">Voluptate velit esse</a>
        <a href="#perks" className="btn btn-quiet">Cillum fugiat nulla</a>
      </PageIntro>

      <section className="grid gap-2 px-2 pb-28 md:grid-cols-[1.3fr_1fr_1fr]">
        {[
          { src: "/images/placeholder.png", alt: "Pariatur excepteur sint occaecat cupidatat" },
          { src: "/images/placeholder.png", alt: "Non proident sunt culpa qui" },
          { src: "/images/placeholder.png", alt: "Officia deserunt mollit anim id est laborum lorem" },
        ].map((photo, i) => (
          <div key={i} className="tile h-[320px] md:h-[480px]">
            <Image src={photo.src} alt={photo.alt} fill preload={i === 0} sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section aria-labelledby="ways-title" className="px-2 pb-28">
        <SplitHeading id="ways-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Ipsum dolor sit</SplitHeading>
        <Reveal className="grid auto-rows-[minmax(220px,auto)] gap-2 lg:auto-rows-[240px] lg:grid-cols-12">
          <a href="#contact" data-reveal className="tile min-h-[360px] bg-black lg:col-span-6 lg:row-span-2">
            <Image src="/images/placeholder.png" alt="Amet consectetur adipiscing elit sed do eiusmod tempor" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <span className="absolute inset-x-4 bottom-4 flex max-w-[520px] flex-col gap-2 rounded-lg bg-white p-[22px] text-black">
              <span className="text-[44px] leading-none tracking-[-0.045em]">Incididunt ut labore</span>
              <span className="text-[17px] leading-[1.45] text-[#4d4d4d]">Et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip.</span>
            </span>
          </a>
          <div data-reveal className="tile flex flex-col justify-between bg-sky p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Ex ea commodo</span>
            <span className="text-base leading-[1.45]">Consequat duis aute irure in reprehenderit voluptate velit.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-electric p-6 text-white lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Esse cillum fugiat</span>
            <span className="text-base leading-[1.45] text-on-electric">Nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-midnight p-6 text-white lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Qui officia deserunt</span>
            <span className="text-base leading-[1.45] text-on-midnight">Mollit anim id est laborum lorem ipsum dolor sit amet.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-fog p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Consectetur adipiscing elit</span>
            <span className="text-base leading-[1.45] text-[#555]">Sed do eiusmod tempor incididunt ut labore et dolore magna.</span>
          </div>
        </Reveal>
      </section>

      <section id="perks" aria-labelledby="perks-title" className="grid scroll-mt-24 gap-10 px-6 pb-28 lg:grid-cols-2">
        <SplitHeading id="perks-title" className="display text-[clamp(40px,4.2vw,60px)]">Aliqua enim ad</SplitHeading>
        <ul className="border-t border-black">
          {perks.map((perk) => (
            <li key={perk.title} className="grid gap-x-6 gap-y-2 border-b border-line py-[22px] md:grid-cols-2">
              <span className="text-[26px] tracking-[-0.025em]">{perk.title}</span>
              <span className="text-[17px] leading-normal text-[#4d4d4d]">{perk.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="hosts-title" className="px-2 pb-28">
        <SplitHeading id="hosts-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Minim veniam quis nostrud</SplitHeading>
        <Reveal className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {hosts.map((host) => (
            <div key={host.name} data-reveal className="tile flex h-[180px] items-center justify-center bg-fog p-5 text-center text-[28px] tracking-[-0.03em]" style={{ fontWeight: host.weight }}>
              {host.name}
            </div>
          ))}
        </Reveal>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 px-2 pb-2">
        <div className="tile grid gap-10 bg-fog p-7 sm:p-12 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h2 id="contact-title" className="display text-[clamp(40px,4.2vw,60px)]">Exercitation ullamco</h2>
            <p className="max-w-[40ch] text-lg leading-normal text-[#4d4d4d]">
              Laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse{" "}
              <a href="mailto:react@jscebu.org" className="text-electric">cillum</a> fugiat.
            </p>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}

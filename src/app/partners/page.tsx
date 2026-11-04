import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { Reveal, SplitHeading } from "@/components/motion";
import { PartnerForm } from "@/components/partners/partner-form";

export const metadata: Metadata = {
  title: "Partner with us",
  description: "Help keep React Cebu free: host a meetup, feed the room, sponsor prizes or lend your engineers.",
};

const perks = [
  { title: "Your logo here and on event slides", text: "On this page and on the opening slide of every event you support." },
  { title: "A minute on stage", text: "Say hello, tell the room what your team builds and whether you’re hiring." },
  { title: "Job posts in the group", text: "Share React roles with developers who already show up to learn." },
  { title: "A recap with photos", text: "Something your team can share after the event." },
];

const hosts = [
  { name: "JavaScript Cebu", weight: 700 },
  { name: "Vue.js Cebu", weight: 500 },
  { name: "Angular Cebu", weight: 400 },
  { name: "PizzaPy", weight: 800 },
  { name: "Ethereum Philippines", weight: 300 },
  { name: "DEVCON Cebu", weight: 700 },
  { name: "PWA Pilipinas", weight: 500 },
  { name: "The Company Cebu", weight: 400 },
];

export default function PartnersPage() {
  return (
    <>
      <PageIntro title="Help keep React Cebu free." description="Every event runs on a borrowed room, donated snacks and volunteer time.">
        <a href="#contact" className="btn btn-primary">Get in touch</a>
        <a href="#perks" className="btn btn-quiet">What partners get</a>
      </PageIntro>

      <section className="grid gap-2 px-2 pb-28 md:grid-cols-[1.3fr_1fr_1fr]">
        {[
          { src: "/images/audience.jpg", alt: "An audience watching a talk" },
          { src: "/images/workshop.jpg", alt: "Developers at a workshop table" },
          { src: "/images/panel.jpg", alt: "A panel discussion with the audience on steps" },
        ].map((photo, i) => (
          <div key={photo.src} className="tile h-[320px] md:h-[480px]">
            <Image src={photo.src} alt={photo.alt} fill preload={i === 0} sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section aria-labelledby="ways-title" className="px-2 pb-28">
        <SplitHeading id="ways-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Ways to help</SplitHeading>
        <Reveal className="grid auto-rows-[minmax(220px,auto)] gap-2 lg:auto-rows-[240px] lg:grid-cols-12">
          <a href="#contact" data-reveal className="tile min-h-[360px] bg-black lg:col-span-6 lg:row-span-2">
            <Image src="/images/laptops.jpg" alt="People learning on laptops in a bright room" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <span className="absolute inset-x-4 bottom-4 flex max-w-[520px] flex-col gap-2 rounded-lg bg-white p-[22px] text-black">
              <span className="text-[44px] leading-none tracking-[-0.045em]">Host a meetup</span>
              <span className="text-[17px] leading-[1.45] text-[#4d4d4d]">A room for 40 to 80 people, a projector and Wi-Fi, one evening a month.</span>
            </span>
          </a>
          <div data-reveal className="tile flex flex-col justify-between bg-react p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Feed the room</span>
            <span className="text-base leading-[1.45]">Snacks and drinks for one meetup or workshop.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-azure p-6 text-white lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Prizes and swag</span>
            <span className="text-base leading-[1.45] text-on-azure">Stickers, shirts and course credits for Hacktoberfest and code camps.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-fog p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Lend your engineers</span>
            <span className="text-base leading-[1.45] text-[#555]">Send a speaker or a mentor for a workshop afternoon.</span>
          </div>
          <div data-reveal className="tile flex flex-col justify-between bg-fog p-6 lg:col-span-3">
            <span className="text-4xl tracking-[-0.035em]">Back a student</span>
            <span className="text-base leading-[1.45] text-[#555]">Cover transport for students coming in from outside the city.</span>
          </div>
        </Reveal>
      </section>

      <section id="perks" aria-labelledby="perks-title" className="grid scroll-mt-24 gap-10 px-6 pb-28 lg:grid-cols-2">
        <SplitHeading id="perks-title" className="display text-[clamp(40px,4.2vw,60px)]">What partners get</SplitHeading>
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
        <SplitHeading id="hosts-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Friends and past hosts</SplitHeading>
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
            <h2 id="contact-title" className="display text-[clamp(40px,4.2vw,60px)]">Let’s talk</h2>
            <p className="max-w-[40ch] text-lg leading-normal text-[#4d4d4d]">
              Tell us a little about your team and how you’d like to help. Or email{" "}
              <a href="mailto:react@jscebu.org" className="text-azure-deep">react@jscebu.org</a> directly.
            </p>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}

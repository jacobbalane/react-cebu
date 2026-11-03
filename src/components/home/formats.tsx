import Image from "next/image";
import Link from "next/link";
import { Highlighter } from "@/components/highlighter";
import { Reveal, SplitHeading } from "@/components/motion";

const formats = [
  { name: "Meetups", desc: "that end in new friendships", href: "/events", photos: ["presenter", "speaker", "audience"], alt: "A speaker presenting at a meetup" },
  { name: "Workshops", desc: "where you build instead of watching", href: "/events", photos: ["workshop", "laptops", "coder"], alt: "Developers working together at a workshop" },
  { name: "Code camps", desc: "that take a whole Saturday, happily", href: "/events", photos: ["students", "react-code", "laptops"], alt: "Students coding together at a code camp" },
  { name: "Hacktoberfest nights", desc: "that ship real open source", href: "/recaps", photos: ["crowd", "panel", "students"], alt: "A full room at Cebu Hacktoberfest" },
  { name: "Lightning talks", desc: "five minutes, any topic, any level", href: "/speak", photos: ["speaker", "presenter", "panel"], alt: "A speaker giving a short talk" },
  { name: "Training", desc: "for students writing their first component", href: "/events", photos: ["laptops", "coder", "workshop"], alt: "People learning React on laptops" },
];

export function Formats() {
  return (
    <section id="learn" aria-labelledby="formats-title" className="px-2 pb-32 pt-28">
      <SplitHeading id="formats-title" className="display mb-10 px-4 text-[clamp(40px,4.2vw,60px)]">
        What happens at React Cebu
      </SplitHeading>
      <Reveal className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => (
          <Link key={format.name} href={format.href} data-reveal className="group flex flex-col gap-3.5">
            <div className="tile reel aspect-[16/10] bg-fog">
              {format.photos.map((photo, i) => (
                <Image
                  key={photo + i}
                  src={`/images/${photo}.jpg`}
                  alt={i === 0 ? format.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ))}
            </div>
            <span className="px-2 text-[21px] leading-[1.3] tracking-[-0.015em]">
              {/* A hand-drawn React-cyan underline draws under the name while the card is hovered or focused. */}
              <span className="font-medium text-ink">
                <Highlighter action="underline" strokeWidth={2}>{format.name}</Highlighter>
              </span>{" "}
              <span className="text-muted">{format.desc}</span>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}

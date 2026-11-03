import Image from "next/image";
import Link from "next/link";
import { Reveal, SplitHeading } from "@/components/motion";

const formats = [
  { name: "Exercitation", desc: "ullamco laboris nisi aliquip ex", href: "/events", photos: ["presenter", "speaker", "audience"], alt: "Ea commodo consequat duis aute irure" },
  { name: "In", desc: "reprehenderit voluptate velit esse cillum fugiat", href: "/events", photos: ["workshop", "laptops", "coder"], alt: "Nulla pariatur excepteur sint occaecat cupidatat" },
  { name: "Non proident", desc: "sunt culpa qui officia deserunt mollit", href: "/events", photos: ["students", "react-code", "laptops"], alt: "Anim id est laborum lorem ipsum dolor" },
  { name: "Sit amet", desc: "consectetur adipiscing elit sed do", href: "/recaps", photos: ["crowd", "panel", "students"], alt: "Eiusmod tempor incididunt ut labore et" },
  { name: "Dolore magna", desc: "aliqua enim ad minim veniam quis", href: "/speak", photos: ["speaker", "presenter", "panel"], alt: "Nostrud exercitation ullamco laboris nisi aliquip" },
  { name: "Ex", desc: "ea commodo consequat duis aute irure", href: "/events", photos: ["laptops", "coder", "workshop"], alt: "In reprehenderit voluptate velit esse" },
];

export function Formats() {
  return (
    <section id="learn" aria-labelledby="formats-title" className="px-2 pb-32 pt-28">
      <SplitHeading id="formats-title" className="display mb-10 px-4 text-[clamp(40px,4.2vw,60px)]">
        Cillum fugiat nulla pariatur excepteur
      </SplitHeading>
      <Reveal className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => (
          <Link key={format.name} href={format.href} data-reveal className="flex flex-col gap-3.5">
            <div className="tile reel aspect-[16/10] bg-fog">
              {format.photos.map((photo, i) => (
                <Image
                  key={photo + i}
                  src={"/images/placeholder.png"}
                  alt={i === 0 ? format.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ))}
            </div>
            <span className="px-2 text-[21px] leading-[1.3] tracking-[-0.015em]">
              <span className="font-medium">{format.name}</span> <span className="text-muted">{format.desc}</span>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}

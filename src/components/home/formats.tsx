import { Reveal, SplitHeading } from "@/components/motion";
import { PhotoSlides } from "@/components/photo-slides";

// Every card swipes through its photos, left or up. Delays ripple the swipes across the grid.
const formats = [
  { name: "Meetups", desc: "that end in new friendships", photos: ["company-slide-group", "small-group", "enspace-talk"], swipe: "left", delay: 0, alt: "Members posing beside a slide at a meetup" },
  { name: "Workshops", desc: "where you build instead of watching", photos: ["gatsby-students", "gatsby-trio", "gatsby-laughing"], swipe: "left", delay: 0.45, alt: "Students on laptops at the Gatsby workshop" },
  { name: "Code camps", desc: "that take a whole Saturday, happily", photos: ["table-trio", "mentor-macbook", "phone-app-demo"], swipe: "left", delay: 0.6, alt: "Three members talking around a table of laptops" },
  { name: "Hacktoberfest", desc: "that ships real open source", photos: ["gatsby-hand-up", "sticker-coder", "glasses-smile", "hacktoberfest-shirt"], swipe: "up", delay: 0.75, alt: "A speaker in a Hacktoberfest shirt with a hand raised" },
  { name: "Lightning talks", desc: "five minutes, any topic, any level", photos: ["denim-talk", "native-speaker", "what-is-react-cebu"], swipe: "up", delay: 0.3, alt: "A speaker giving a short talk" },
  { name: "Training", desc: "for students writing their first component", photos: ["mentor-lean", "desk-room", "terminal-hands"], swipe: "up", delay: 0.9, alt: "A mentor leaning in to point something out on a laptop" },
] as const;

export function Formats() {
  return (
    <section id="learn" aria-labelledby="formats-title" className="px-2 pb-32 pt-28">
      <SplitHeading id="formats-title" className="display mb-10 px-4 text-[clamp(2.5rem,4.2vw,3.75rem)]">
        What happens at React Cebu
      </SplitHeading>
      <Reveal className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => (
          <div key={format.name} data-reveal className="flex flex-col gap-3.5">
            <PhotoSlides
              photos={[...format.photos]}
              alt={format.alt}
              direction={format.swipe}
              delay={format.delay}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <p className="px-2 text-[1.3125rem] leading-[1.3] tracking-[-0.015em]">
              <span className="font-medium text-ink">{format.name}</span>{" "}
              <span className="text-muted">{format.desc}</span>
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

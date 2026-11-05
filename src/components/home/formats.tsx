import { LoopVideo } from "@/components/loop-video";
import { Reveal, SplitHeading } from "@/components/motion";
import { PhotoSlides } from "@/components/photo-slides";

// Cards with a video play it on a loop; the rest swipe through their photos, left or up.
// Delays ripple the swipes in order: Meetups, then Lightning talks, Code camps and Training.
const formats = [
  { name: "Meetups", desc: "that end in new friendships", photos: ["presenter", "speaker", "audience"], swipe: "left", delay: 0, alt: "A speaker presenting at a meetup" },
  { name: "Workshops", desc: "where you build instead of watching", video: "workshop", alt: "Developers working together at a workshop" },
  { name: "Code camps", desc: "that take a whole Saturday, happily", photos: ["students", "react-code", "laptops"], swipe: "left", delay: 0.6, alt: "Students coding together at a code camp" },
  { name: "Hacktoberfest", desc: "that ships real open source", video: "hacktoberfest", alt: "A team gathered around one laptop at Hacktoberfest" },
  { name: "Lightning talks", desc: "five minutes, any topic, any level", photos: ["speaker", "presenter", "panel"], swipe: "up", delay: 0.3, alt: "A speaker giving a short talk" },
  { name: "Training", desc: "for students writing their first component", photos: ["workshop", "coder", "react-code"], swipe: "up", delay: 0.9, alt: "People learning to code side by side at a long table" },
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
            {"video" in format ? (
              <div className="tile aspect-[16/10] bg-fog">
                <LoopVideo src={`/videos/${format.video}.mp4`} label={format.alt} />
              </div>
            ) : (
              <PhotoSlides
                photos={[...format.photos]}
                alt={format.alt}
                direction={format.swipe}
                delay={format.delay}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            )}
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

import { Hero } from "@/components/home/hero";
import { Formats } from "@/components/home/formats";
import { LiveCoding } from "@/components/home/live-coding";
import { Bento } from "@/components/home/bento";
import { Magazine } from "@/components/home/closing";
import { Friends } from "@/components/home/friends";
import { JoinCta } from "@/components/home/join-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Formats />
      <LiveCoding />
      <Bento />
      <Magazine />
      <Friends />
      <JoinCta />
    </>
  );
}

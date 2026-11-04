import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { Formats } from "@/components/home/formats";
import { LiveCoding } from "@/components/home/live-coding";
import { Bento } from "@/components/home/bento";
import { Family } from "@/components/home/family";
import { Friends } from "@/components/home/friends";
import { JoinCta } from "@/components/home/join-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Formats />
      <LiveCoding />
      <Bento />
      <Family />
      <Friends />
      <JoinCta />
    </>
  );
}

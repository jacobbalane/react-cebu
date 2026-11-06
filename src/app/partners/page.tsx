import type { Metadata } from "next";
import { ClosingCard, closingButton } from "@/components/closing-card";
import { Friends } from "@/components/home/friends";
import { SplitHeading } from "@/components/motion";
import { Interlude } from "@/components/partners/interlude";
import { OfferProvider, YourTeam } from "@/components/partners/offer";
import { PartnerForm } from "@/components/partners/partner-form";
import { Perks } from "@/components/partners/perks";
import { Ways } from "@/components/partners/ways";
import { PhotoIntro } from "@/components/photo-intro";
import { FACEBOOK_URL, PARTNER_EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Partner with us",
  description: "Help keep React Cebu free: host a meetup, feed the room, sponsor prizes or lend your engineers.",
};

/**
 * The page answers a partner's questions in order: why you, what could I give, what do I get, who
 * else does this, and how do I start. The visitor's answers build an offer as they go, so the form
 * at the end is mostly filled in by the time they reach it.
 */
export default function PartnersPage() {
  return (
    <OfferProvider>
      <PhotoIntro
        title={
          <>
            Help keep
            <br />
            React Cebu free.
          </>
        }
        description="Every event runs on a borrowed room, donated snacks and volunteer time."
        src="/images/panel.jpg"
        alt="A panel on a carpeted stage, facing a full room on the steps"
        position="50% 74%"
        keepColour
      >
        <a href="#ways" className="btn btn-primary hover:bg-white hover:text-ink">See ways to help</a>
        <a href="#contact" className="btn btn-white">Get in touch</a>
      </PhotoIntro>

      <Ways />

      <Interlude />

      <Perks />

      <Friends title="Friends and past hosts">
        <YourTeam />
      </Friends>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 px-2 pb-32">
        <div className="grid gap-10 rounded-[0.75rem] bg-fog p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div className="flex flex-col gap-6">
            <SplitHeading id="contact-title" className="display m-0 text-[clamp(2.5rem,4.2vw,3.75rem)]">Let’s talk</SplitHeading>
            <p className="m-0 max-w-[40ch] text-lg leading-normal text-muted">
              Tell us a little about your team and how you’d like to help. Or email{" "}
              <a href={PARTNER_EMAIL} className="text-azure-deep">react@jscebu.org</a> directly.
            </p>
          </div>
          <PartnerForm />
        </div>
      </section>

      <ClosingCard id="keep-it-free" title="Keep the next one free." description="Everything you give goes into the room, so the next person through the door pays nothing.">
        <a href={PARTNER_EMAIL} className={`${closingButton} btn-primary hover:bg-white hover:text-ink`}>
          Email us about partnering
        </a>
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`${closingButton} btn-white`}>
          Join the Facebook page
        </a>
      </ClosingCard>
    </OfferProvider>
  );
}

import type { Metadata } from "next";
import { ClosingCard, closingButton } from "@/components/closing-card";
import { Friends } from "@/components/home/friends";
import { Interlude } from "@/components/partners/interlude";
import { OfferProvider, YourTeam } from "@/components/partners/offer";
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
 * else does this, and how do I start. The ways a visitor picks build an offer as they go, and it
 * goes into the email they start from the black card.
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
        src="/images/first-meetup-room.jpg"
        alt="A full hall watching a React Cebu slide at the first meetup"
        position="50% 100%"
        keepColour
      >
        <a href="#ways" className="btn btn-primary hover:bg-white hover:text-ink">See ways to help</a>
        <a href={PARTNER_EMAIL} className="btn btn-white">Email us</a>
      </PhotoIntro>

      <Ways />

      <Interlude />

      <Perks />

      <Friends title="Friends and past hosts">
        <YourTeam />
      </Friends>

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

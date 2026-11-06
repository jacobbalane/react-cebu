import type { Metadata } from "next";
import { ClosingCard, closingButton } from "@/components/closing-card";
import { Gallery } from "@/components/gallery/gallery";
import { TransitionLink } from "@/components/page-transition";
import { PhotoIntro } from "@/components/photo-intro";
import { FACEBOOK_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from React Cebu meetups, workshops and code camps.",
};

export default function GalleryPage() {
  return (
    <>
      <PhotoIntro
        title={
          <>
            Photos from
            <br />
            our events.
          </>
        }
        description="Meetups, workshops and code camps in Cebu, from the first night on."
        src="/images/reactivate-group.jpg"
        alt="Everyone at REACT-IVATE 24 gathered for a group photo at enspace"
        align="right"
      />

      <Gallery />

      <ClosingCard id="next-one" title="You could be in the next one." description="Every event is free, and everyone is welcome.">
        <TransitionLink href="/events#upcoming" className={`${closingButton} btn-primary hover:bg-white hover:text-ink`}>
          See upcoming events
        </TransitionLink>
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`${closingButton} btn-white`}>
          Join the Facebook page
        </a>
      </ClosingCard>
    </>
  );
}

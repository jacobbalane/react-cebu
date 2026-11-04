import { TransitionLink } from "@/components/page-transition";
import { ClosingCard, closingButton } from "@/components/closing-card";
import { FACEBOOK_URL } from "@/data/site";

/** The homepage's closing call to action: come to the next event, or join the Facebook page. */
export function JoinCta() {
  return (
    <ClosingCard
      id="join"
      title="See you at the next meetup."
      description="Every React Cebu event is free and open to every level. Bring a laptop, a question or just yourself."
    >
      <TransitionLink href="/events" className={`${closingButton} btn-primary hover:bg-white hover:text-ink`}>
        View event
      </TransitionLink>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`${closingButton} btn-white`}>
        Join the Facebook page
      </a>
    </ClosingCard>
  );
}

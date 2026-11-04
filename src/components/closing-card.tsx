import { SplitHeading } from "@/components/motion";
import { GlyphStream } from "@/components/glyph-stream";

// Bigger than the site's standard buttons, to hold their own beside the huge closing line.
export const closingButton = "btn min-h-14 px-7 text-lg";

/**
 * How a page signs off: one black card, one huge line, two buttons. The line is short enough to
 * run the card's full width in two lines; below it, the reason sits on the left and the two ways
 * in on the right, so the card reads edge to edge. Behind them, a stream of cyan glyph tiles
 * pours after the cursor and splashes outward on click. On black, a cyan button should turn
 * white under the pointer instead of the usual ink.
 */
export function ClosingCard({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 px-2 pb-2">
      <div className="tile flex min-h-[clamp(460px,72vh,760px)] flex-col justify-between gap-12 bg-black p-7 text-white sm:p-10 lg:p-14">
        <GlyphStream />

        <SplitHeading
          id={`${id}-title`}
          by="word"
          // Sized to the viewport so its two lines run well across the card, capped so it stops
          // growing on wide screens.
          className="relative m-0 text-balance text-[clamp(56px,11vw,210px)] font-normal leading-[0.9] tracking-[-0.05em]"
        >
          {title}
        </SplitHeading>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="m-0 max-w-[34ch] text-lg leading-snug sm:text-xl">{description}</p>
          <div className="flex shrink-0 flex-wrap gap-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

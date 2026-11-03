import { SplitHeading } from "@/components/motion";

/** The two-part page headline: a black statement followed by a grey continuation. */
export function PageIntro({
  lead,
  rest,
  children,
}: {
  lead: string;
  rest: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-6 px-6 pb-12 pt-32 sm:pt-36">
      <SplitHeading as="h1" className="display max-w-[1100px] text-[clamp(40px,4.4vw,64px)]">
        {lead} <span className="text-soft">{rest}</span>
      </SplitHeading>
      {children && <div className="flex flex-wrap gap-1.5">{children}</div>}
    </section>
  );
}

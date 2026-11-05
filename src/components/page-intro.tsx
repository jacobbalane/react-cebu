import { SplitHeading } from "@/components/motion";

/**
 * A page's opening: the title in one colour on the left, with a short muted description and
 * any actions sitting on its baseline to the right. They stack on phones.
 */
export function PageIntro({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 px-6 pb-12 pt-32 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-16">
      <SplitHeading as="h1" className="display m-0 text-balance text-[clamp(2.75rem,5.6vw,6rem)] leading-[0.95]">
        {title}
      </SplitHeading>
      <div className="flex flex-col gap-5 lg:pb-1.5">
        <p className="m-0 max-w-[34ch] text-[clamp(1.125rem,1.5vw,1.375rem)] leading-snug text-muted">{description}</p>
        {children && <div className="flex flex-wrap gap-1.5">{children}</div>}
      </div>
    </section>
  );
}

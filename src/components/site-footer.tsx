import { cacheLife } from "next/cache";
import Image from "next/image";
import { TransitionLink } from "@/components/page-transition";
import { footerColumns } from "@/data/site";

/**
 * This year in Manila, so the copyright rolls over at local midnight on New Year's Day. Reading
 * the clock while a page prerenders fails the build under Cache Components, so it's worked out
 * in a cached scope instead, refreshed hourly.
 */
async function CurrentYear() {
  "use cache";
  cacheLife("hours");
  return new Intl.DateTimeFormat("en-PH", { year: "numeric", timeZone: "Asia/Manila" }).format(new Date());
}

export function SiteFooter() {
  return (
    <footer className="bg-black px-6 pb-7 pt-14 text-white">
      <div className="grid grid-cols-2 gap-8 text-[0.9375rem] md:grid-cols-4">
        {footerColumns.map((column) => (
          // On phones each link gets 10px above and below, so it's about 44px tall to tap, with the gap taken
          // up by that padding instead.
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5 max-md:gap-0">
            <span className="font-medium max-md:pb-1">{column.title}</span>
            {column.links.map((link) => {
              // Other sites open in a new tab so the visitor keeps their place here.
              const external = link.href.startsWith("http");
              return (
                <TransitionLink
                  key={link.label}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="text-[#bdbdbd] hover:text-white max-md:py-2.5"
                >
                  {link.label}
                </TransitionLink>
              );
            })}
          </nav>
        ))}
      </div>
      {/* The logo signs off on the left, as it opens the page in the header; the copyright
          sits across from it. */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-[#262626] pt-5 text-sm text-soft">
        <TransitionLink href="/" aria-label="React Cebu home">
          {/* The black mark, turned white for the black footer, with no disc behind it. Sized in
              CSS too, so the global img height:auto doesn't re-derive a rounded height. */}
          <Image
            src="/images/react-cebu-logo.webp"
            alt=""
            width={36}
            height={40}
            className="block brightness-0 invert"
            style={{ width: "2.25rem", height: "2.5rem" }}
          />
        </TransitionLink>
        <span>
          © <CurrentYear /> React Cebu
        </span>
      </div>
    </footer>
  );
}

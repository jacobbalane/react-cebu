import Image from "next/image";
import { Reveal, SplitHeading } from "@/components/motion";

/**
 * Logos come in every shape, from a tall diamond to a long wordmark, so giving them one height
 * makes the wide ones look far bigger. Instead each gets the same area, that of a 1.3em square,
 * which reads as the same size; a very tall or very wide one is capped so it never towers over
 * its name or stretches out beside it.
 */
function logoSize(width: number, height: number) {
  const aspect = width / height;
  let w = 1.3 * Math.sqrt(aspect);
  let h = 1.3 / Math.sqrt(aspect);
  if (h > 1.5) [w, h] = [w * (1.5 / h), 1.5];
  if (w > 2.2) [w, h] = [2.2, h * (2.2 / w)];
  return { width: `${w.toFixed(3)}em`, height: `${h.toFixed(3)}em` };
}

/** A partner's logo file, its background already taken out so it sits on the page itself. */
function FileLogo({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <Image
      src={`/images/partners/${src}`}
      alt=""
      width={width}
      height={height}
      sizes="120px"
      className="block object-contain"
      style={logoSize(width, height)}
    />
  );
}

/** Angular's shield in its own reds with CEBU in black below, laid out like Vue Cebu's logo:
 * the same box shape, the mark filling about three quarters of the height. */
function AngularCebu() {
  return (
    <svg viewBox="0 0 237 263" className="block" style={logoSize(237, 263)} aria-hidden="true">
      <g transform="translate(-6.4 -30)">
        <path d="M125 30L31.9 63.2L46.1 186.3L125 230Z" fill="#DD0031" />
        <path d="M125 30L218.1 63.2L203.9 186.3L125 230Z" fill="#C3002F" />
        <path d="M125 52.1L66.8 182.6H88.5L100.2 153.4H149.6L161.3 182.6H183L125 52.1ZM142 135.4H108L125 94.5Z" fill="white" fillRule="evenodd" />
      </g>
      <text x="118.5" y="263" textAnchor="middle" fontSize="55" fontWeight="700" fill="#000" style={{ letterSpacing: 0 }}>
        CEBU
      </text>
    </svg>
  );
}

// Communities first, the JavaScript Cebu family leading, then the venue that hosts us. Each
// logo sits beside its partner's name.
const partners: { name: string; logo: React.ReactNode }[] = [
  { name: "JavaScript Cebu", logo: <FileLogo src="javascript-cebu-mark.png" width={757} height={843} /> },
  // Made from the group's white-on-gradient logo: the V in Vue's own green and slate, CEBU in black.
  { name: "Vue.js Cebu", logo: <FileLogo src="vuejs-cebu-color.png" width={917} height={1016} /> },
  { name: "Angular Cebu", logo: <AngularCebu /> },
  { name: "PizzaPy", logo: <FileLogo src="pizzapy-badge.png" width={975} height={1002} /> },
  { name: "Ethereum Philippines", logo: <FileLogo src="ethereum-philippines-mark.png" width={142} height={222} /> },
  { name: "DEVCON Cebu", logo: <FileLogo src="devcon-cebu-stacked.png" width={635} height={564} /> },
  // White on navy in the original, so the artwork takes the navy here to show on white.
  { name: "Web3 Cebu", logo: <FileLogo src="web3-cebu.png" width={561} height={698} /> },
  { name: "PWA Pilipinas", logo: <FileLogo src="pwa-pilipinas-stacked.png" width={1117} height={627} /> },
  { name: "The Company", logo: <FileLogo src="the-company-cebu.png" width={490} height={114} /> },
];

/**
 * The communities we co-host with and the venues that have hosted us, by name in a grid. Anything
 * passed as children sits on its own row after the last name.
 */
export function Friends({ title = "Every meetup is a team effort with these friends", children }: { title?: string; children?: React.ReactNode }) {
  return (
    <section aria-labelledby="friends-title" className="px-2 pb-32 max-md:pb-20">
      <div className="mb-16 flex flex-col items-center gap-3 px-4 text-center">
        <SplitHeading id="friends-title" className="display max-w-[56.25rem] text-[clamp(2.5rem,4.2vw,3.75rem)]">
          {title}
        </SplitHeading>
        <p className="m-0 text-base text-muted">Communities we co-host with and venues that open their doors to us</p>
      </div>

      {/* Each name stays on one line beside its logo. The longest pairs need about 10em, so a
          column only gets that narrow from three across at 1024px, two from 640px; with an odd
          count, the last of two across spans both columns. */}
      <Reveal>
        <ul className="mx-auto grid max-w-[75rem] grid-cols-1 gap-y-10 px-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3">
          {partners.map(({ name, logo }) => (
            <li
              key={name}
              data-reveal
              className="flex items-center justify-center gap-[0.35em] text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.1] tracking-[-0.035em] text-ink sm:last:col-span-2 lg:last:col-span-1"
            >
              <span className="flex shrink-0 items-center">{logo}</span>
              <span className="whitespace-nowrap">{name}</span>
            </li>
          ))}
        </ul>
        {children && <div data-reveal className="mt-10 sm:mt-14">{children}</div>}
      </Reveal>
    </section>
  );
}

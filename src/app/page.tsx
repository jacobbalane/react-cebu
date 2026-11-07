import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { Formats } from "@/components/home/formats";
import { LiveCoding } from "@/components/home/live-coding";
import { Bento } from "@/components/home/bento";
import { Family } from "@/components/home/family";
import { Friends } from "@/components/home/friends";
import { JoinCta } from "@/components/home/join-cta";
import { FACEBOOK_URL, GITHUB_URL, SITE_DESCRIPTION, SITE_URL } from "@/data/site";
import { pageAddress } from "@/lib/page-address";

export const metadata: Metadata = pageAddress("/");

/** Tells search engines and AI tools what React Cebu is, in a form they don't have to guess at. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "React Cebu",
      url: SITE_URL,
      logo: `${SITE_URL}/images/react-cebu-logo.webp`,
      description: SITE_DESCRIPTION,
      email: "react@jscebu.org",
      foundingDate: "2019",
      areaServed: "Cebu, Philippines",
      parentOrganization: { "@type": "Organization", name: "JavaScript Cebu" },
      sameAs: [FACEBOOK_URL, GITHUB_URL],
    },
    {
      "@type": "WebSite",
      name: "React Cebu",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
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

import type { Metadata } from "next";

/** Next replaces a parent's `openGraph` whole, so every page has to carry these along with its own address. */
export const sharedOpenGraph = {
  siteName: "React Cebu",
  type: "website",
  locale: "en_PH",
  images: [{ url: "/images/share-card.jpg", width: 1200, height: 630, alt: "A tilted wall of photos from React Cebu events, with the line: Build the web with React, right here in Cebu." }],
} satisfies Metadata["openGraph"];

/** A page's one true address, for search engines and shared links. */
export function pageAddress(path: string): Metadata {
  return {
    alternates: { canonical: path },
    openGraph: { ...sharedOpenGraph, url: path },
  };
}

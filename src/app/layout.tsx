import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_DESCRIPTION, SITE_URL } from "@/data/site";
import { sharedOpenGraph } from "@/lib/page-address";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "React Cebu — a free React community in Cebu",
    template: "%s — React Cebu",
  },
  description: SITE_DESCRIPTION,
  openGraph: sharedOpenGraph,
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} antialiased`}>
      <body className="min-h-full overflow-x-hidden">
        <SmoothScroll>
          <PageTransition>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}

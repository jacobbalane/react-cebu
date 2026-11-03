import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://react.jscebu.org"),
  title: {
    default: "React Cebu — a free React community in Cebu",
    template: "%s — React Cebu",
  },
  description:
    "Free meetups, workshops and code camps for developers building with React in Cebu, Philippines. Part of JavaScript Cebu since 2019.",
  openGraph: {
    siteName: "React Cebu",
    type: "website",
    locale: "en_PH",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} antialiased`}>
      <body className="min-h-full overflow-x-hidden">
        <SmoothScroll>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}

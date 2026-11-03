import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { RecapGrid } from "@/components/recaps/recap-grid";
import { SubscribeForm } from "@/components/subscribe-form";
import { recaps } from "@/data/recaps";

export const metadata: Metadata = {
  title: "Recaps",
  description: "Slides, recordings, code and photos from every React Cebu event since 2019.",
};

export default function RecapsPage() {
  return (
    <>
      <PageIntro
        lead="Recaps."
        rest="Slides, recordings, code and photos from every event since 2019, so you can catch up on anything you missed."
      />

      <section aria-labelledby="feature-title" className="px-2 pb-24">
        <div className="grid gap-2 lg:grid-cols-12">
          <div className="tile h-[420px] bg-black lg:col-span-8 lg:h-[600px]">
            <Image src="/images/crowd.jpg" alt="A full room at Cebu Hacktoberfest" fill preload sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          </div>
          <div className="tile flex flex-col justify-between gap-6 bg-black p-7 text-white lg:col-span-4 lg:min-h-[600px]">
            <span className="text-base text-[#bdbdbd]">October 2025</span>
            <div className="flex flex-col gap-3.5">
              <h2 id="feature-title" className="display text-[56px] leading-[0.95]">Cebu Hacktoberfest</h2>
              <p className="text-lg leading-normal text-[#bdbdbd]">
                A month of talks, workshops and hack nights co-led by JavaScript Cebu, PizzaPy and Ethereum Philippines. Here’s what got merged, who spoke, and the photos.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <a href="#recap" className="btn btn-white">Read the recap</a>
              <a href="#photos" className="btn border border-[#4d4d4d] text-white hover:bg-white hover:text-black">See the photos</a>
            </div>
          </div>
        </div>
      </section>

      <RecapGrid recaps={recaps} />

      <section aria-labelledby="nl-title" className="px-2 pb-2">
        <div className="tile grid items-end gap-8 bg-electric p-7 text-white sm:p-12 lg:grid-cols-2">
          <h2 id="nl-title" className="display text-[clamp(40px,4.2vw,60px)]">
            Get each recap by email. <span className="text-[#9db5ff]">One email after every event.</span>
          </h2>
          <SubscribeForm buttonClass="btn-white" doneClass="text-white" />
        </div>
      </section>
    </>
  );
}

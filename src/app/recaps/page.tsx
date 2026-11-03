import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { RecapGrid } from "@/components/recaps/recap-grid";
import { SubscribeForm } from "@/components/subscribe-form";
import { recaps } from "@/data/recaps";

export const metadata: Metadata = {
  title: "Nulla",
  description: "Pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt.",
};

export default function RecapsPage() {
  return (
    <>
      <PageIntro
        lead="Mollit."
        rest="Anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore."
      />

      <section aria-labelledby="feature-title" className="px-2 pb-24">
        <div className="grid gap-2 lg:grid-cols-12">
          <div className="tile h-[420px] bg-black lg:col-span-8 lg:h-[600px]">
            <Image src="/images/placeholder.png" alt="Et dolore magna aliqua enim ad" fill preload sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          </div>
          <div className="tile flex flex-col justify-between gap-6 bg-black p-7 text-white lg:col-span-4 lg:min-h-[600px]">
            <span className="text-base text-[#bdbdbd]">Minim veniam</span>
            <div className="flex flex-col gap-3.5">
              <h2 id="feature-title" className="display text-[56px] leading-[0.95]">Quis nostrud</h2>
              <p className="text-lg leading-normal text-[#bdbdbd]">
                Exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <a href="#recap" className="btn btn-white">Non proident sunt</a>
              <a href="#photos" className="btn border border-[#4d4d4d] text-white hover:bg-white hover:text-black">Culpa qui officia</a>
            </div>
          </div>
        </div>
      </section>

      <RecapGrid recaps={recaps} />

      <section aria-labelledby="nl-title" className="px-2 pb-2">
        <div className="tile grid items-end gap-8 bg-electric p-7 text-white sm:p-12 lg:grid-cols-2">
          <h2 id="nl-title" className="display text-[clamp(40px,4.2vw,60px)]">
            Deserunt mollit anim id est. <span className="text-[#9db5ff]">Laborum lorem ipsum dolor sit.</span>
          </h2>
          <SubscribeForm buttonClass="btn-white" doneClass="text-white" />
        </div>
      </section>
    </>
  );
}

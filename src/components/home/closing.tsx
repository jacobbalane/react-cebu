import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";

export function Magazine() {
  return (
    <section aria-labelledby="bigger-title" className="px-2 pb-32">
      <Reveal className="grid gap-2 rounded-[12px] bg-fog p-2 lg:grid-cols-[2.3fr_1fr]">
        <div className="flex flex-col gap-7 px-4 py-7 sm:px-6">
          <h2 id="bigger-title" className="title text-[clamp(28px,2.8vw,40px)]">Elit sed do eiusmod tempor incididunt ut labore</h2>
          <div className="relative h-[340px] sm:h-[420px]">
            <div data-reveal className="absolute left-0 top-[70px] flex h-[240px] w-[48%] -rotate-2 flex-col justify-between bg-electric p-5 text-white sm:h-[300px] sm:w-[38%]">
              <span className="text-[15px]">Et dolore</span>
              <span className="text-[clamp(28px,3vw,44px)] leading-[0.95] tracking-[-0.045em]">Magna aliqua enim</span>
            </div>
            <div data-reveal className="absolute left-[34%] top-0 z-10 flex h-[200px] w-[46%] rotate-[1.5deg] flex-col justify-between bg-black p-5 text-white sm:left-[30%] sm:h-[230px] sm:w-[34%]">
              <span className="text-[15px]">Ad minim</span>
              <span className="text-[clamp(26px,2.8vw,44px)] leading-[0.9] tracking-[-0.05em]">Veniam quis</span>
            </div>
            <div data-reveal className="absolute right-0 top-[170px] z-20 h-[170px] w-[52%] -rotate-1 overflow-hidden sm:top-[150px] sm:h-[260px] sm:w-[40%]">
              <Image src="/images/placeholder.png" alt="Nostrud exercitation ullamco laboris nisi aliquip ex" fill sizes="40vw" className="object-cover" />
              <span className="absolute bottom-3 left-3 bg-sky px-3 py-2 text-lg tracking-[-0.02em] text-black sm:text-[22px]">Ea commodo consequat duis</span>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-[560px] text-lg leading-normal text-[#333]">
              <span className="font-medium text-black">Aute irure in reprehenderit voluptate velit esse cillum fugiat.</span> Nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt.
            </p>
            <Link href="/recaps" className="btn btn-white">Mollit anim id</Link>
          </div>
        </div>
        <div data-reveal className="flex flex-col justify-between gap-6 rounded-[10px] bg-black p-6 text-white">
          <span className="text-lg leading-snug">Est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut.</span>
          <div className="flex flex-col gap-2">
            <span className="-rotate-2 bg-sky p-[18px] text-[40px] leading-[0.95] tracking-[-0.045em] text-black">Labore et</span>
            <span className="rotate-[1.5deg] bg-white p-[18px] text-[28px] leading-none tracking-[-0.03em] text-black">Dolore magna aliqua enim ad minim</span>
          </div>
          <Link href="/community#family" className="btn btn-white self-start">Veniam quis nostrud</Link>
        </div>
      </Reveal>
    </section>
  );
}


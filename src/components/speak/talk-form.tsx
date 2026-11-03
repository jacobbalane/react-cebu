"use client";

import { useState } from "react";

const formats = [
  { id: "lightning", length: "5 min", name: "Dolor sit", text: "Amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore." },
  { id: "talk", length: "20 min", name: "Magna", text: "Aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip." },
  { id: "workshop", length: "2 h", name: "Ex", text: "Ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla." },
];

const field = "flex flex-col gap-2 text-[15px] font-medium";
const input = "min-h-[52px] rounded-[10px] border border-[#bdbdbd] bg-white px-[18px] py-3 text-[17px] font-normal";

// Front-end only for now: connect the form to email or a form service before launch.
export function TalkSection() {
  const [format, setFormat] = useState("talk");
  const [sent, setSent] = useState(false);

  return (
    <>
      <section aria-labelledby="formats-title" className="px-2 pb-28">
        <h2 id="formats-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Pariatur excepteur sint</h2>
        <div role="radiogroup" aria-label="Minim veniam" className="grid gap-2 md:grid-cols-3">
          {formats.map((f) => {
            const active = f.id === format;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFormat(f.id)}
                className={`tile flex min-h-[400px] cursor-pointer flex-col justify-between gap-5 p-7 text-left transition-colors ${active ? "bg-electric text-white" : "bg-fog text-black hover:bg-[#e0e0e0]"}`}
              >
                <span className="text-[clamp(64px,6.4vw,104px)] leading-[0.85] tracking-[-0.06em]">{f.length}</span>
                <span className="flex flex-col gap-2.5">
                  <span className="text-4xl tracking-[-0.035em]">{f.name}</span>
                  <span className="text-lg leading-[1.45] opacity-85">{f.text}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="submit" aria-labelledby="submit-title" className="grid scroll-mt-24 gap-10 px-6 pb-28 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <h2 id="submit-title" className="display text-[clamp(40px,4.2vw,60px)]">Occaecat cupidatat non proident</h2>
          <p className="max-w-[42ch] text-lg leading-normal text-[#4d4d4d]">
            Sunt culpa qui officia deserunt mollit anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </div>
        {sent ? (
          <div role="status" className="tile flex flex-col gap-4 bg-sky p-8">
            <span className="text-[40px] leading-none tracking-[-0.04em]">Sed do eiusmod.</span>
            <span className="text-lg leading-normal">Tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris.</span>
            <button type="button" onClick={() => setSent(false)} className="btn btn-white self-start">Nisi aliquip ex</button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-[18px]"
          >
            <div className="grid gap-[18px] sm:grid-cols-2">
              <label className={field}>Ea commodo<input className={input} type="text" name="name" required autoComplete="name" /></label>
              <label className={field}>Consequat<input className={input} type="email" name="email" required autoComplete="email" /></label>
            </div>
            <label className={field}>
              Duis aute
              <input className={input} type="text" name="title" required placeholder="Irure in reprehenderit voluptate velit esse cillum fugiat nulla" />
            </label>
            <label className={field}>
              Pariatur
              <select className={input} name="format" value={format} onChange={(e) => setFormat(e.target.value)}>
                {formats.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}, {f.length.replace("min", "minutes").replace("h", "hours")}</option>
                ))}
              </select>
            </label>
            <label className={field}>
              Excepteur sint occaecat?
              <textarea className={`${input} min-h-[140px] resize-y`} name="about" placeholder="Cupidatat non proident sunt culpa qui." />
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-[17px]">
              <input type="checkbox" name="mentor" className="size-[22px] accent-electric" />
              Officia deserunt mollit anim id est laborum lorem ipsum
            </label>
            <button type="submit" className="btn btn-primary self-start">Dolor sit amet</button>
          </form>
        )}
      </section>
    </>
  );
}

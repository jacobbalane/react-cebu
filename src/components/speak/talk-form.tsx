"use client";

import { useState } from "react";

const formats = [
  { id: "lightning", length: "5 min", name: "Lightning talk", text: "One idea, one demo, done. The easiest way to give your first talk." },
  { id: "talk", length: "20 min", name: "Talk", text: "A proper story: the problem, what you tried, what worked. Slides optional." },
  { id: "workshop", length: "2 h", name: "Workshop", text: "Teach a room to build something. We help with the starter repo and mentors." },
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
        <h2 id="formats-title" className="display mb-8 px-4 text-[clamp(40px,4.2vw,60px)]">Pick a format</h2>
        <div role="radiogroup" aria-label="Talk format" className="grid gap-2 md:grid-cols-3">
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
          <h2 id="submit-title" className="display text-[clamp(40px,4.2vw,60px)]">Send a talk idea</h2>
          <p className="max-w-[42ch] text-lg leading-normal text-[#4d4d4d]">
            A title and a couple of sentences is enough. An organizer replies by email, usually within a week.
          </p>
        </div>
        {sent ? (
          <div role="status" className="tile flex flex-col gap-4 bg-sky p-8">
            <span className="text-[40px] leading-none tracking-[-0.04em]">Talk idea sent.</span>
            <span className="text-lg leading-normal">We’ll reply by email within a week. In the meantime, come to a meetup and say hi.</span>
            <button type="button" onClick={() => setSent(false)} className="btn btn-white self-start">Send another idea</button>
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
              <label className={field}>Your name<input className={input} type="text" name="name" required autoComplete="name" /></label>
              <label className={field}>Email<input className={input} type="email" name="email" required autoComplete="email" /></label>
            </div>
            <label className={field}>
              Talk title
              <input className={input} type="text" name="title" required placeholder="What I learned moving our app to Server Components" />
            </label>
            <label className={field}>
              Format
              <select className={input} name="format" value={format} onChange={(e) => setFormat(e.target.value)}>
                {formats.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}, {f.length.replace("min", "minutes").replace("h", "hours")}</option>
                ))}
              </select>
            </label>
            <label className={field}>
              What’s it about?
              <textarea className={`${input} min-h-[140px] resize-y`} name="about" placeholder="Two or three sentences is plenty." />
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-[17px]">
              <input type="checkbox" name="mentor" className="size-[22px] accent-electric" />
              Pair me with a mentor who has spoken before
            </label>
            <button type="submit" className="btn btn-primary self-start">Send talk idea</button>
          </form>
        )}
      </section>
    </>
  );
}

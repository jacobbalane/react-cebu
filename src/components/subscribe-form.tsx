"use client";

import { useId, useState } from "react";

// Front-end only for now: wire this to the mailing list provider before launch.
export function SubscribeForm({ buttonClass = "btn-primary", doneClass = "text-sky" }: { buttonClass?: string; doneClass?: string }) {
  const id = useId();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className={`text-xl ${doneClass}`}>
        Subscribed. Check your inbox to confirm.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
      className="flex flex-wrap gap-1.5"
    >
      <label htmlFor={id} className="sr-only">Email address</label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="min-h-12 flex-[1_1_240px] rounded-full bg-white px-5 text-base text-black placeholder:text-muted"
      />
      <button type="submit" className={`btn ${buttonClass}`}>Subscribe</button>
    </form>
  );
}

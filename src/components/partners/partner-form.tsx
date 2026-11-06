"use client";

import { useState } from "react";
import { useOffer, ways } from "@/components/partners/offer";

const field = "flex flex-col gap-2 text-[0.9375rem] font-medium";
const input = "min-h-[3.25rem] rounded-[0.625rem] bg-white px-[1.125rem] py-3 text-[1.0625rem] font-normal focus-visible:outline-ink";
const choice = "btn min-h-11 cursor-pointer bg-white px-4 text-[0.9375rem] text-ink hover:bg-ink hover:text-white has-checked:bg-ink has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink";

/**
 * What the visitor has already told the page is filled in here, and stays linked to it: the team's
 * name, and the ways they picked. Off the page for now, as it sends nothing: connect it to email or a
 * form service before it goes back.
 */
export function PartnerForm() {
  const { team, setTeam, picked, toggle } = useOffer();
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status" className="tile flex flex-col gap-3.5 self-start bg-azure p-7 text-white">
        <span className="title text-[clamp(1.75rem,3vw,2.5rem)]">Message sent.</span>
        <span className="text-lg leading-normal">An organizer will reply by email. Thank you for keeping it free.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-[1.125rem]"
    >
      <div className="grid gap-[1.125rem] sm:grid-cols-2">
        <label className={field}>
          Company or organization
          <input className={input} type="text" name="org" required maxLength={40} autoComplete="organization" value={team} onChange={(event) => setTeam(event.target.value)} />
        </label>
        <label className={field}>
          Work email
          <input className={input} type="email" name="email" required autoComplete="email" />
        </label>
      </div>
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-[0.9375rem] font-medium">How would you like to help?</legend>
        <div className="flex flex-wrap gap-1.5">
          {ways.map((way) => (
            <label key={way.id} className={choice}>
              <input type="checkbox" name="help" value={way.title} checked={picked.some((other) => other.id === way.id)} onChange={() => toggle(way.id)} className="sr-only" />
              {way.title}
            </label>
          ))}
          <label className={choice}>
            <input type="checkbox" name="help" value="Something else" className="sr-only" />
            Something else
          </label>
        </div>
      </fieldset>
      <label className={field}>
        Anything else we should know?
        <textarea className={`${input} min-h-[8.125rem] resize-y`} name="message" />
      </label>
      <button type="submit" className="btn btn-black self-start">Send message</button>
    </form>
  );
}

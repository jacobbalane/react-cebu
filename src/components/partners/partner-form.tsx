"use client";

import { useState } from "react";

const field = "flex flex-col gap-2 text-[15px] font-medium";
const input = "min-h-[52px] rounded-[10px] border border-[#bdbdbd] bg-white px-[18px] py-3 text-[17px] font-normal";

// Front-end only for now: connect the form to email or a form service before launch.
export function PartnerForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status" className="tile flex flex-col gap-3.5 bg-electric p-7 text-white">
        <span className="text-4xl tracking-[-0.035em]">Message sent.</span>
        <span className="text-lg leading-normal text-on-electric">An organizer will reply by email. Thank you for keeping it free.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-[18px]"
    >
      <div className="grid gap-[18px] sm:grid-cols-2">
        <label className={field}>Company or organization<input className={input} type="text" name="org" required autoComplete="organization" /></label>
        <label className={field}>Work email<input className={input} type="email" name="email" required autoComplete="email" /></label>
      </div>
      <label className={field}>
        How would you like to help?
        <select className={input} name="help" defaultValue="Host a meetup">
          {["Host a meetup", "Feed the room", "Prizes and swag", "Lend speakers or mentors", "Back a student", "Something else"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className={field}>
        Anything else we should know?
        <textarea className={`${input} min-h-[130px] resize-y`} name="message" />
      </label>
      <button type="submit" className="btn btn-primary self-start">Send message</button>
    </form>
  );
}

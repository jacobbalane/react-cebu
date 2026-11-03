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
        <span className="text-4xl tracking-[-0.035em]">Est laborum.</span>
        <span className="text-lg leading-normal text-on-electric">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.</span>
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
        <label className={field}>Incididunt ut labore<input className={input} type="text" name="org" required autoComplete="organization" /></label>
        <label className={field}>Et dolore<input className={input} type="email" name="email" required autoComplete="email" /></label>
      </div>
      <label className={field}>
        Magna aliqua enim ad minim veniam?
        <select className={input} name="help">
          {["Quis nostrud exercitation", "Ullamco laboris nisi", "Aliquip ex ea", "Commodo consequat duis aute", "Irure in reprehenderit", "Voluptate velit"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className={field}>
        Esse cillum fugiat nulla pariatur?
        <textarea className={`${input} min-h-[130px] resize-y`} name="message" />
      </label>
      <button type="submit" className="btn btn-primary self-start">Excepteur sint</button>
    </form>
  );
}

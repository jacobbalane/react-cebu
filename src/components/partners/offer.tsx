"use client";

import { createContext, useContext, useMemo, useState } from "react";

/** What a partner can give. `brings` finishes "You’ll bring…". */
export const ways = [
  { id: "room", title: "Host a meetup", text: "A room for 40 to 80 people, a projector and Wi-Fi, one evening a month.", brings: "the room" },
  { id: "snacks", title: "Feed the room", text: "Snacks and drinks for one meetup or workshop.", brings: "the snacks" },
  { id: "prizes", title: "Prizes and swag", text: "Stickers, shirts and course credits for Hacktoberfest and code camps.", brings: "the prizes" },
  { id: "engineers", title: "Lend your engineers", text: "Send a speaker or a mentor for a workshop afternoon.", brings: "a speaker or mentor" },
  { id: "student", title: "Back a student", text: "Cover transport for students coming in from outside the city.", brings: "a student’s ride" },
] as const;

export type Way = (typeof ways)[number];
export type WayId = Way["id"];

type Offer = {
  team: string;
  setTeam: (team: string) => void;
  picked: Way[];
  toggle: (id: WayId) => void;
};

const OfferContext = createContext<Offer | null>(null);

/**
 * The offer a visitor builds as they read: the ways they pick and their team's name. Both carry down
 * the page to the form, so by the end there's little left to type.
 */
export function OfferProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState("");
  const [chosen, setChosen] = useState<WayId[]>([]);

  const offer = useMemo<Offer>(
    () => ({
      team,
      setTeam,
      picked: ways.filter((way) => chosen.includes(way.id)),
      toggle: (id) => setChosen((now) => (now.includes(id) ? now.filter((other) => other !== id) : [...now, id])),
    }),
    [team, chosen],
  );

  return <OfferContext value={offer}>{children}</OfferContext>;
}

export function useOffer() {
  const offer = useContext(OfferContext);
  if (!offer) throw new Error("useOffer needs an OfferProvider above it");
  return offer;
}

/** What to call the visitor's team until they've typed a name. */
export const teamName = (team: string) => team.trim() || "Your team";

const hashOf = (text: string) => {
  let hash = 2166136261;
  for (const letter of text) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
  return hash >>> 0;
};

/** Which corners of the mark's four squares are round: top left, top right, bottom right, bottom left. */
function markCorners(team: string) {
  const seed = hashOf(teamName(team).toLowerCase());
  return [0, 1, 2, 3].map((cell) => [1, 2, 4, 8].map((bit) => Boolean((seed >>> (cell * 7)) & bit)));
}

/**
 * A logo drawn from the visitor's name, standing in for the one they'd send us. It's four squares
 * whose corners round off or stay sharp depending on the name, so each team gets its own mark, and
 * the corners ease from one mark to the next as they type.
 */
export function TeamMark({ team, className }: { team: string; className: string }) {
  return (
    <span aria-hidden="true" className={`grid shrink-0 grid-cols-2 gap-[6%] ${className}`}>
      {markCorners(team).map((corners, cell) => (
        <span key={cell} className="bg-current transition-[border-radius] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ borderRadius: corners.map((round) => (round ? "100%" : "0%")).join(" ") }} />
      ))}
    </span>
  );
}

/** Takes the empty place at the end of the list of friends, under the visitor's own name. */
export function YourTeam() {
  const { team } = useOffer();
  return (
    <p className="m-0 flex items-center justify-center gap-[0.35em] text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.1] tracking-[-0.035em] text-ink">
      <TeamMark team={team} className="size-[1.2em] text-azure" />
      <span>{teamName(team)}</span>
    </p>
  );
}

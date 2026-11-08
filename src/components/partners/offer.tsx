"use client";

import { createContext, useContext, useMemo, useState } from "react";

/** What a partner can give. `brings` finishes "You’ll bring…". */
export const ways = [
  { id: "room", title: "Host a meetup", text: "A room for 40 to 80 people, a projector and Wi-Fi for one evening.", brings: "the room" },
  { id: "snacks", title: "Feed the room", text: "Snacks and drinks for one meetup or workshop.", brings: "the snacks" },
  { id: "prizes", title: "Prizes and swag", text: "Stickers, shirts and course credits for Hacktoberfest and code camps.", brings: "the prizes" },
  { id: "engineers", title: "Lend your engineers", text: "Send a speaker or a mentor for a workshop afternoon.", brings: "a speaker or mentor" },
  { id: "student", title: "Save a seat", text: "Hold a seat for a student at the next meetup or workshop.", brings: "a student’s seat" },
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
 * The offer a visitor builds as they read: the ways they pick and their team's name, typed into the
 * box under "Your team" at the end of the friends list.
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

/**
 * Takes the empty place at the end of the list of friends, under the visitor's own name, with a box to
 * type it in. The mark reshapes as they type, and the offer's sentence uses the name too. On phones it
 * sits like the names above it, its mark over its name.
 */
export function YourTeam() {
  const { team, setTeam } = useOffer();
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="m-0 flex items-center justify-center gap-[0.35em] text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.1] tracking-[-0.035em] text-ink max-sm:flex-col max-sm:gap-2.5 max-sm:text-center max-sm:text-[1.1875rem]">
        <TeamMark team={team} className="size-[1.2em] text-azure max-sm:size-[1.875rem]" />
        <span className="max-w-full break-words">{teamName(team)}</span>
      </p>
      <label className="w-full max-w-[18rem]">
        <span className="sr-only">Your team’s name</span>
        {/* Focus shows as its own azure edge, in place of the site's cyan ring, so there's one outline, not two. The
            ring is set outside Tailwind's layers, so only an inline style takes it off. */}
        <input
          type="text"
          value={team}
          onChange={(event) => setTeam(event.target.value)}
          maxLength={40}
          autoComplete="organization"
          style={{ outline: "none" }}
          placeholder="Type your team’s name"
          className="h-12 w-full rounded-full bg-fog px-5 text-center text-base text-ink transition-colors duration-200 placeholder:text-muted hover:bg-[#e2e2e2] focus:bg-white focus:shadow-[inset_0_0_0_1.5px_var(--color-azure)]"
        />
      </label>
    </div>
  );
}

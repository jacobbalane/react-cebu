export type EventKind = "Meetup" | "Workshop" | "Code camp" | "Online";

export type AgendaItem = { time: string; title: string; who: string };
export type Person = { name: string; role: string; image: string };

export type CommunityEvent = {
  slug: string;
  title: string;
  kind: EventKind;
  /** ISO start time in Philippine time */
  start: string;
  /** ISO end time in Philippine time */
  end: string;
  timeLabel: string;
  venue: string;
  area: string;
  image: string;
  imageAlt: string;
  seats: number;
  taken: number;
  summary: string;
  build?: string;
  bring?: string[];
  audience?: string;
  agenda?: AgendaItem[];
  teachers?: Person[];
};

// Sample content. Replace with real events before launch.
export const upcomingEvents: CommunityEvent[] = [
  {
    slug: "react-server-components-hands-on",
    title: "Magna aliqua enim ad",
    kind: "Workshop",
    start: "2026-12-12T13:00:00+08:00",
    end: "2026-12-12T17:00:00+08:00",
    timeLabel: "minim veniam quis nostrud",
    venue: "Exercitation ullamco laboris",
    area: "Nisi aliquip ex",
    image: "/images/placeholder.png",
    imageAlt: "Ea commodo consequat duis aute irure in reprehenderit voluptate velit esse",
    seats: 40,
    taken: 22,
    summary:
      "Cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad.",
    build:
      "Minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat.",
    bring: ["Nulla pariatur excepteur sint", "Occaecat cupidatat non proident", "Sunt culpa qui"],
    audience:
      "Officia deserunt mollit anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut.",
    agenda: [
      { time: "1:00", title: "Labore et dolore magna aliqua enim", who: "Ad" },
      { time: "1:20", title: "Minim veniam quis nostrud exercitation ullamco", who: "Laboris nisi" },
      { time: "2:00", title: "Aliquip ex ea commodo consequat duis aute irure", who: "In reprehenderit voluptate velit" },
      { time: "3:15", title: "Esse", who: "Cillum fugiat nulla pariatur excepteur" },
      { time: "3:30", title: "Sint occaecat cupidatat non proident sunt", who: "Culpa qui" },
      { time: "4:30", title: "Officia deserunt mollit anim id est laborum lorem", who: "Ipsum" },
    ],
    teachers: [
      { name: "Dolor sit", role: "Amet consectetur adipiscing elit sed do.", image: "/images/placeholder.png" },
      { name: "Eiusmod tempor", role: "Incididunt ut labore et dolore magna aliqua enim.", image: "/images/placeholder.png" },
    ],
  },
  {
    slug: "year-end-meetup",
    title: "Ad minim veniam quis nostrud",
    kind: "Meetup",
    start: "2026-12-19T18:00:00+08:00",
    end: "2026-12-19T21:00:00+08:00",
    timeLabel: "exercitation ullamco laboris nisi",
    venue: "Aliquip ex ea",
    area: "Commodo consequat",
    image: "/images/placeholder.png",
    imageAlt: "Duis aute irure in reprehenderit voluptate velit esse cillum",
    seats: 80,
    taken: 31,
    summary: "Fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id.",
  },
  {
    slug: "whats-new-in-react",
    title: "Est laborum lorem ipsum dolor sit",
    kind: "Meetup",
    start: "2027-01-23T18:00:00+08:00",
    end: "2027-01-23T21:00:00+08:00",
    timeLabel: "amet consectetur adipiscing elit",
    venue: "Sed do eiusmod",
    area: "Tempor incididunt",
    image: "/images/placeholder.png",
    imageAlt: "Ut labore et dolore magna aliqua enim ad minim",
    seats: 80,
    taken: 12,
    summary: "Veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in.",
  },
  {
    slug: "typescript-for-react-developers",
    title: "Reprehenderit voluptate velit esse",
    kind: "Workshop",
    start: "2027-01-31T13:00:00+08:00",
    end: "2027-01-31T17:00:00+08:00",
    timeLabel: "cillum fugiat nulla pariatur",
    venue: "Excepteur sint occaecat",
    area: "Cupidatat non proident",
    image: "/images/placeholder.png",
    imageAlt: "Sunt culpa qui officia deserunt",
    seats: 40,
    taken: 9,
    summary: "Mollit anim id est laborum lorem ipsum dolor sit amet consectetur.",
  },
  {
    slug: "react-native-code-camp",
    title: "Adipiscing elit sed do",
    kind: "Code camp",
    start: "2027-02-20T09:00:00+08:00",
    end: "2027-02-20T18:00:00+08:00",
    timeLabel: "eiusmod tempor incididunt ut labore",
    venue: "Et dolore",
    area: "Magna aliqua enim",
    image: "/images/placeholder.png",
    imageAlt: "Ad minim veniam quis nostrud",
    seats: 60,
    taken: 18,
    summary: "Exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate.",
  },
  {
    slug: "testing-react-apps",
    title: "Velit esse cillum fugiat nulla pariatur",
    kind: "Workshop",
    start: "2027-03-14T13:00:00+08:00",
    end: "2027-03-14T17:00:00+08:00",
    timeLabel: "excepteur sint occaecat cupidatat",
    venue: "Non proident sunt",
    area: "Culpa qui officia",
    image: "/images/placeholder.png",
    imageAlt: "Deserunt mollit anim id",
    seats: 40,
    taken: 4,
    summary: "Est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do.",
  },
];

export const pastEvents = [
  { title: "Eiusmod tempor", note: "Incididunt ut labore et dolore magna aliqua enim ad", image: "/images/placeholder.png", alt: "Minim veniam quis nostrud exercitation ullamco" },
  { title: "Laboris nisi aliquip ex", note: "Ea commodo consequat duis aute irure in", image: "/images/placeholder.png", alt: "Reprehenderit voluptate velit esse cillum fugiat nulla pariatur" },
  { title: "Excepteur sint occaecat", note: "Cupidatat non proident sunt culpa qui officia deserunt", image: "/images/placeholder.png", alt: "Mollit anim id est" },
  { title: "Laborum lorem ipsum dolor", note: "Sit amet consectetur", image: "/images/placeholder.png", alt: "Adipiscing elit sed do eiusmod tempor incididunt" },
  { title: "Ut labore", note: "Et dolore magna aliqua enim", image: "/images/placeholder.png", alt: "Ad minim veniam quis" },
  { title: "Nostrud exercitation ullamco laboris nisi", note: "aliquip ex ea commodo consequat duis aute irure", image: "/images/placeholder.png", alt: "In reprehenderit voluptate velit esse" },
];

export function getEvent(slug: string) {
  return upcomingEvents.find((event) => event.slug === slug);
}

const dateFmt = new Intl.DateTimeFormat("en-PH", { day: "numeric", month: "long", weekday: "long", timeZone: "Asia/Manila" });
const monthFmt = new Intl.DateTimeFormat("en-PH", { month: "long", timeZone: "Asia/Manila" });
const dayFmt = new Intl.DateTimeFormat("en-PH", { day: "numeric", timeZone: "Asia/Manila" });
const weekdayFmt = new Intl.DateTimeFormat("en-PH", { weekday: "long", timeZone: "Asia/Manila" });
const shortFmt = new Intl.DateTimeFormat("en-PH", { day: "numeric", month: "short", timeZone: "Asia/Manila" });

export const formatEventDate = (iso: string) => dateFmt.format(new Date(iso));
export const eventMonth = (iso: string) => monthFmt.format(new Date(iso));
export const eventDay = (iso: string) => dayFmt.format(new Date(iso));
export const eventWeekday = (iso: string) => weekdayFmt.format(new Date(iso));
export const eventShortDate = (iso: string) => shortFmt.format(new Date(iso));

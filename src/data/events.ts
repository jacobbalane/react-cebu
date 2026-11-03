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
    title: "React Server Components, hands-on",
    kind: "Workshop",
    start: "2026-12-12T13:00:00+08:00",
    end: "2026-12-12T17:00:00+08:00",
    timeLabel: "1 to 5 PM",
    venue: "Cebu IT Park",
    area: "Lahug, Cebu City",
    image: "/images/workshop.jpg",
    imageAlt: "Developers working together around a table at a React Cebu workshop",
    seats: 40,
    taken: 22,
    summary:
      "Server Components change where your React code runs and how fast your app feels. In four hours you’ll fetch data on the server, stream a slow list with Suspense, handle a form with Actions, and leave with a small app online.",
    build:
      "A small event board: data fetched on the server, a list that streams in, and an RSVP form that works without client-side JavaScript.",
    bring: ["A laptop and charger", "Node 20 or newer", "A GitHub account"],
    audience:
      "You’ve built a few components and used useState. Next.js experience helps but isn’t needed; the starter project is ready to go.",
    agenda: [
      { time: "1:00", title: "Doors open, coffee and setup help", who: "Everyone" },
      { time: "1:20", title: "Why Server Components? A 30-minute tour", who: "Paolo Cruz" },
      { time: "2:00", title: "Hands-on, part one: fetch data on the server", who: "Mentors at every table" },
      { time: "3:15", title: "Break", who: "Snacks from our venue host" },
      { time: "3:30", title: "Hands-on, part two: forms with Actions", who: "Andrea Villanueva" },
      { time: "4:30", title: "Show what you built, then the group photo", who: "You" },
    ],
    teachers: [
      { name: "Paolo Cruz", role: "Full-stack developer. Gives the opening talk.", image: "/images/portrait-3.jpg" },
      { name: "Andrea Villanueva", role: "Frontend engineer. Runs the forms and Actions session.", image: "/images/portrait-2.jpg" },
    ],
  },
  {
    slug: "year-end-meetup",
    title: "Year-end meetup and lightning talks",
    kind: "Meetup",
    start: "2026-12-19T18:00:00+08:00",
    end: "2026-12-19T21:00:00+08:00",
    timeLabel: "6 to 9 PM",
    venue: "The Company Cebu",
    area: "Cebu City",
    image: "/images/presenter.jpg",
    imageAlt: "A speaker presenting to a group at a meetup",
    seats: 80,
    taken: 31,
    summary: "Five-minute talks from members, a look back at the year, and plenty of time to talk shop.",
  },
  {
    slug: "whats-new-in-react",
    title: "What’s new in React this year",
    kind: "Meetup",
    start: "2027-01-23T18:00:00+08:00",
    end: "2027-01-23T21:00:00+08:00",
    timeLabel: "6 to 9 PM",
    venue: "The Company Cebu",
    area: "Cebu City",
    image: "/images/speaker.jpg",
    imageAlt: "A speaker on stage in front of an audience",
    seats: 80,
    taken: 12,
    summary: "A tour of the latest React releases and what they mean for the apps you ship.",
  },
  {
    slug: "typescript-for-react-developers",
    title: "TypeScript for React developers",
    kind: "Workshop",
    start: "2027-01-31T13:00:00+08:00",
    end: "2027-01-31T17:00:00+08:00",
    timeLabel: "1 to 5 PM",
    venue: "Cebu IT Park",
    area: "Lahug, Cebu City",
    image: "/images/react-code.jpg",
    imageAlt: "React code on a monitor",
    seats: 40,
    taken: 9,
    summary: "Type your props, hooks and data fetching without fighting the compiler.",
  },
  {
    slug: "react-native-code-camp",
    title: "React Native code camp",
    kind: "Code camp",
    start: "2027-02-20T09:00:00+08:00",
    end: "2027-02-20T18:00:00+08:00",
    timeLabel: "9 AM to 6 PM",
    venue: "UP Cebu",
    area: "Lahug, Cebu City",
    image: "/images/students.jpg",
    imageAlt: "Students coding together on laptops",
    seats: 60,
    taken: 18,
    summary: "A full Saturday building and shipping a small mobile app with React Native and Expo.",
  },
  {
    slug: "testing-react-apps",
    title: "Testing React apps without the pain",
    kind: "Workshop",
    start: "2027-03-14T13:00:00+08:00",
    end: "2027-03-14T17:00:00+08:00",
    timeLabel: "1 to 5 PM",
    venue: "Cebu IT Park",
    area: "Lahug, Cebu City",
    image: "/images/laptops.jpg",
    imageAlt: "People learning on laptops",
    seats: 40,
    taken: 4,
    summary: "Testing Library, mocking the network, and tests you won’t want to delete.",
  },
];

export const pastEvents = [
  { title: "Cebu Hacktoberfest", note: "October 2025, with JavaScript Cebu, PizzaPy and Ethereum Philippines", image: "/images/crowd.jpg", alt: "A full room at Cebu Hacktoberfest" },
  { title: "Panel: careers in frontend", note: "August 2026, four engineers on getting hired", image: "/images/panel.jpg", alt: "A panel discussion with the audience on steps" },
  { title: "Student code camp", note: "March 2026, a full Saturday of React basics", image: "/images/students.jpg", alt: "Students working on laptops" },
  { title: "Hooks from first principles", note: "June 2026, workshop", image: "/images/coder.jpg", alt: "A developer coding in a dim room" },
  { title: "Gatsby workshop", note: "October 2019 at UP Cebu", image: "/images/laptops.jpg", alt: "People learning on laptops" },
  { title: "The first React Cebu meetup", note: "2019 at The Company Cebu, with 50+ developers", image: "/images/audience.jpg", alt: "An audience watching a talk" },
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

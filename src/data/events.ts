export type EventKind = "Meetup" | "Workshop" | "Code camp" | "Online";

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

export function getEvent(slug: string) {
  return upcomingEvents.find((event) => event.slug === slug);
}

const monthFmt = new Intl.DateTimeFormat("en-PH", { month: "long", timeZone: "Asia/Manila" });
const dayFmt = new Intl.DateTimeFormat("en-PH", { day: "numeric", timeZone: "Asia/Manila" });
const weekdayFmt = new Intl.DateTimeFormat("en-PH", { weekday: "long", timeZone: "Asia/Manila" });
const shortFmt = new Intl.DateTimeFormat("en-PH", { day: "numeric", month: "short", timeZone: "Asia/Manila" });

export const eventMonth = (iso: string) => monthFmt.format(new Date(iso));
export const eventDay = (iso: string) => dayFmt.format(new Date(iso));
export const eventWeekday = (iso: string) => weekdayFmt.format(new Date(iso));
export const eventShortDate = (iso: string) => shortFmt.format(new Date(iso));

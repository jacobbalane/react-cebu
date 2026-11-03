/** The public address, used in calendar files. */
export const SITE_URL = "https://react.jscebu.org";

/** The React Cebu Facebook page: where people join, and where events are announced and RSVPed. */
export const FACEBOOK_URL = "https://www.facebook.com/reactcebu/";

/** Talk ideas come in by email now that there's no Speak page. */
export const TALK_EMAIL = "mailto:react@jscebu.org?subject=Talk%20idea";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/events", label: "Events" },
];

export const footerColumns = [
  {
    title: "Community",
    links: [
      { href: "/community", label: "About" },
      { href: "/community#organizers", label: "Organizers" },
      { href: "/community#code-of-conduct", label: "Code of conduct" },
    ],
  },
  {
    title: "Events",
    links: [
      { href: "/events", label: "Upcoming" },
      { href: "/events#recaps", label: "Recaps" },
      { href: "/partners", label: "Host an event" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: TALK_EMAIL, label: "Give a talk" },
      { href: "/community#organizers", label: "Volunteer" },
      { href: "/partners", label: "Partner with us" },
    ],
  },
  {
    title: "Follow",
    links: [
      { href: FACEBOOK_URL, label: "Facebook" },
      { href: "https://github.com/reactcebu", label: "GitHub" },
      { href: "mailto:react@jscebu.org", label: "react@jscebu.org" },
    ],
  },
];

export const friends = [
  { name: "JavaScript Cebu", weight: 700 },
  { name: "Vue.js Cebu", weight: 500 },
  { name: "Angular Cebu", weight: 400 },
  { name: "PizzaPy", weight: 800 },
  { name: "Ethereum Philippines", weight: 300 },
  { name: "DEVCON Cebu", weight: 700 },
  { name: "PWA Pilipinas", weight: 500 },
];

// Places that have hosted React Cebu events.
export const venues = [
  { name: "The Company Cebu", weight: 500 },
  { name: "Go Negosyo Center, UP Cebu", weight: 400 },
];

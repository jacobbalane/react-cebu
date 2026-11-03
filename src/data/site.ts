/** The public address, used for share links and calendar files. */
export const SITE_URL = "https://react.jscebu.org";

export const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/#learn", label: "Learn" },
  { href: "/community", label: "Community" },
  { href: "/speak", label: "Speak" },
  { href: "/recaps", label: "Recaps" },
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
      { href: "/events#past", label: "Past events" },
      { href: "/partners", label: "Host an event" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: "/speak", label: "Speak" },
      { href: "/community#organizers", label: "Volunteer" },
      { href: "/partners", label: "Partner with us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/recaps", label: "Recaps" },
      { href: "/recaps", label: "Slides" },
      { href: "/recaps", label: "Recordings" },
    ],
  },
  {
    title: "Follow",
    links: [
      // TODO: replace with the real React Cebu Facebook group URL
      { href: "#facebook", label: "Facebook" },
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

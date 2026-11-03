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
  { name: "Id est", weight: 700 },
  { name: "Laborum lorem", weight: 500 },
  { name: "Ipsum dolor", weight: 400 },
  { name: "Sit", weight: 800 },
  { name: "Amet consectetur", weight: 300 },
  { name: "Adipiscing elit", weight: 700 },
  { name: "Sed do", weight: 500 },
];

// Places that have hosted React Cebu events.
export const venues = [
  { name: "Eiusmod tempor incididunt", weight: 500 },
  { name: "Ut labore et dolore magna", weight: 400 },
];

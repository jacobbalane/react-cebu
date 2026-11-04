/** The public address, used in calendar files. */
export const SITE_URL = "https://react.jscebu.org";

/** The React Cebu Facebook page: where people join, and where events are announced and RSVPed. */
export const FACEBOOK_URL = "https://www.facebook.com/reactcebu/";

/** Talk ideas come in by email now that there's no Speak page. */
export const TALK_EMAIL = "mailto:react@jscebu.org?subject=Talk%20idea";
export const VOLUNTEER_EMAIL = "mailto:react@jscebu.org?subject=Volunteering";

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
      { href: "/community#volunteer", label: "Volunteer" },
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

/**
 * The public address, for anything that links to the site from outside it. Netlify sets `URL` to the
 * site's main address when it builds, so this follows the domain without a code change.
 */
export const SITE_URL = process.env.URL ?? "https://react.jscebu.org";

export const SITE_DESCRIPTION =
  "Free meetups, workshops and code camps for developers building with React in Cebu, Philippines. Part of JavaScript Cebu since 2019.";

/** The React Cebu Facebook page: where people join, and where events are announced and RSVPed. */
export const FACEBOOK_URL = "https://www.facebook.com/reactcebu/";
export const FACEBOOK_PHOTOS_URL = "https://www.facebook.com/reactcebu/photos";
export const GITHUB_URL = "https://github.com/reactcebu";

/** Talk ideas come in by email now that there's no Speak page. */
export const TALK_EMAIL = "mailto:react@jscebu.org?subject=Talk%20idea";
export const VOLUNTEER_EMAIL = "mailto:react@jscebu.org?subject=Volunteering";
export const PARTNER_EMAIL = "mailto:react@jscebu.org?subject=Partnering%20with%20React%20Cebu";
export const REPORT_EMAIL = "mailto:react@jscebu.org?subject=Code%20of%20conduct%20report";

/** Upcoming dates live on Cebby, which lists Cebu tech events, ours included. */
export const CEBBY_URL = "https://www.getcebby.com/events";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
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
      { href: "/events#upcoming", label: "Upcoming" },
      { href: "/events#recaps", label: "Recaps" },
      { href: "/gallery", label: "Gallery" },
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
      { href: GITHUB_URL, label: "GitHub" },
      { href: "mailto:react@jscebu.org", label: "react@jscebu.org" },
    ],
  },
];

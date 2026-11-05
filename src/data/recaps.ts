export type Recap = {
  title: string;
  when: string;
  note: string;
  image: string;
  alt: string;
};

// Real React Cebu events, from the React Cebu Facebook page and the "React Cebu 2019 Wrapped" post
// on Medium. It isn't the full list, and the photos are samples, not from these events.
export const recaps: Recap[] = [
  {
    title: "Beplop Night 2024",
    when: "December 2024",
    note: "At Kusina ni Osting, Cebu City.",
    image: "/images/crowd.jpg",
    alt: "A full room of developers at a community event",
  },
  {
    title: "REACT-IVATE 24",
    when: "February 2024",
    note: "At enspace Cebu.",
    image: "/images/speaker.jpg",
    alt: "A speaker presenting to a room",
  },
  {
    title: "Beplop Night",
    when: "November 2019",
    note: "Our year-ender, with beplop (beef loaf) and a few drinks.",
    image: "/images/panel.jpg",
    alt: "A panel discussion with the audience on steps",
  },
  {
    title: "React Cebu goes to Iloilo",
    when: "November 2019",
    note: "A React workshop in Iloilo with more than 50 participants.",
    image: "/images/students.jpg",
    alt: "Students working on laptops",
  },
  {
    title: "Gatsby Workshop",
    when: "October 2019",
    note: "We built a website with Gatsby.",
    image: "/images/workshop.jpg",
    alt: "Developers at a workshop table",
  },
  {
    title: "React Series: Zero to Hero",
    when: "June to August 2019",
    note: "Five sessions for beginners and a hackathon, with LegalMatch Philippines.",
    image: "/images/coder.jpg",
    alt: "A developer coding in a dim room",
  },
  {
    title: "React Cebu: Meet & Greet",
    when: "May 2019",
    note: "Our first meetup, at The Company Cebu, with more than 50 participants.",
    image: "/images/audience.jpg",
    alt: "An audience watching a talk",
  },
];

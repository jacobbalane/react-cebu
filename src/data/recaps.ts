export type Recap = {
  title: string;
  when: string;
  note: string;
  image: string;
  alt: string;
};

// Real React Cebu events, each with a photo from that event. Dates and venues come from the event
// posters on the Facebook page and the "React Cebu 2019 Wrapped" post on Medium. Beplop Night (2019
// and 2024) and the Iloilo workshop are left out until there are photos from them.
export const recaps: Recap[] = [
  {
    title: "REACT-IVATE 24",
    when: "February 2024",
    note: "At enspace Cebu.",
    image: "/images/reactivate-group.jpg",
    alt: "Everyone at REACT-IVATE 24 gathered for a group photo at enspace",
  },
  {
    title: "TypeScript Patterns",
    when: "December 2023",
    note: "Better React components with Glenn Reyes, at enspace Cebu.",
    image: "/images/enspace-group.jpg",
    alt: "Everyone at the TypeScript Patterns meetup around a long wooden table",
  },
  {
    title: "React Native Series: Zero to Hero",
    when: "March 2020",
    note: "Saturday sessions at LegalMatch Philippines.",
    image: "/images/native-speaker.jpg",
    alt: "A speaker opening the React Native series in front of the projected title",
  },
  {
    title: "Gatsby Workshop",
    when: "October 2019",
    note: "We built a website with Gatsby.",
    image: "/images/gatsby-workshop-group.jpg",
    alt: "Everyone at the Gatsby workshop gathered for a group photo",
  },
  {
    title: "React Series: Zero to Hero",
    when: "June to August 2019",
    note: "Five sessions for beginners and a hackathon, with LegalMatch Philippines.",
    image: "/images/what-is-react-cebu.jpg",
    alt: "A speaker explaining what React Cebu is to a room at LegalMatch",
  },
  {
    title: "React Cebu: Meet & Greet",
    when: "May 2019",
    note: "Our first meetup, at The Company Cebu, with more than 50 participants.",
    image: "/images/first-meetup-room.jpg",
    alt: "A full hall watching a React Cebu slide at the first meetup",
  },
];

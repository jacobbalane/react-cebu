export type RecapTag = "Meetups" | "Workshops" | "Code camps" | "Hacktoberfest";

export type Recap = {
  title: string;
  note: string;
  tag: RecapTag;
  image: string;
  alt: string;
  has: string[];
};

// Sample recaps, except the 2019 and Hacktoberfest entries which reflect real events.
export const recaps: Recap[] = [
  { title: "Panel: careers in frontend", note: "August 2026. Four engineers on getting hired in Cebu.", tag: "Meetups", image: "/images/panel.jpg", alt: "A panel discussion with the audience on steps", has: ["Recording"] },
  { title: "Hooks from first principles", note: "June 2026. Build useState from scratch.", tag: "Workshops", image: "/images/coder.jpg", alt: "A developer coding in a dim room", has: ["Slides", "Code"] },
  { title: "What’s new in React 19", note: "May 2026. Actions, use, and the compiler.", tag: "Meetups", image: "/images/speaker.jpg", alt: "A speaker presenting to a room", has: ["Slides", "Recording"] },
  { title: "Student code camp", note: "March 2026. A Saturday of React basics.", tag: "Code camps", image: "/images/students.jpg", alt: "Students working on laptops", has: ["Slides", "Code"] },
  { title: "Testing React apps", note: "February 2026. Testing Library without tears.", tag: "Workshops", image: "/images/react-code.jpg", alt: "React code on a screen", has: ["Code"] },
  { title: "Hack night, week one", note: "October 2025. First pull requests of Hacktoberfest.", tag: "Hacktoberfest", image: "/images/crowd.jpg", alt: "A crowd at a hack night", has: ["Photos"] },
  { title: "Gatsby workshop", note: "October 2019 at UP Cebu.", tag: "Workshops", image: "/images/workshop.jpg", alt: "Developers at a workshop table", has: ["Photos"] },
  { title: "The first React Cebu meetup", note: "2019 at The Company Cebu, with 50+ developers.", tag: "Meetups", image: "/images/audience.jpg", alt: "An audience watching a talk", has: ["Photos"] },
  { title: "Hacktoberfest wrap-up", note: "October 2025. What got merged.", tag: "Hacktoberfest", image: "/images/laptops.jpg", alt: "People working on laptops", has: ["Photos", "Slides"] },
];

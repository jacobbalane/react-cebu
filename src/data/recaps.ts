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
  { title: "Nisi aliquip ex ea", note: "Commodo consequat duis aute irure in reprehenderit voluptate velit.", tag: "Meetups", image: "/images/placeholder.png", alt: "Esse cillum fugiat nulla pariatur excepteur sint occaecat", has: ["Cupidatat"] },
  { title: "Non proident sunt culpa", note: "Qui officia deserunt mollit anim id.", tag: "Workshops", image: "/images/placeholder.png", alt: "Est laborum lorem ipsum dolor sit amet", has: ["Consectetur", "Adipiscing"] },
  { title: "Elit sed do eiusmod tempor", note: "Incididunt ut labore et dolore magna aliqua.", tag: "Meetups", image: "/images/placeholder.png", alt: "Enim ad minim veniam quis nostrud", has: ["Exercitation", "Ullamco"] },
  { title: "Laboris nisi aliquip", note: "Ex ea commodo consequat duis aute irure.", tag: "Code camps", image: "/images/placeholder.png", alt: "In reprehenderit voluptate velit", has: ["Esse", "Cillum"] },
  { title: "Fugiat nulla pariatur", note: "Excepteur sint occaecat cupidatat non proident.", tag: "Workshops", image: "/images/placeholder.png", alt: "Sunt culpa qui officia deserunt", has: ["Mollit"] },
  { title: "Anim id est laborum", note: "Lorem ipsum dolor sit amet consectetur adipiscing.", tag: "Hacktoberfest", image: "/images/placeholder.png", alt: "Elit sed do eiusmod tempor incididunt", has: ["Ut"] },
  { title: "Labore et", note: "Dolore magna aliqua enim ad.", tag: "Workshops", image: "/images/placeholder.png", alt: "Minim veniam quis nostrud exercitation", has: ["Ullamco"] },
  { title: "Laboris nisi aliquip ex ea", note: "commodo consequat duis aute irure in reprehenderit voluptate.", tag: "Meetups", image: "/images/placeholder.png", alt: "Velit esse cillum fugiat nulla", has: ["Pariatur"] },
  { title: "Excepteur sint", note: "Occaecat cupidatat non proident sunt.", tag: "Hacktoberfest", image: "/images/placeholder.png", alt: "Culpa qui officia deserunt", has: ["Mollit", "Anim"] },
];

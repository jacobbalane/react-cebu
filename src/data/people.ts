export type Organizer = {
  name: string;
  role: string;
  /** Left out until we have their photo. `avatar` is a tight crop of the face for small circles. */
  photo?: { src: string; alt: string; position: string; avatar: string };
};

const placeholder: Organizer = { name: "Organizer name", role: "Role to be confirmed" };

// The placeholders stay until the rest of the organizers are confirmed.
export const organizers: Organizer[] = [
  {
    name: "Dorell James Galang",
    role: "Community lead/co-leader",
    photo: {
      src: "/images/dorell-james-galang.jpg",
      alt: "Dorell James Galang at sunrise on a mountain, in a knit cap and gloves",
      position: "20% 50%",
      avatar: "/images/dorell-james-galang-avatar.jpg",
    },
  },
  placeholder,
  placeholder,
  placeholder,
];

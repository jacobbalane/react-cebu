export type Organizer = {
  name: string;
  role: string;
  /** Left out until we have their photo. `avatar` is a tight crop of the face for small circles. */
  photo?: { src: string; alt: string; position: string; avatar: string };
};

// Roles are kept here but not shown for now. Anyone added without a photo gets a silhouette.
export const organizers: Organizer[] = [
  {
    name: "Dorell James",
    role: "Community lead/co-leader",
    photo: {
      src: "/images/dorell-james-galang.jpg",
      alt: "Dorell James at sunrise on a mountain, in a knit cap and gloves",
      position: "20% 50%",
      avatar: "/images/dorell-james-galang-avatar.jpg",
    },
  },
  {
    name: "Cleo Credo",
    role: "Role to be confirmed",
    photo: {
      src: "/images/cleo-credo-card.jpg",
      alt: "Cleo Credo smiling in a garden, sitting on a stone railing",
      position: "50% 50%",
      avatar: "/images/cleo-credo-avatar.jpg",
    },
  },
  {
    name: "Sieg Balona",
    role: "Role to be confirmed",
    photo: {
      src: "/images/sieg-balona.jpg",
      alt: "Sieg Balona in a black cap and shirt at a workshop",
      position: "50% 50%",
      avatar: "/images/sieg-balona-avatar.jpg",
    },
  },
  {
    name: "Ariel Pasilang",
    role: "Role to be confirmed",
    photo: {
      src: "/images/ariel-pasilang-card.jpg",
      alt: "Ariel Pasilang in a blue jacket on a grassy mountain",
      position: "50% 50%",
      avatar: "/images/ariel-pasilang-avatar.jpg",
    },
  },
];

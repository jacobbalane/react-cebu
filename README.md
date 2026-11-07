# React Cebu

The website for React Cebu, a free React community in Cebu, Philippines, and part of JavaScript Cebu.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. Animations use GSAP (ScrollTrigger, SplitText, Draggable, Inertia) with Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

- `src/app/` holds the pages: home, events, event detail (`events/[slug]`), community, speak, partners, recaps.
- `src/data/` holds the content: events, recaps, organizers, speakers, footer links. Edit these files to change what the site shows.
- `src/components/` holds the sections, grouped by page, plus shared pieces like the header, footer and motion helpers.
- `src/lib/gsap.ts` registers the GSAP plugins once; `src/components/smooth-scroll.tsx` wires Lenis to ScrollTrigger.
- `public/images/` holds the photos.

## Before launch

- Photos are free Unsplash samples, and speaker names, organizers and future events are placeholders. Replace them in `src/data/` and `public/images/`.
- The subscribe, talk and partner forms only show a confirmation; connect them to a mailing list or form service.
- Add the real Facebook group link in `src/data/site.ts` (footer, "Join the Facebook group" and "Community chat" still point to `#facebook`).
- Follow `docs/main-domain-checklist.md` when the site moves to its main domain.

## Calendar files

Every event has a downloadable calendar file at `/events/<slug>/calendar`, built from `start` and `end` in `src/data/events.ts`. Google Calendar, Apple Calendar and Outlook all open it.

## Motion

Every animation goes through `gsap.matchMedia`, so visitors who prefer reduced motion get a still page with everything in place, and Lenis stays off for them.

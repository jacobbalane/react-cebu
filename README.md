# React Cebu

The website for React Cebu, a free React community in Cebu, Philippines, and part of JavaScript Cebu.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. Animations use GSAP (ScrollTrigger, SplitText, Draggable, Inertia) with Lenis smooth scrolling. The phone on the Events page uses three.js.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

- `src/app/` holds the pages: home, community, events, gallery and partners, plus the not found page.
- `src/data/` holds the content: gallery photos, organizers, event recaps, and the site's links and footer. Edit these files to change what the site shows.
- `src/components/` holds the sections, grouped by page, plus shared pieces like the header, footer and motion helpers.
- `src/lib/gsap.ts` registers the GSAP plugins once; `src/components/smooth-scroll.tsx` wires Lenis to ScrollTrigger.
- `public/images/` holds the photos, all from React Cebu's own events.

## Search and AI tools

- `src/lib/page-address.ts` gives each page its canonical link and share details, including the share image.
- `src/app/sitemap.ts` and `src/app/llms.txt/route.ts` list the pages.
- `src/app/page.tsx` holds the structured data.

## Deployment

The site runs on Netlify, and pushing to `main` deploys it. `SITE_URL` in `src/data/site.ts` reads Netlify's `URL` when the site builds, so the links above follow the site's main address.

## Motion

Every animation goes through `gsap.matchMedia`, so visitors who prefer reduced motion get a still page with everything in place, and Lenis stays off for them.

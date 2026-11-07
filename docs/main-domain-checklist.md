# Moving to the main domain

Use this when the site moves from the Netlify preview to its main domain. `react.jscebu.org` is the likely address, but it isn't confirmed.

The canonical links, share image, sitemap, `robots.txt`, `llms.txt` and structured data all read Netlify's `URL` value when the site builds. They update after a new deploy, so no address needs editing by hand.

## Decide

- [ ] Choose the domain.
- [ ] If it isn't `react.jscebu.org`, decide what happens to that address. It serves the old one-page site today, so redirect it to the new domain rather than leave it up.

## In Netlify

- [ ] If the domain is `react.jscebu.org`, remove it from the old Netlify site first. A domain can only sit on one site.
- [ ] Add the domain to this site and set it as the primary domain.
- [ ] Update DNS if Netlify asks for it.
- [ ] Wait for the HTTPS certificate.
- [ ] Trigger a new deploy. `URL` is read at build time, so nothing changes until the site rebuilds.
- [ ] Turn off the "Powered by Netlify" badge if it still shows. It covers part of the hero's second button on phones.

## In the code

- [ ] If the domain isn't `react.jscebu.org`, change the fallback in `SITE_URL` in `src/data/site.ts`. It's only used outside Netlify.
- [ ] If the email address changes too, update `src/data/site.ts`, `src/app/page.tsx` and `src/app/llms.txt/route.ts`.

## Check the live site

- [ ] `/robots.txt`, `/sitemap.xml` and `/llms.txt` show the new address.
- [ ] The page source on Home and one other page shows the new address in the canonical link, `og:url` and `og:image`.
- [ ] The share image opens at `/images/share-card.jpg`.
- [ ] `https://react-cebu-2026-preview.netlify.app/` redirects to the new domain.
- [ ] A wrong address shows the not found page.

## Tell the outside world

- [ ] Run Home through Facebook's Sharing Debugger, so it picks up the share image.
- [ ] Run Home through Google's Rich Results Test.
- [ ] Add the domain to Google Search Console and submit `/sitemap.xml`.
- [ ] Update the website link on the Facebook page and on GitHub.

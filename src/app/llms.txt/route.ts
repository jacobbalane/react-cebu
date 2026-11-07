import { CEBBY_URL, FACEBOOK_URL, GITHUB_URL, SITE_URL } from "@/data/site";

/** The site in plain text for AI tools, built here so its links follow the site's address. */
const summary = `# React Cebu

> A free React community in Cebu, Philippines. Meetups, workshops and code camps for developers building with React. Part of JavaScript Cebu since 2019.

Every event is free to attend, and people at every level are welcome.

## Pages

- [Home](${SITE_URL}/): what React Cebu is and what happens at its events
- [Community](${SITE_URL}/community): how the community is run, its history, its organizers and its code of conduct
- [Events](${SITE_URL}/events): how to find the next event, recaps of past events and what to expect at a first event
- [Gallery](${SITE_URL}/gallery): photos from past events
- [Partner with us](${SITE_URL}/partners): ways to help keep the events free

## Upcoming events

- [Cebby](${CEBBY_URL}): dates for upcoming events, listed with other Cebu tech events
- [Facebook](${FACEBOOK_URL}): where events are announced and RSVPed

## Contact

- Email: react@jscebu.org
- [GitHub](${GITHUB_URL})
`;

export function GET() {
  return new Response(summary, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

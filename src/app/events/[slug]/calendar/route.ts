import { getEvent, upcomingEvents } from "@/data/events";
import { SITE_URL } from "@/data/site";

export function generateStaticParams() {
  return upcomingEvents.map((event) => ({ slug: event.slug }));
}

// iCalendar dates are UTC in the compact form 20261212T050000Z.
const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

// Text values must escape backslashes, commas, semicolons and newlines (RFC 5545).
const icsText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");

// Content lines longer than 75 octets are folded onto continuation lines.
function fold(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  for (const char of line) {
    const limit = parts.length === 0 ? 75 : 74;
    if (new TextEncoder().encode(current + char).length > limit) {
      parts.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** Serves an event as an .ics file that Google, Apple and Outlook calendars can open. */
export async function GET(_request: Request, ctx: RouteContext<"/events/[slug]/calendar">) {
  const { slug } = await ctx.params;
  const event = getEvent(slug);
  if (!event) return new Response("Event not found", { status: 404 });

  // Events no longer have pages of their own, so point back to the list.
  const url = `${SITE_URL}/events`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//React Cebu//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@react.jscebu.org`,
    `DTSTAMP:${icsDate(event.start)}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(event.end)}`,
    `SUMMARY:${icsText(`${event.title} — React Cebu`)}`,
    `LOCATION:${icsText(`${event.venue}, ${event.area}`)}`,
    `DESCRIPTION:${icsText(`${event.summary}\n\nFree. Details and RSVP: ${url}`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}

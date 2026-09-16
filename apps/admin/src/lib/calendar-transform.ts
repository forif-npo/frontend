import type { IAttendee, IEvent, TEventColor } from "@repo/big-calendar";
import type { calendar_v3 } from "googleapis";

function mapColorIdToEventColor(colorId?: string | null): TEventColor {
  if (!colorId) return "blue";

  const colorMap: Record<string, TEventColor> = {
    "1": "purple",
    "2": "green",
    "3": "purple",
    "4": "red",
    "5": "yellow",
    "6": "orange",
    "7": "blue",
    "8": "gray",
    "9": "blue",
    "10": "green",
    "11": "red",
  };

  return colorMap[colorId] ?? "blue";
}

export function mapEventColorToColorId(color: TEventColor): string {
  const colorMap: Record<TEventColor, string> = {
    purple: "1",
    green: "2",
    red: "4",
    yellow: "5",
    orange: "6",
    blue: "7",
    gray: "8",
  };

  return colorMap[color] ?? "7";
}

function parseEventDateTime(
  eventDateTime?: calendar_v3.Schema$EventDateTime | null,
): string {
  if (!eventDateTime) return new Date().toISOString();
  if (eventDateTime.dateTime)
    return new Date(eventDateTime.dateTime).toISOString();
  if (eventDateTime.date) return new Date(eventDateTime.date).toISOString();
  return new Date().toISOString();
}

function extractUsersFromEvent(event: calendar_v3.Schema$Event): IAttendee[] {
  const users: IAttendee[] = [];

  event.attendees?.forEach((attendee) => {
    if (attendee.email && !attendee.resource) {
      users.push({
        id: attendee.email,
        name: attendee.displayName || attendee.email,
        picturePath: null,
      });
    }
  });

  if (users.length === 0 && event.organizer?.email) {
    users.push({
      id: event.organizer.email,
      name: event.organizer.displayName || event.organizer.email,
      picturePath: null,
    });
  }

  return users;
}

export function transformGoogleEventToIEvent(
  event: calendar_v3.Schema$Event,
  index: number,
): IEvent {
  return {
    id: index + 1,
    googleEventId: event.id ?? undefined,
    title: event.summary ?? "제목 없음",
    description: event.description ?? "",
    startDate: parseEventDateTime(event.start),
    endDate: parseEventDateTime(event.end),
    color: mapColorIdToEventColor(event.colorId),
    attendees: extractUsersFromEvent(event),
    hangoutLink: event.hangoutLink || undefined,
  };
}

export function transformGoogleEventsToIEvents(
  events: calendar_v3.Schema$Event[] | undefined | null,
): IEvent[] {
  if (!events || events.length === 0) return [];
  return events.map((event, index) =>
    transformGoogleEventToIEvent(event, index),
  );
}

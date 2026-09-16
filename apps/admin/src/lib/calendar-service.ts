import { env } from "@/env";
import type { IAttendee, TEventColor } from "@repo/big-calendar";
import { google } from "googleapis";
import { mapEventColorToColorId, transformGoogleEventsToIEvents } from "@/lib/calendar-transform";

type CalendarEventInput = {
  summary?: string;
  description?: string;
  start?: string;
  end?: string;
  color?: TEventColor;
};

function createCalendarAuth(readOnly = false) {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      readOnly
        ? "https://www.googleapis.com/auth/calendar.readonly"
        : "https://www.googleapis.com/auth/calendar",
    ],
  });
}

function getCalendar(readOnly = false) {
  return google.calendar({ version: "v3", auth: createCalendarAuth(readOnly) });
}

function calendarId() {
  return env.GOOGLE_CALENDAR_ID || "primary";
}

async function listGoogleEvents() {
  return getCalendar(true).events.list({
    calendarId: calendarId(),
    singleEvents: true,
    orderBy: "startTime",
  });
}

export async function getCalendarEvents() {
  const response = await listGoogleEvents();
  return transformGoogleEventsToIEvents(response.data.items);
}

export async function getCalendarUsers(): Promise<IAttendee[]> {
  const response = await listGoogleEvents();
  const userMap = new Map<string, IAttendee>();

  response.data.items?.forEach((event) => {
    event.attendees?.forEach((attendee) => {
      if (
        attendee.email &&
        !attendee.resource &&
        !userMap.has(attendee.email)
      ) {
        userMap.set(attendee.email, {
          id: attendee.email,
          name: attendee.displayName || attendee.email,
          picturePath: null,
        });
      }
    });

    if (event.organizer?.email && !userMap.has(event.organizer.email)) {
      userMap.set(event.organizer.email, {
        id: event.organizer.email,
        name: event.organizer.displayName || event.organizer.email,
        picturePath: null,
      });
    }
  });

  return Array.from(userMap.values());
}

export async function createCalendarEvent({
  summary,
  description,
  start,
  end,
  color,
}: Required<
  Pick<CalendarEventInput, "summary" | "description" | "start" | "end">
> &
  Pick<CalendarEventInput, "color">) {
  const event = await getCalendar().events.insert({
    calendarId: calendarId(),
    requestBody: {
      summary,
      description,
      start: { dateTime: start, timeZone: "Asia/Seoul" },
      end: { dateTime: end, timeZone: "Asia/Seoul" },
      colorId: color ? mapEventColorToColorId(color) : undefined,
    },
  });

  return event.data;
}

export async function updateCalendarEvent(
  eventId: string,
  { summary, description, start, end, color }: CalendarEventInput,
) {
  const requestBody: {
    summary?: string;
    description?: string;
    start?: { dateTime: string; timeZone: string };
    end?: { dateTime: string; timeZone: string };
    colorId?: string;
  } = {};

  if (summary !== undefined) requestBody.summary = summary;
  if (description !== undefined) requestBody.description = description;
  if (start !== undefined)
    requestBody.start = { dateTime: start, timeZone: "Asia/Seoul" };
  if (end !== undefined)
    requestBody.end = { dateTime: end, timeZone: "Asia/Seoul" };
  if (color !== undefined) requestBody.colorId = mapEventColorToColorId(color);

  const event = await getCalendar().events.patch({
    calendarId: calendarId(),
    eventId,
    requestBody,
  });

  return event.data;
}

export async function deleteCalendarEvent(eventId: string) {
  await getCalendar().events.delete({ calendarId: calendarId(), eventId });
}

export async function getCalendarEvent(eventId: string) {
  const event = await getCalendar().events.get({
    calendarId: calendarId(),
    eventId,
  });
  return event.data;
}

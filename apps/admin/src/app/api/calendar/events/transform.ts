import type { IAttendee, IEvent, TEventColor } from "@repo/big-calendar";
import type { calendar_v3 } from "googleapis";

/**
 * Google Calendar colorId를 TEventColor로 매핑
 * Google Calendar colorId: 1-11 (string)
 */
function mapColorIdToEventColor(colorId?: string | null): TEventColor {
  if (!colorId) return "blue";

  const colorMap: Record<string, TEventColor> = {
    "1": "purple", // Lavender
    "2": "green", // Sage
    "3": "purple", // Grape
    "4": "red", // Flamingo
    "5": "yellow", // Banana
    "6": "orange", // Tangerine
    "7": "blue", // Peacock
    "8": "gray", // Graphite
    "9": "blue", // Blueberry
    "10": "green", // Basil
    "11": "red", // Tomato
  };

  return colorMap[colorId] ?? "blue";
}

/**
 * TEventColor를 Google Calendar colorId로 매핑
 */
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

/**
 * Google Calendar 이벤트의 시작/종료 시간을 ISO string으로 변환
 */
function parseEventDateTime(
  eventDateTime?: calendar_v3.Schema$EventDateTime | null,
): string {
  if (!eventDateTime) {
    return new Date().toISOString();
  }

  // dateTime이 있으면 사용 (시간 포함 이벤트)
  if (eventDateTime.dateTime) {
    return new Date(eventDateTime.dateTime).toISOString();
  }

  // date만 있으면 사용 (종일 이벤트)
  if (eventDateTime.date) {
    return new Date(eventDateTime.date).toISOString();
  }

  return new Date().toISOString();
}

/**
 * Google Calendar 이벤트의 attendees를 IAttendee 배열로 변환
 */
function extractUsersFromEvent(event: calendar_v3.Schema$Event): IAttendee[] {
  const users: IAttendee[] = [];

  // attendees에서 사용자 추출 (resource 제외)
  event.attendees?.forEach((attendee) => {
    if (attendee.email && !attendee.resource) {
      users.push({
        id: attendee.email,
        name: attendee.displayName || attendee.email,
        picturePath: null,
      });
    }
  });

  // attendees가 없으면 organizer 사용
  if (users.length === 0 && event.organizer?.email) {
    users.push({
      id: event.organizer.email,
      name: event.organizer.displayName || event.organizer.email,
      picturePath: null,
    });
  }

  return users;
}

/**
 * Google Calendar 이벤트를 big-calendar IEvent 형식으로 변환
 */
export function transformGoogleEventToIEvent(
  event: calendar_v3.Schema$Event,
  index: number,
): IEvent {
  return {
    id: index + 1, // Google Calendar id는 string이므로 index 기반 number id 사용
    googleEventId: event.id ?? undefined, // Google Calendar 원본 ID 보존
    title: event.summary ?? "제목 없음",
    description: event.description ?? "",
    startDate: parseEventDateTime(event.start),
    endDate: parseEventDateTime(event.end),
    color: mapColorIdToEventColor(event.colorId),
    attendees: extractUsersFromEvent(event),
    hangoutLink: event.hangoutLink || undefined,
  };
}

/**
 * Google Calendar 이벤트 배열을 big-calendar IEvent 배열로 변환
 */
export function transformGoogleEventsToIEvents(
  events: calendar_v3.Schema$Event[] | undefined | null,
): IEvent[] {
  if (!events || events.length === 0) {
    return [];
  }

  return events.map((event, index) =>
    transformGoogleEventToIEvent(event, index),
  );
}

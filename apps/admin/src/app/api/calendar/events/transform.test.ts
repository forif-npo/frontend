import { describe, expect, it } from "@jest/globals";
import {
  mapEventColorToColorId,
  transformGoogleEventToIEvent,
  transformGoogleEventsToIEvents,
} from "./transform";

describe("calendar event transforms", () => {
  it("keeps the existing event fields while excluding resource attendees", () => {
    const event = transformGoogleEventToIEvent(
      {
        id: "google-event-id",
        summary: "FORIF 회의",
        description: "릴리즈 점검",
        start: { dateTime: "2026-09-07T10:00:00+09:00" },
        end: { dateTime: "2026-09-07T11:00:00+09:00" },
        colorId: "2",
        attendees: [
          { email: "member@forif.org", displayName: "회원" },
          { email: "room@forif.org", resource: true },
        ],
        hangoutLink: "https://meet.google.com/example",
      },
      4,
    );

    expect(event).toEqual({
      id: 5,
      googleEventId: "google-event-id",
      title: "FORIF 회의",
      description: "릴리즈 점검",
      startDate: "2026-09-07T01:00:00.000Z",
      endDate: "2026-09-07T02:00:00.000Z",
      color: "green",
      attendees: [{ id: "member@forif.org", name: "회원", picturePath: null }],
      hangoutLink: "https://meet.google.com/example",
    });
  });

  it("uses defaults and the organizer for all-day events without attendees", () => {
    const event = transformGoogleEventToIEvent(
      {
        start: { date: "2026-09-07" },
        end: { date: "2026-09-08" },
        colorId: "unknown",
        organizer: {
          email: "organizer@forif.org",
          displayName: "주최자",
        },
      },
      0,
    );

    expect(event).toEqual({
      id: 1,
      googleEventId: undefined,
      title: "제목 없음",
      description: "",
      startDate: "2026-09-07T00:00:00.000Z",
      endDate: "2026-09-08T00:00:00.000Z",
      color: "blue",
      attendees: [
        { id: "organizer@forif.org", name: "주최자", picturePath: null },
      ],
      hangoutLink: undefined,
    });
  });

  it("returns an empty calendar model for missing event lists", () => {
    expect(transformGoogleEventsToIEvents(undefined)).toEqual([]);
    expect(transformGoogleEventsToIEvents(null)).toEqual([]);
    expect(transformGoogleEventsToIEvents([])).toEqual([]);
    expect(mapEventColorToColorId("green")).toBe("2");
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@/env", () => ({
  env: {
    GOOGLE_CALENDAR_ID: "calendar-id",
    GOOGLE_PRIVATE_KEY: "private-key",
    GOOGLE_SERVICE_ACCOUNT_EMAIL: "calendar@forif.org",
  },
}));
jest.mock("googleapis", () => ({
  google: {
    auth: { GoogleAuth: jest.fn() },
    calendar: jest.fn(),
  },
}));
import { google } from "googleapis";
import { POST } from "./route";

const mockedCalendar = google.calendar as jest.MockedFunction<
  typeof google.calendar
>;

describe("calendar event POST", () => {
  beforeEach(() => {
    mockedCalendar.mockReset();
  });

  it("keeps the existing event payload", async () => {
    const insert = jest.fn(async () => ({ data: { id: "event-id" } }));
    mockedCalendar.mockReturnValue({ events: { insert } } as never);

    const response = await POST(
      new Request("https://admin.forif.org/api/calendar/events", {
        method: "POST",
        body: JSON.stringify({
          summary: "FORIF 회의",
          description: "릴리즈 점검",
          start: "2026-09-07T10:00:00",
          end: "2026-09-07T11:00:00",
          color: "green",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ id: "event-id" });
    expect(insert).toHaveBeenCalledWith({
      calendarId: "calendar-id",
      requestBody: {
        summary: "FORIF 회의",
        description: "릴리즈 점검",
        start: { dateTime: "2026-09-07T10:00:00", timeZone: "Asia/Seoul" },
        end: { dateTime: "2026-09-07T11:00:00", timeZone: "Asia/Seoul" },
        colorId: "2",
      },
    });
  });
});
